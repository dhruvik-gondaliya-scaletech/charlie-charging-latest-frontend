import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface SlackWebhookData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

export const useSlackWebhook = () => {
  return useMutation({
    mutationFn: async (data: SlackWebhookData) => {
      const webhookUrl = process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL;
      if (!webhookUrl || webhookUrl.includes('XXXXXXXXXXXXXXXXXXXXXXXX')) {
        throw new Error('Slack Webhook URL is not configured');
      }

      // Fetch client IP and location info
      let ipAddress = 'Unknown';
      let location = 'Unknown';
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          ipAddress = ipData.ip || 'Unknown';
          const locParts = [ipData.city, ipData.region, ipData.country_name].filter(Boolean);
          if (locParts.length > 0) {
            location = locParts.join(', ');
          }
        }
      } catch (err) {
        console.error('Failed to fetch client IP and location info:', err);
      }

      // Format rich Slack Blocks payload for modern team notifications
      const payload = {
        text: `New Contact Submission from ${data.firstName} ${data.lastName}`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '⚡ New Contact Form Submission',
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Name:*\n${data.firstName} ${data.lastName}`,
              },
              {
                type: 'mrkdwn',
                text: `*Email:*\n${data.email}`,
              },
            ],
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Company:*\n${data.company || 'N/A'}`,
              },
              {
                type: 'mrkdwn',
                text: `*Subject:*\n${data.subject}`,
              },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Message:*\n${data.message}`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `*IP Address:* ${ipAddress}  |  *Location:* ${location}`,
              },
            ],
          },
        ],
      };

      // Since Slack webhooks do not support CORS for direct client-side requests,
      // we use mode: 'no-cors' to allow the browser to successfully send the POST request
      // without failing on CORS pre-flight/response checks.
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors',
      });

      // With mode 'no-cors', we cannot read the response body or status (it is opaque),
      // but the request is guaranteed to be sent to Slack's servers.
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Thank you! Your message has been sent successfully.');
    },
    onError: (error: any) => {
      console.error('Slack webhook submission failed:', error);
      toast.error(error.message || 'Failed to send message. Please check your connection.');
    },
  });
};

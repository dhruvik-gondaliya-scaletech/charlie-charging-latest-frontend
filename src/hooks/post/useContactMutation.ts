import { useMutation } from '@tanstack/react-query';
import { ContactService, ContactFormData } from '@/services/contact.service';
import { toast } from 'sonner';

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (data: ContactFormData) => ContactService.submitForm(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please check your connection.';
      toast.error(errorMessage);
      console.error('Contact form error:', error);
    },
  });
};

'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What protocols does Scale EV support?',
    answer: 'We support full OCPP 1.6 J for charging station communication, ensuring maximum compatibility with current hardware.'
  },
  {
    question: 'How secure is the platform?',
    answer: 'Security is our top priority. We use TLS for all communication, industry-standard OAuth2 for authentication, and regular third-party security audits.'
  },
  {
    question: 'Can I use my existing hardware?',
    answer: 'Yes! As long as your hardware is OCPP compliant, you can onboard it to Scale EV in minutes using our zero-touch provisioning tools.'
  },
  {
    question: 'Do you provide a mobile app for drivers?',
    answer: 'Absolutely. We provide a premium White-label PWA (Progressive Web App) that drivers can use to find, start, and pay for charging sessions without downloading anything from an app store.'
  },
  {
    question: 'How do payments work?',
    answer: 'We integrate directly with Stripe, allowing you to accept global payments, manage taxes, and automate payouts to station owners effortlessly.'
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-8 bg-background/50 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold tracking-tighter mb-4 text-foreground"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground font-medium"
          >
            Everything you need to know about the platform.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border border-border/50 bg-card/30 backdrop-blur-xl px-6 rounded-2xl overflow-hidden hover:bg-card/50 transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-6 text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-medium pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

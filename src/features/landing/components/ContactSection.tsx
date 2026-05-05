'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSubmitContact } from '@/hooks/post/useContactMutation';
import { ContactFormData } from '@/services/contact.service';
import { staggerContainer, staggerItem } from '@/lib/motion';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1, { message: 'Please select a subject.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export function ContactSection() {
  const { mutate: submitContact, isPending: isSubmitting } = useSubmitContact();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    submitContact(values as ContactFormData, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <section id="contact" className="py-24 px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/3 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col"
        >
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Get In Touch</p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-8 text-foreground">Reach Out And Contact Us</h2>
          
          <div className="space-y-8 mb-12">
            {[
              { label: "Sales & Inquiries", value: "sales@scale-ev.com", icon: Mail },
              { label: "Technical Support", value: "support@scale-ev.com", icon: Mail },
              { label: "Office Address", value: "123 Energy Way, Silicon Valley, CA", icon: MapPin }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-1">{item.label}</p>
                  <p className="text-lg font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-border/50">
            <Image
              src="https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?q=80&w=2072&auto=format&fit=crop"
              alt="EV Charging Contact"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-card/30 backdrop-blur-xl p-8 lg:p-10 rounded-[2.5rem] border border-border shadow-2xl relative z-10"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">Company (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Scale EV Inc." {...field} className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all w-full">
                          <SelectValue placeholder="How can we help?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-border backdrop-blur-xl">
                        <SelectItem value="Demo Request">Demo Request</SelectItem>
                        <SelectItem value="Technical Support">Technical Support</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Pricing Inquiry">Pricing Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your requirements..." 
                        className="bg-background/50 border-border/50 min-h-[120px] rounded-xl focus:border-primary/50 transition-all py-4 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 h-auto rounded-xl font-bold text-base bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}

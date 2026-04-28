'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
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
    <section id="contact" className="py-24 px-8 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/3 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid lg:grid-cols-5 gap-16"
        >
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div variants={staggerItem}>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-6 text-foreground">
                Get in Touch
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                Have questions about our charging platform? Our team is here to help you scale your network efficiently.
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Email Us</p>
                  <p className="text-muted-foreground">sales@scaleev.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Call Us</p>
                  <p className="text-muted-foreground">+1 (555) 000-0000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Our Office</p>
                  <p className="text-muted-foreground">123 Energy Way, Silicon Valley, CA</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div 
            variants={staggerItem}
            className="lg:col-span-3 bg-card/30 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-primary/5"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
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
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+1..." {...field} className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
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
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your requirements..." 
                          className="bg-background/50 border-border/50 min-h-[150px] rounded-2xl focus:border-primary/50 transition-all py-4"
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
                  className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 hover:scale-[1.01] transition-all shadow-xl shadow-primary/20"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

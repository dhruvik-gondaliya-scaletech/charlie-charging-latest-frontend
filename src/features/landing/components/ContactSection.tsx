'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

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
import { useSlackWebhook } from '@/hooks/post/useSlackWebhook';

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
  const { mutate: submitContact, isPending: isSubmitting } = useSlackWebhook();
  const sectionRef = React.useRef<HTMLElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay check:", err);
      });
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    submitContact(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 bg-background relative overflow-hidden flex items-center justify-center min-h-[700px]"
    >
      {/* Background Video (Fully Visible with Parallax) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div style={{ y: videoY }} className="absolute -inset-y-20 inset-x-0 h-[calc(100%+160px)]">
          <video
            ref={videoRef}
            src="https://d39uw1u176mxxs.cloudfront.net/branding-videos/scaleev-brnading1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-100"
          />
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto px-6 relative z-10 w-full">

        {/* Centered Form Card with Header Inside */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="w-full"
        >
          <motion.div
            variants={itemVariants}
            className="w-full p-8 sm:p-10 rounded-3xl border border-border/50 bg-background/60 dark:bg-background/40 backdrop-blur-xl shadow-2xl space-y-10"
          >
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto flex flex-col space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Let's Build the Future of EV Charging Together
              </h2>
              <p className="text-foreground text-sm font-medium leading-relaxed">
                Have questions or want to see a customized demonstration? Contact our enterprise EV infrastructure team today.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-black dark:text-white ml-1">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all font-medium text-sm"
                          />
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
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-black dark:text-white ml-1">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all font-medium text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-black dark:text-white ml-1">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                            className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all font-medium text-sm"
                          />
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
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-black dark:text-white ml-1">
                          Company (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Scale EV Inc."
                            {...field}
                            className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all font-medium text-sm"
                          />
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
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-black dark:text-white ml-1">
                        Subject
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all w-full text-sm font-medium">
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
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-black dark:text-white ml-1">
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your requirements..."
                          className="bg-background/50 border-border/50 min-h-[120px] rounded-xl focus:border-primary/50 transition-all py-4 resize-none font-medium text-sm"
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
        </motion.div>

      </div>
    </section>
  );
}

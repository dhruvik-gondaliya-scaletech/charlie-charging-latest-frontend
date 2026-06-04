'use client';

import React, { useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { z } from 'zod';
import {
  Building2,
  Globe,
  Fingerprint,
  Save,
  Loader2,
  Settings
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTenantConfig } from '@/hooks/get/useTenantConfig';
import { useUpdateTenantConfig } from '@/hooks/put/useUpdateTenantConfig';
import { staggerItem } from '@/lib/motion';

const OcpiLocalSettingsSchema = z.object({
  ocpiCpoName: z
    .string()
    .min(1, 'CPO Name is required')
    .max(50, 'CPO Name is too long'),
  ocpiCountryCode: z
    .string()
    .min(2, 'Country code must be exactly 2 characters')
    .max(2, 'Country code must be exactly 2 characters')
    .regex(/^[A-Za-z]{2}$/, 'Country code must be exactly 2 alphabetic characters'),
  ocpiPartyId: z
    .string()
    .min(3, 'Party ID must be exactly 3 characters')
    .max(3, 'Party ID must be exactly 3 characters')
    .regex(/^[A-Za-z0-9]{3}$/, 'Party ID must be exactly 3 alphanumeric characters'),
});

type OcpiLocalSettingsValues = z.infer<typeof OcpiLocalSettingsSchema>;

export function OcpiLocalSettings() {
  const { data: config, isLoading } = useTenantConfig();
  const updateConfig = useUpdateTenantConfig();

  const form = useForm<OcpiLocalSettingsValues>({
    resolver: zodResolver(OcpiLocalSettingsSchema) as unknown as Resolver<OcpiLocalSettingsValues>,
    defaultValues: {
      ocpiCpoName: '',
      ocpiCountryCode: '',
      ocpiPartyId: '',
    },
  });

  useEffect(() => {
    if (config) {
      form.reset({
        ocpiCpoName: config.ocpiCpoName || '',
        ocpiCountryCode: config.ocpiCountryCode || '',
        ocpiPartyId: config.ocpiPartyId || '',
      });
    }
  }, [config, form]);

  const onSubmit = (values: OcpiLocalSettingsValues) => {
    if (!config) return;
    updateConfig.mutate({
      ...values,
      ocpiCountryCode: values.ocpiCountryCode.toUpperCase(),
      ocpiPartyId: values.ocpiPartyId.toUpperCase(),
      domain: config.domain, // domain is required by the backend DTO validation
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div variants={staggerItem} className="max-w-[800px] mx-auto space-y-8 p-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-border/40 bg-card/10 backdrop-blur-sm overflow-hidden rounded-[2.5rem] shadow-none">
            <CardHeader className="p-5 sm:p-8 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black tracking-tight">CPO Configuration</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest mt-1">
                      OCPI Node Local Identification Settings
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-8 py-4 space-y-6">
              {/* CPO Name */}
              <FormField
                control={form.control}
                name="ocpiCpoName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70 ml-1">
                      CPO Name (Brand Name)
                    </FormLabel>
                    <div className="relative flex items-center">
                      <Building2 className="absolute left-4 h-4 w-4 text-muted-foreground/50" />
                      <FormControl>
                        <Input
                          placeholder="e.g. Scale EV CPO"
                          {...field}
                          className="h-12 pl-11 bg-background border-border/40 focus-visible:ring-primary/20 rounded-xl font-bold"
                        />
                      </FormControl>
                    </div>
                    <FormDescription className="text-[10px] ml-1">
                      The official branding name of your CPO nodes exposed to roaming partners.
                    </FormDescription>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country Code */}
                <FormField
                  control={form.control}
                  name="ocpiCountryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70 ml-1">
                        Country Code
                      </FormLabel>
                      <div className="relative flex items-center">
                        <Globe className="absolute left-4 h-4 w-4 text-muted-foreground/50" />
                        <FormControl>
                          <Input
                            placeholder="e.g. NL"
                            maxLength={2}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            className="h-12 pl-11 bg-background border-border/40 focus-visible:ring-primary/20 rounded-xl font-bold uppercase"
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-[10px] ml-1">
                        ISO-3166 2-letter country code of your service (e.g., NL, US).
                      </FormDescription>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                {/* Party ID */}
                <FormField
                  control={form.control}
                  name="ocpiPartyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70 ml-1">
                        Party ID
                      </FormLabel>
                      <div className="relative flex items-center">
                        <Fingerprint className="absolute left-4 h-4 w-4 text-muted-foreground/50" />
                        <FormControl>
                          <Input
                            placeholder="e.g. CHG"
                            maxLength={3}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            className="h-12 pl-11 bg-background border-border/40 focus-visible:ring-primary/20 rounded-xl font-bold uppercase"
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-[10px] ml-1">
                        Unique 3-character identification code for your CPO node.
                      </FormDescription>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              disabled={updateConfig.isPending || !form.formState.isDirty}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold px-6 h-12 rounded-xl"
            >
              {updateConfig.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Settings...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save CPO Configuration
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}

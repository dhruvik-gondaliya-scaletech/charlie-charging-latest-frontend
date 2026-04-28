'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Mail, 
  Phone, 
  Globe, 
  Save, 
  Loader2, 
  Layout, 
  ShieldCheck 
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
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { DriverAppConfigSchema, DriverAppConfigValues } from '@/lib/validations/config.schema';
import { useTenantConfig } from '@/hooks/get/useTenantConfig';
import { useUpdateTenantConfig } from '@/hooks/put/useUpdateTenantConfig';
import { staggerItem } from '@/lib/motion';

const BASE_DOMAIN = 'scale-ev.scaletech.xyz';

export function DriverAppConfig() {
  const { data: config, isLoading } = useTenantConfig();
  const updateConfig = useUpdateTenantConfig();

  const form = useForm<DriverAppConfigValues>({
    resolver: zodResolver(DriverAppConfigSchema),
    defaultValues: {
      appName: 'Scale EV',
      logoUrl: '',
      supportContact: {
        email: '',
        phone: '',
        website: '',
      },
      domain: '',
    },
  });

  useEffect(() => {
    if (config) {
      form.reset({
        appName: config.appName || 'Scale EV',
        logoUrl: config.logoUrl || '',
        supportContact: {
          email: config.supportContact?.email || '',
          phone: config.supportContact?.phone || '',
          website: config.supportContact?.website || '',
        },
        domain: config.domain || '',
      });
    }
  }, [config, form]);

  const onSubmit = (values: DriverAppConfigValues) => {
    updateConfig.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 p-1">
      <div className="lg:col-span-2 space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* General Branding Section */}
            <Card className="border-border/40 bg-card/10 backdrop-blur-sm overflow-hidden rounded-[2.5rem] shadow-none">
              <CardHeader className="p-5 sm:p-8 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Layout className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black tracking-tight">App Branding</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest mt-1">Logo and identity configuration</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] uppercase font-black tracking-widest border-border/60 bg-muted/30 px-3 py-1 rounded-full">
                    <Smartphone className="h-3 w-3 mr-1.5" />
                    White Label
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-8 py-4 space-y-6">
                <FormField
                  control={form.control}
                  name="appName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70 ml-1">App Display Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. My Charging App" 
                          {...field} 
                          className="h-12 bg-background border-border/40 focus-visible:ring-primary/20 rounded-xl font-bold"
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] ml-1">This name will appear in the driver app title bar and notifications.</FormDescription>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70 ml-1">Application Logo</FormLabel>
                      <FormControl>
                        <ImageUpload 
                          value={field.value} 
                          onChange={field.onChange} 
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] ml-1">Upload a high-resolution logo for the driver application interface.</FormDescription>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70 ml-1">App Domain</FormLabel>
                      <FormControl>
                        <div className="flex flex-col sm:flex-row sm:items-center group transition-all border border-border/40 rounded-xl overflow-hidden focus-within:border-primary/40">
                          <div className="flex items-center h-10 sm:h-12 px-4 bg-muted/30 text-muted-foreground/60 text-[10px] sm:text-xs font-bold whitespace-nowrap group-focus-within:text-primary transition-all border-b sm:border-b-0 sm:border-r border-border/40">
                            https://
                          </div>
                          <Input 
                            placeholder="subdomain" 
                            {...field} 
                            className="h-10 sm:h-12 bg-background border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none font-bold text-sm sm:text-base flex-1"
                          />
                          <div className="flex items-center h-10 sm:h-12 px-4 bg-muted/30 text-muted-foreground/60 text-[10px] sm:text-xs font-bold whitespace-nowrap group-focus-within:text-primary transition-all border-t sm:border-t-0 sm:border-l border-border/40 overflow-hidden">
                            <span className="truncate">.{BASE_DOMAIN}</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription className="text-[10px] ml-1">The domain used to identify your tenant's driver configuration.</FormDescription>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Support Information Section */}
            <Card className="border-border/40 bg-card/10 backdrop-blur-sm overflow-hidden rounded-[2.5rem] shadow-none">
              <CardHeader className="p-5 sm:p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black tracking-tight">Support Connectivity</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest mt-1">How drivers can reach your support team</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-8 py-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="supportContact.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70 ml-1">Support Email</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-40" />
                          <FormControl>
                            <Input 
                              placeholder="support@example.com" 
                              {...field} 
                              className="h-12 pl-11 bg-background border-border/40 focus-visible:ring-primary/20 rounded-xl font-bold"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supportContact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70 ml-1">Support Phone</FormLabel>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-40" />
                          <FormControl>
                            <Input 
                              placeholder="+1 (234) 567-8900" 
                              {...field} 
                              className="h-12 pl-11 bg-background border-border/40 focus-visible:ring-primary/20 rounded-xl font-bold"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="supportContact.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70 ml-1">Support Website</FormLabel>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-40" />
                        <FormControl>
                          <Input 
                            placeholder="https://support.example.com" 
                            {...field} 
                            className="h-12 pl-11 bg-background border-border/40 focus-visible:ring-primary/20 rounded-xl font-bold"
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
              </CardContent>
              <div className="p-5 sm:p-8 pt-4 border-t border-border/40 bg-muted/20">
                <Button 
                  type="submit" 
                  disabled={updateConfig.isPending}
                  className="w-full md:w-fit min-w-[200px] h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-black uppercase tracking-widest text-xs rounded-xl"
                >
                  {updateConfig.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Configuration
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>
        </Form>
      </div>

      <div className="space-y-6">
        {/* Preview Card */}
        <Card className="border-border/40 bg-primary/5 rounded-[2.5rem] shadow-none overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary/80">Live Preview</CardTitle>
            <CardDescription className="text-xs font-medium">How it looks in the Driver App</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="aspect-[9/16] w-full max-w-[280px] mx-auto bg-background rounded-[3rem] border-8 border-border/20 shadow-2xl relative overflow-hidden flex flex-col">
              <div className="h-6 w-1/2 bg-border/20 mx-auto rounded-b-2xl mb-4" />
              
              <div className="flex-1 p-6 flex flex-col items-center">
                <div className="h-20 w-20 rounded-3xl bg-muted/20 border border-border/10 flex items-center justify-center overflow-hidden mb-6">
                  {form.watch('logoUrl') ? (
                    <img src={form.watch('logoUrl')} alt="Preview" className="h-full w-full object-contain p-2" />
                  ) : (
                    <Smartphone className="h-8 w-8 text-muted-foreground/20" />
                  )}
                </div>
                
                <h4 className="text-xl font-black tracking-tight text-center">{form.watch('appName') || 'Scale EV'}</h4>
                <div className="h-2 w-32 bg-primary/20 rounded-full mt-2" />
                
                <div className="w-full space-y-3 mt-12">
                  <div className="h-14 w-full bg-primary/5 border border-primary/10 rounded-2xl flex flex-col items-center justify-center gap-1 p-3">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">App Domain</p>
                    <p className="text-[8px] font-bold text-center break-all text-primary/80 truncate w-full px-2">
                      https://{form.watch('domain') || 'tenant'}.{BASE_DOMAIN}
                    </p>
                  </div>
                  <div className="h-12 w-full bg-muted/20 rounded-xl flex items-center justify-center">
                    <div className="h-1 w-1/2 bg-muted/30 rounded-full" />
                  </div>
                  <div className="h-24 w-full bg-primary/10 rounded-2xl flex flex-col items-center justify-center gap-2 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Support Contact</p>
                    <p className="text-[10px] font-bold">{form.watch('supportContact.email') || 'support@contact.com'}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="h-1 bg-muted/20 w-1/3 mx-auto rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Info */}
        <div className="p-6 rounded-[2rem] border border-border/40 bg-card/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h5 className="text-xs font-black uppercase tracking-widest">Enterprise Security</h5>
          </div>
          <p className="text-[10px] font-medium leading-relaxed text-muted-foreground opacity-80">
            External configurations are encrypted at rest and delivered via secure global CDN to end-user mobile devices.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

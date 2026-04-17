'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-24 px-8 bg-background">
      <div className="max-w-5xl mx-auto text-center py-24 px-8 rounded-[3rem] bg-muted/30 border border-border relative overflow-hidden shadow-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none dark:opacity-[0.03]">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-8 text-foreground">
            Ready to power <br />the future?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
            Join the world&apos;s most advanced charging networks. Set up your first station in under 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground px-10 py-7 h-auto rounded-2xl text-lg font-bold hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-2xl shadow-primary/20 hover:shadow-primary/30">
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="bg-background text-foreground px-10 py-7 h-auto rounded-2xl text-lg font-bold border-border hover:border-foreground hover:bg-accent hover:scale-[1.02] transition-all">
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

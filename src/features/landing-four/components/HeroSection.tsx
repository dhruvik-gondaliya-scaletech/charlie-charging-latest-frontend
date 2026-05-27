'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookADemo from './BookADemo';

export function HeroSection() {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay check:", err);
      });
    }
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="home" className="relative min-h-screen pt-36 pb-20 flex items-center justify-center overflow-hidden bg-background">
      {/* Background Video & Legibility Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src="https://d39uw1u176mxxs.cloudfront.net/branding-videos/scale-ev-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-75 dark:opacity-40 brightness-[1.] dark:brightness-[1.0]"
        />
      </div>



      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-6 w-full flex flex-col items-center text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          {/* Glassmorphic Panel for Hero Text & CTAs */}
          <div className="flex flex-col items-center text-center space-y-8 md:space-y-10 w-full bg-black/40 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.03)] mb-10">

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] max-w-3xl"
            >
              Scale Your EV Charging Network. Globally.
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl font-semibold leading-relaxed"
            >
              Hardware-agnostic OCPP management software built for global fleet operators, commercial properties, and public charging networks. Fully OCPP 2.0.1 compliant.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex items-center justify-center w-full sm:w-auto">
              <BookADemo className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:scale-[1.03] active:scale-[0.98] transition-all rounded-full px-8 py-6 text-base font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </BookADemo>
            </motion.div>
          </div>

          {/* Value props (Compliance & Trust Certificates) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 w-full max-w-3xl"
          >
            {/* Badge 1: OCA Compliance */}
            <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-border/50 shadow-md">
              <Image
                src="/assets/OCA_1.png"
                alt="OCA OCPP Certified"
                width={42}
                height={36}
                className="object-contain shrink-0"
              />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-foreground leading-tight">OCPP Certified</span>
                <span className="text-xs text-muted-foreground leading-tight">Open Charge Alliance</span>
              </div>
            </div>

            {/* Badge 2: Security & Privacy */}
            <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-border/50 shadow-md">
              <div className="flex items-center gap-1.5 shrink-0">
                <Image
                  src="/assets/ISO_27001_2022 1.png"
                  alt="ISO 27001"
                  width={35}
                  height={30}
                  className="object-contain"
                />
                <Image
                  src="/assets/ISO_27017_2015.png"
                  alt="ISO 27017"
                  width={35}
                  height={30}
                  className="object-contain"
                />
                <Image
                  src="/assets/ISO_27018_2019.png"
                  alt="ISO 27018"
                  width={35}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-foreground leading-tight">Information Security</span>
                <span className="text-xs text-muted-foreground leading-tight">ISO 27001 / 17 / 18</span>
              </div>
            </div>

            {/* Badge 3: Quality Management */}
            <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-border/50 shadow-md">
              <Image
                src="/assets/ISO_9001_2015 1.png"
                alt="ISO 9001:2015"
                width={35}
                height={30}
                className="object-contain shrink-0"
              />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-foreground leading-tight">Quality Management</span>
                <span className="text-xs text-muted-foreground leading-tight">ISO 9001:2015 Certified</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

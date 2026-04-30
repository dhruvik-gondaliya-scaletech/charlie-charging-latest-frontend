'use client';

import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react';

export function PublicFooter() {
  const sections = [
    {
      title: 'Platform',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'App Preview', href: '#app' },
        { name: 'OCPP Support', href: '#protocols' },
        { name: 'Roadmap', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'API Reference', href: '#' },
        { name: 'Security', href: '#' },
        { name: 'Support', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Privacy Policy', href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Github, href: '#' },
    { icon: Instagram, href: '#' }
  ];

  return (
    <footer className="w-full border-t border-border/50 bg-background pt-24 pb-12 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-8 transition-transform hover:scale-105 duration-500">
              <BrandLogo width={120} height={32} />
            </Link>
            <p className="text-muted-foreground text-lg font-medium max-w-sm leading-relaxed mb-8">
              The global standard for electric vehicle charging infrastructure management. Weightless operations at scale.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-foreground">{section.title}</h4>
              <ul className="flex flex-col gap-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[11px] font-black tracking-widest uppercase text-muted-foreground/50">
            © {new Date().getFullYear()} Scale EV Platform. Built for the future of mobility.
          </div>
          <div className="flex gap-8 text-[11px] font-black tracking-widest uppercase text-muted-foreground/50">
            <Link href="#" className="hover:text-primary transition-colors">System Status</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

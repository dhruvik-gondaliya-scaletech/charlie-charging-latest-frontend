'use client';

import Link from 'next/link';

export function PublicFooter() {
  const sections = [
    {
      title: 'Product',
      links: ['Platform', 'Features']
    },
    {
      title: 'Resources',
      links: ['Documentation', 'API Reference', 'Support']
    },
    {
      title: 'Company',
      links: ['About', 'Careers', 'Contact']
    }
  ];

  return (
    <footer className="w-full border-t border-border bg-background">
      {/* <div className="grid grid-cols-2 md:flex md:justify-between items-start px-8 py-16 max-w-7xl mx-auto">
        <div className="col-span-2 md:col-span-1 mb-12 md:mb-0">
          <div className="text-lg font-bold tracking-tighter text-foreground mb-4">Scale EV</div>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed font-medium">
            The global standard for electric vehicle charging infrastructure management.
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h4 className="font-bold text-sm text-foreground uppercase tracking-widest">{section.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-medium">
              {section.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="hover:text-foreground underline-offset-4 hover:underline transition-opacity"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div> */}

      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-muted-foreground font-medium">
          © {new Date().getFullYear()} Scale EV. All rights reserved.
        </div>
        <div className="flex gap-8 text-sm text-muted-foreground/60 font-medium">
          <Link href="#contact" className="hover:text-foreground transition-colors">Contact</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

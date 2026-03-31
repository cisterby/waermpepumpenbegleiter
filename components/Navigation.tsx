'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf } from 'lucide-react';

const navLinks = [
  { href: '/wie-es-funktioniert', label: 'Wie es funktioniert' },
  { href: '/rechner', label: 'Rechner' },
  { href: '/ratgeber', label: 'Ratgeber' },
  { href: '/ueber-uns', label: 'Über uns' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F7F5F0]/95 backdrop-blur-md shadow-wp-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-wp-primary transition-transform group-hover:rotate-12" strokeWidth={2} />
              </div>
              <span className="font-body font-semibold text-[15px] text-wp-primary hidden sm:block">
                Wärmepumpenbegleiter
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-[14px] font-medium text-wp-text-secondary hover:text-wp-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/kontakt"
                className="font-body text-[14px] font-medium text-wp-text-secondary hover:text-wp-primary transition-colors px-4 py-2"
              >
                Kontakt
              </Link>
              <Link
                href="/rechner"
                className="btn-primary text-[14px] py-2.5 px-5"
              >
                Kostenloses Angebot
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-wp-primary"
              aria-label="Menü öffnen"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#F7F5F0]"
          >
            <div className="flex items-center justify-between h-[72px] px-6">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <Leaf className="w-6 h-6 text-wp-primary" strokeWidth={2} />
                <span className="font-body font-semibold text-[15px] text-wp-primary">
                  Wärmepumpenbegleiter
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-wp-primary"
                aria-label="Menü schließen"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 pt-20">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-3xl font-semibold text-wp-primary hover:text-wp-primary-mid transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/kontakt"
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-3xl font-semibold text-wp-primary hover:text-wp-primary-mid transition-colors"
                >
                  Kontakt
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4"
              >
                <Link
                  href="/rechner"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-base py-3 px-8"
                >
                  Kostenloses Angebot &rarr;
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

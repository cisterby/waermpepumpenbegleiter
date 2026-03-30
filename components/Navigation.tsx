'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf, ArrowRight } from 'lucide-react';

const navLinks = [
  { href: '/#wie-es-funktioniert', label: 'Wie es funktioniert' },
  { href: '/rechner', label: 'Rechner' },
  { href: '/waermepumpe-foerderung/berlin', label: 'Förderung' },
  { href: '/ratgeber', label: 'Ratgeber' },
  { href: '/ueber-uns', label: 'Über uns' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(247,245,240,0.97)'
            : 'rgba(247,245,240,0.82)',
          backdropFilter: 'blur(14px)',

          boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                scrolled ? 'bg-wp-green' : 'bg-wp-green'
              }`}>
                <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className={`font-heading font-bold text-[15px] hidden sm:block transition-colors ${
                scrolled ? 'text-wp-green' : 'text-wp-green'
              }`}>
                Wärmepumpenbegleiter
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className={`font-sans text-[13.5px] font-medium px-3.5 py-2 rounded-lg transition-all ${
                    scrolled
                      ? 'text-wp-text2 hover:text-wp-green hover:bg-wp-greenlt'
                      : 'text-wp-green hover:text-wp-green2 hover:bg-wp-greenlt'
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/kontakt"
                className={`font-sans text-[13.5px] font-medium px-3.5 py-2 rounded-lg transition-all ${
                  scrolled
                    ? 'text-wp-text2 hover:text-wp-green hover:bg-wp-greenlt'
                    : 'text-wp-green hover:text-wp-green2 hover:bg-wp-greenlt'
                }`}>
                Kontakt
              </Link>
              <Link href="/rechner"
                className={`flex items-center gap-1.5 font-heading font-bold text-[13.5px] px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 ${
                  scrolled
                    ? 'bg-wp-green text-white hover:bg-wp-green2 shadow-wp-sm'
                    : 'bg-wp-green text-white hover:bg-wp-green2 shadow-wp-sm'
                }`}>
                Kostenloses Angebot <ArrowRight size={13} />
              </Link>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-wp-green hover:bg-wp-greenlt' : 'text-wp-green hover:bg-wp-greenlt'
              }`}
              aria-label="Menü öffnen">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[100]"
            style={{ background: '#0A1910' }}
          >
            <div className="flex items-center justify-between h-[72px] px-6 border-b border-white/8">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                <div className="w-8 h-8 bg-wp-green rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-heading font-bold text-white">Wärmepumpenbegleiter</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col px-6 pt-8 gap-1">
              {[...navLinks, { href: '/kontakt', label: 'Kontakt' }].map((link, i) => (
                <motion.div key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <Link href={link.href} onClick={() => setMobileOpen(false)}
                    className="block font-heading font-semibold text-2xl text-white/80 hover:text-white py-3 border-b border-white/6 transition-colors">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6">
                <Link href="/rechner" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-wp-amber text-white font-heading font-bold text-base rounded-xl">
                  Kostenloses Angebot <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

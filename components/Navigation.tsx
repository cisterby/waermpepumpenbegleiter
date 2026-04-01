// components/Navigation.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Leaf, ChevronDown } from 'lucide-react';

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
    const onScroll = () => setScrolled(window.scrollY > 30);
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
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-md border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                scrolled ? 'bg-[#1A4731]' : 'bg-white/20'
              }`}>
                <Leaf className={`w-4.5 h-4.5 transition-colors ${
                  scrolled ? 'text-white' : 'text-white'
                }`} strokeWidth={2.5} size={18} />
              </div>
              <div>
                <span className={`font-semibold text-[15px] leading-none block transition-colors ${
                  scrolled ? 'text-[#1A4731]' : 'text-white'
                }`}>
                  Wärmepumpenbegleiter
                </span>
                <span className={`text-[10px] font-medium tracking-widest uppercase transition-colors ${
                  scrolled ? 'text-[#4A6358]' : 'text-white/70'
                }`}>
                  kostenlose Vermittlung
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[14px] font-medium px-4 py-2 rounded-lg transition-all ${
                    scrolled
                      ? 'text-[#1C2B2B] hover:text-[#1A4731] hover:bg-[#1A4731]/8'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href="tel:+4915563566199"
                className={`flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-2 rounded-lg transition-all ${
                  scrolled
                    ? 'text-[#1A4731] hover:bg-[#1A4731]/8'
                    : 'text-white/80 hover:text-white hover:bg-white/15'
                }`}
              >
                <Phone size={14} />
                +49 15563 566199
              </a>
              <Link
                href="/kontakt"
                className={`text-[14px] font-medium px-4 py-2 rounded-lg transition-all ${
                  scrolled
                    ? 'text-[#4A6358] hover:text-[#1A4731] hover:bg-[#1A4731]/8'
                    : 'text-white/80 hover:text-white hover:bg-white/15'
                }`}
              >
                Kontakt
              </Link>
              <Link
                href="/rechner"
                className="bg-[#1A4731] hover:bg-[#2D7A52] text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Kostenloses Angebot →
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden p-2.5 rounded-lg transition-colors ${
                scrolled ? 'text-[#1A4731] hover:bg-[#1A4731]/8' : 'text-white hover:bg-white/15'
              }`}
              aria-label="Menü öffnen"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between px-5 h-[68px] border-b border-gray-100">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="w-8 h-8 bg-[#1A4731] rounded-lg flex items-center justify-center">
                  <Leaf size={16} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="font-semibold text-[15px] text-[#1A4731]">Wärmepumpenbegleiter</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Menü schließen"
              >
                <X size={22} />
              </button>
            </div>

            {/* Phone CTA prominent */}
            <a
              href="tel:+4915563566199"
              className="mx-5 mt-5 flex items-center justify-center gap-2.5 py-3.5 bg-[#1A4731]/10 border border-[#1A4731]/20 rounded-2xl text-[#1A4731] font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              <Phone size={18} />
              +49 15563 566199
            </a>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-1">
              {[...navLinks, { href: '/kontakt', label: 'Kontakt' }].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[16px] font-medium text-[#1C2B2B] hover:bg-[#1A4731]/8 hover:text-[#1A4731] transition-all"
                  >
                    {link.label}
                    <ChevronDown size={16} className="-rotate-90 text-gray-400" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom CTA */}
            <div className="p-5 border-t border-gray-100">
              <Link
                href="/rechner"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-[#1A4731] hover:bg-[#2D7A52] text-white font-semibold py-4 rounded-2xl text-[15px] transition-all"
              >
                Kostenloses Angebot anfordern →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

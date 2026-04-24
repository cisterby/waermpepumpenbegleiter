// components/Navigation.tsx
// Contrast rules:
// - transparent (hero overlay): white text on dark image → text-white, min opacity 90%
// - scrolled (white bg): dark green text → #1A4731 / #1C2B2B
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Leaf, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '/wie-es-funktioniert', label: 'Wie es funktioniert' },
  { href: '/rechner',             label: 'Rechner' },
  { href: '/ratgeber',            label: 'Ratgeber' },
  { href: '/faq',                 label: 'FAQ' },
  { href: '/ueber-uns',           label: 'Über uns' },
];

export default function Navigation() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // ── color tokens ──────────────────────────────────────
  // transparent state: white over dark hero image
  const T_TEXT      = 'rgba(255,255,255,1.0)';   // links
  const T_SUBTEXT   = 'rgba(255,255,255,0.80)';  // phone, secondary
  const T_HOVER_BG  = 'rgba(255,255,255,0.15)';

  // scrolled state: dark text on white bg
  const S_TEXT      = '#1C2B2B';
  const S_PRIMARY   = '#1A4731';
  const S_HOVER_BG  = 'rgba(26,71,49,0.08)';

  const linkStyle = (base = false) => scrolled
    ? { color: base ? S_PRIMARY : S_TEXT }
    : { color: T_TEXT };

  const subStyle = () => scrolled
    ? { color: S_TEXT }
    : { color: T_SUBTEXT };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : 'none',
          boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: scrolled ? '#1A4731' : 'rgba(255,255,255,0.22)' }}>
                <Leaf size={17} style={{ color: 'white' }} strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-semibold text-[14px] leading-none block"
                  style={linkStyle(true)}>
                  Wärmepumpenbegleiter
                </span>
                <span className="text-[10px] font-medium tracking-widest uppercase block mt-0.5"
                  style={{ color: scrolled ? '#4A6358' : 'rgba(255,255,255,0.72)' }}>
                  kostenlose Vermittlung
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href}
                  className="text-[14px] font-medium px-4 py-2 rounded-lg transition-all"
                  style={linkStyle()}
                  onMouseEnter={e => (e.currentTarget.style.background = scrolled ? S_HOVER_BG : T_HOVER_BG)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right CTAs */}
            <div className="hidden lg:flex items-center gap-1.5">
              <a href="tel:+4915563566199"
                className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-lg transition-all"
                style={subStyle()}
                onMouseEnter={e => (e.currentTarget.style.background = scrolled ? S_HOVER_BG : T_HOVER_BG)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <Phone size={13} />
                +49 15563 566199
              </a>
              <Link href="/kontakt"
                className="text-[14px] font-medium px-4 py-2 rounded-lg transition-all"
                style={subStyle()}
                onMouseEnter={e => (e.currentTarget.style.background = scrolled ? S_HOVER_BG : T_HOVER_BG)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                Kontakt
              </Link>
              <Link href="/rechner"
                className="text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl transition-all ml-1"
                style={{ background: '#1A4731' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2D7A52')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1A4731')}>
                Kostenloses Angebot →
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 rounded-lg transition-colors"
              style={{ color: scrolled ? '#1A4731' : 'white' }}
              aria-label="Menü öffnen">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ background: '#F8F9FA' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 h-[68px]"
              style={{ borderBottom: '1px solid #E5E7EB' }}>
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: '#1A4731' }}>
                  <Leaf size={17} style={{ color: 'white' }} strokeWidth={2.5} />
                </div>
                <span className="font-semibold text-[14px]" style={{ color: '#1A4731' }}>
                  Wärmepumpenbegleiter
                </span>
              </Link>
              <button onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg"
                style={{ color: '#4A6358' }}
                aria-label="Schließen">
                <X size={22} />
              </button>
            </div>

            {/* Phone CTA */}
            <a href="tel:+4915563566199"
              className="mx-5 mt-5 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-[15px]"
              style={{ background: 'rgba(26,71,49,0.10)', border: '1.5px solid rgba(26,71,49,0.25)', color: '#1A4731' }}
              onClick={() => setMobileOpen(false)}>
              <Phone size={18} />
              +49 15563 566199
            </a>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto px-5 py-5 space-y-1">
              {[...NAV_LINKS, { href: '/kontakt', label: 'Kontakt' }].map((link, i) => (
                <motion.div key={link.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}>
                  <Link href={link.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[16px] font-medium transition-all"
                    style={{ color: '#1C2B2B' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,71,49,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {link.label}
                    <ChevronRight size={16} style={{ color: '#7A9E8E' }} />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* CTA */}
            <div className="p-5" style={{ borderTop: '1px solid #E5E7EB' }}>
              <Link href="/rechner" onClick={() => setMobileOpen(false)}
                className="block w-full text-center text-white font-semibold py-4 rounded-2xl text-[15px] transition-all"
                style={{ background: '#1A4731' }}>
                Kostenloses Angebot anfordern →
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

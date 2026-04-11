'use client';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface StickyMobileCTAProps {
  ersparnis: number;
  cityName: string;
  keywordSlug: string;
  citySlug: string;
}

export default function StickyMobileCTA({ ersparnis, cityName, keywordSlug, citySlug }: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden animate-slide-up">
      <div className="bg-[#1A4731] border-t border-[#3DA16A]/30 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0">
          <p className="text-white font-bold text-sm truncate">{Math.round(ersparnis)} €/Jahr sparen</p>
          <p className="text-white/60 text-xs truncate">Wärmepumpe {cityName}</p>
        </div>
        <a
          href="#angebot"
          className="shrink-0 flex items-center gap-1.5 bg-[#D97706] text-white text-sm font-bold px-4 py-2.5 rounded-lg min-h-[44px] hover:bg-amber-600 transition-colors"
        >
          Angebot <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

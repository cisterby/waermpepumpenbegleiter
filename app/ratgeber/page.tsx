'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { BlogCardHero, BlogCardMedium, BlogCardSmall } from '@/components/BlogCard';
import type { BlogArticle } from '@/lib/types';

const categories = ['Alle', 'GEG & Recht', 'Kosten & Förderung', 'Technik', 'Altbau', 'Neubau'];

const heroArticle: BlogArticle = {
  slug: 'geg-2026-grossstaedte',
  title: 'GEG 2026: Was sich für Hausbesitzer in Großstädten ab Juli ändert',
  excerpt: 'Ab dem 30. Juni 2026 gilt die 65%-Erneuerbare-Energie-Pflicht für alle Bestandsgebäude in Kommunen mit über 100.000 Einwohnern...',
  category: 'GEG & Recht',
  readTime: '12 Min.',
  date: 'März 2026',
  image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
  featured: true,
};

const mediumArticles: BlogArticle[] = [
  {
    slug: 'kfw-458-schritt-fuer-schritt',
    title: 'KfW 458: Schritt für Schritt zur Förderung',
    excerpt: 'Der Antrag klingt kompliziert — ist er aber nicht, wenn man die Reihenfolge kennt.',
    category: 'Kosten & Förderung',
    readTime: '8 Min.',
    date: 'Februar 2026',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    slug: 'luft-wasser-waermepumpe',
    title: 'Luft-Wasser-Wärmepumpe: Vor- und Nachteile ehrlich erklärt',
    excerpt: '92% aller neu installierten Wärmepumpen in Deutschland sind Luft-Wasser-Geräte.',
    category: 'Technik',
    readTime: '10 Min.',
    date: 'Januar 2026',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  },
];

const smallArticles: BlogArticle[] = [
  {
    slug: 'waermepumpe-altbau',
    title: 'Wärmepumpe im Altbau: Was wirklich wichtig ist',
    excerpt: '',
    category: 'Altbau',
    readTime: '7 Min.',
    date: 'Dezember 2025',
  },
  {
    slug: 'co2-preis-2026',
    title: 'CO₂-Preis 2026: Was Gas-Heizer jetzt zahlen',
    excerpt: '',
    category: 'Kosten & Förderung',
    readTime: '5 Min.',
    date: 'November 2025',
  },
  {
    slug: 'jahresarbeitszahl-jaz',
    title: 'Jahresarbeitszahl (JAZ): Der wichtigste WP-Kenner',
    excerpt: '',
    category: 'Technik',
    readTime: '6 Min.',
    date: 'Oktober 2025',
  },
];

export default function RatgeberPage() {
  const [activeCategory, setActiveCategory] = useState('Alle');
  const [searchQuery, setSearchQuery] = useState('');

  const allArticles = [heroArticle, ...mediumArticles, ...smallArticles];

  const filtered = activeCategory === 'Alle'
    ? allArticles
    : allArticles.filter((a) => a.category === activeCategory);

  const searchFiltered = searchQuery
    ? filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filtered;

  const hero = searchFiltered.find((a) => a.featured);
  const medium = searchFiltered.filter((a) => mediumArticles.some((m) => m.slug === a.slug));
  const small = searchFiltered.filter((a) => smallArticles.some((s) => s.slug === a.slug));

  return (
    <>
      <Navigation />
      <main>
        <section className="bg-wp-dark pt-28 pb-16 md:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="overline text-wp-primary-light mb-4">Wissen für Hausbesitzer</p>
              <h1 className="font-display text-white mb-4">Ratgeber Wärmepumpe</h1>
              <p className="font-body text-base text-wp-text-on-dark/70 max-w-xl leading-relaxed">
                Verständliche Erklärungen zu Technik, Kosten, Förderung und dem Gebäudeenergiegesetz.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="bg-wp-base section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-10 space-y-5">
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wp-text-light" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Artikel durchsuchen..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-[rgba(26,71,49,0.12)] bg-white font-body text-sm text-wp-text shadow-wp-sm placeholder:text-wp-text-light focus:outline-none focus:border-wp-primary-mid transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-wp-primary text-white'
                        : 'bg-white text-wp-text-secondary border border-[rgba(26,71,49,0.12)] hover:border-wp-primary-mid'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {hero && <BlogCardHero article={hero} index={0} />}

              {medium.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {medium.map((article, i) => (
                    <BlogCardMedium key={article.slug} article={article} index={i + 1} />
                  ))}
                </div>
              )}

              {small.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {small.map((article, i) => (
                    <BlogCardSmall key={article.slug} article={article} index={i + 3} />
                  ))}
                </div>
              )}
            </div>

            <section className="mt-20 bg-wp-dark rounded-2xl p-8 md:p-16 text-center">
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-white mb-4">
                Immer informiert: GEG-Updates, Förderänderungen, Preise
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8">
                <input
                  type="email"
                  placeholder="Ihre E-Mail-Adresse"
                  className="flex-1 h-12 px-4 rounded-lg bg-white/10 border border-white/20 font-body text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 transition-colors"
                />
                <button className="btn-primary bg-white text-wp-primary hover:bg-white/90 whitespace-nowrap">
                  Anmelden
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="font-body text-xs text-white/40 mt-4">
                Kein Spam. Abmeldung jederzeit. Datenschutz selbstverständlich.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { BlogArticle } from '@/lib/types';

export function BlogCardHero({ article, index }: { article: BlogArticle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative rounded-xl overflow-hidden group cursor-pointer"
      style={{ minHeight: 400 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${article.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative h-full flex flex-col justify-end p-8 md:p-12" style={{ minHeight: 400 }}>
        <span className="inline-block self-start px-3 py-1 rounded-full bg-wp-primary text-white font-body text-xs font-medium mb-4">
          {article.category}
        </span>
        <h2 className="font-display text-2xl md:text-4xl font-semibold text-white mb-3 leading-[1.2]">
          {article.title}
        </h2>
        <p className="font-body text-sm text-white/80 mb-4 max-w-2xl leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-4">
          <span className="font-body text-xs text-white/60">{article.readTime} Lesezeit · {article.date}</span>
          <span className="font-body text-sm font-medium text-white flex items-center gap-1 group-hover:gap-2 transition-all">
            Weiterlesen <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function BlogCardMedium({ article, index }: { article: BlogArticle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-premium overflow-hidden group cursor-pointer"
    >
      <div className="h-52 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${article.image})` }}
        />
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-1 rounded-full bg-wp-primary/10 text-wp-primary font-body text-xs font-medium mb-3">
          {article.category}
        </span>
        <h3 className="font-display text-xl font-medium text-wp-text mb-2 leading-[1.3]">
          {article.title}
        </h3>
        <p className="font-body text-sm text-wp-text-secondary leading-relaxed mb-4">
          {article.excerpt}
        </p>
        <span className="font-body text-xs text-wp-text-light">{article.readTime} · {article.date}</span>
      </div>
    </motion.div>
  );
}

export function BlogCardSmall({ article, index }: { article: BlogArticle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-premium p-6 group cursor-pointer"
    >
      <span className="inline-block px-3 py-1 rounded-full bg-wp-primary/10 text-wp-primary font-body text-xs font-medium mb-3">
        {article.category}
      </span>
      <h3 className="font-display text-lg font-medium text-wp-text mb-2 leading-[1.3]">
        {article.title}
      </h3>
      <span className="font-body text-xs text-wp-text-light">{article.readTime}</span>
    </motion.div>
  );
}

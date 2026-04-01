'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Testimonial } from '@/lib/types';

export default function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="card-premium p-8"
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-wp-accent-light text-wp-accent-light" />
        ))}
      </div>
      <blockquote className="font-body text-base leading-[1.7] text-wp-text-secondary mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="border-t border-wp-border pt-4">
        <p className="font-body font-semibold text-sm text-wp-text">
          {testimonial.name}
        </p>
        <p className="font-body text-xs text-wp-text-light mt-1">
          {testimonial.city}
        </p>
        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-wp-primary/5 text-wp-primary font-body text-xs font-medium">
          {testimonial.tag}
        </span>
      </div>
    </motion.div>
  );
}

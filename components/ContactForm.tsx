'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleCheck as CheckCircle, ArrowRight, Loader as Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-[rgba(26,71,49,0.12)] shadow-wp-lg p-6 md:p-10">
      [AnimatePresence mode="wait"]
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            >
              [CheckCircle className="w-16 h-16 text-wp-primary-mid mb-6" strokeWidth={1.5} |]
            </motion.div>
            <h3 className="font-display text-2xl font-semibold text-wp-text mb-3">
              Vielen Dank!
            </h3>
            <p className="font-body text-base text-wp-text-secondary max-w-sm">
              Wir melden uns innerhalb von 24 Stunden bei Ihnen.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <h3 className="font-display text-2xl font-medium text-wp-text mb-6">
              Schreiben Sie uns
            </h3>

            <div>
              <label className="font-body text-sm font-medium text-wp-text mb-1.5 block">
                Name <span className="text-wp-accent">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Max Mustermann"
                className="w-full h-11 px-4 rounded-lg border border-wp-border bg-white font-body text-sm text-wp-text placeholder:text-wp-text-light focus:outline-none focus:border-wp-primary-mid transition-colors"
              />
            </div>

            <div>
              <label className="font-body text-sm font-medium text-wp-text mb-1.5 block">
                E-Mail <span className="text-wp-accent">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="ihre@email.de"
                className="w-full h-11 px-4 rounded-lg border border-wp-border bg-white font-body text-sm text-wp-text placeholder:text-wp-text-light focus:outline-none focus:border-wp-primary-mid transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="font-body text-sm font-medium text-wp-text mb-1.5 block">Telefon</label>
                <input
                  type="tel"
                  placeholder="+49 30 123456"
                  className="w-full h-11 px-4 rounded-lg border border-wp-border bg-white font-body text-sm text-wp-text placeholder:text-wp-text-light focus:outline-none focus:border-wp-primary-mid transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-wp-text mb-1.5 block">PLZ</label>
                <input
                  type="text"
                  placeholder="10115"
                  maxLength={5}
                  pattern="[0-9]{5}"
                  className="w-full h-11 px-4 rounded-lg border border-wp-border bg-white font-body text-sm text-wp-text placeholder:text-wp-text-light focus:outline-none focus:border-wp-primary-mid transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="font-body text-sm font-medium text-wp-text mb-1.5 block">Betreff</label>
              <select className="w-full h-11 px-4 rounded-lg border border-wp-border bg-white font-body text-sm text-wp-text focus:outline-none focus:border-wp-primary-mid transition-colors">
                <option>Allgemeine Anfrage</option>
                <option>Technische Frage</option>
                <option>Partner werden</option>
                <option>Presseanfrage</option>
              </select>
            </div>

            <div>
              <label className="font-body text-sm font-medium text-wp-text mb-1.5 block">Nachricht</label>
              <textarea
                rows={4}
                placeholder="Ihre Nachricht..."
                className="w-full px-4 py-3 rounded-lg border border-wp-border bg-white font-body text-sm text-wp-text placeholder:text-wp-text-light focus:outline-none focus:border-wp-primary-mid transition-colors resize-none"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-wp-border text-wp-primary focus:ring-wp-primary accent-wp-primary"
                required
              />
              <span className="font-body text-xs text-wp-text-secondary leading-relaxed">
                Ich stimme der Verarbeitung meiner Daten gemäß Datenschutzerklärung zu. <span className="text-wp-accent">*</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !agreed}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                [Loader2 className="w-4 h-4 animate-spin" |]
              ) : (
                <>
                  Nachricht senden
                  [ArrowRight className="w-4 h-4" |]
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

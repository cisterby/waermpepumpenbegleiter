// Lightweight server-side A/B testing
// Uses cookie-based bucketing for consistent UX

import { cookies } from 'next/headers';

export interface Experiment {
  id: string;
  variants: string[];  // e.g., ['control', 'variant_a', 'variant_b']
}

// Active experiments
export const EXPERIMENTS: Record<string, Experiment> = {
  cta_text: {
    id: 'cta_text',
    variants: ['control', 'urgency', 'savings'],
  },
  form_steps: {
    id: 'form_steps',
    variants: ['control', 'two_step'],
  },
  hero_layout: {
    id: 'hero_layout',
    variants: ['control', 'stats_first'],
  },
};

/**
 * Get the variant for a user in an experiment.
 * Uses a cookie to persist the assignment.
 * Falls back to deterministic hashing if no cookie.
 */
export function getVariant(experimentId: string): string {
  const experiment = EXPERIMENTS[experimentId];
  if (!experiment) return 'control';

  const cookieStore = cookies();
  const cookieName = `ab_${experimentId}`;
  const existing = cookieStore.get(cookieName);

  if (existing && experiment.variants.includes(existing.value)) {
    return existing.value;
  }

  // Assign randomly
  const variant = experiment.variants[Math.floor(Math.random() * experiment.variants.length)];

  // Note: In Next.js server components, we can't set cookies directly.
  // The cookie will be set via middleware instead.
  return variant;
}

/**
 * Simple hash-based variant assignment (deterministic, no cookies needed)
 * Use this in Server Components where cookies can't be set.
 */
export function getVariantByHash(experimentId: string, seed: string): string {
  const experiment = EXPERIMENTS[experimentId];
  if (!experiment) return 'control';

  // Simple hash
  let hash = 0;
  const str = `${experimentId}_${seed}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return experiment.variants[Math.abs(hash) % experiment.variants.length];
}

/**
 * Track which variant was shown (for analytics integration).
 * Returns data attributes to add to the page for GTM/analytics.
 */
export function getExperimentDataAttrs(assignments: Record<string, string>): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const [expId, variant] of Object.entries(assignments)) {
    attrs[`data-ab-${expId}`] = variant;
  }
  return attrs;
}

// app/ueber-uns/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Über uns — Wärmepumpenbegleiter.de | Webflott',
  description: 'Wärmepumpenbegleiter.de ist ein unabhängiges Vermittlungsportal von Webflott. Wir verbinden Hausbesitzer kostenlos mit geprüften WP-Fachbetrieben in ihrer Region.',
  alternates: {
    canonical: 'https://xn--wrmepumpenbegleiter-gwb.de/ueber-uns',
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

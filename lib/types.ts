export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image?: string;
  featured?: boolean;
}

export interface TeamMember {
  name: string;
  title: string;
  bio: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  city: string;
  tag: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

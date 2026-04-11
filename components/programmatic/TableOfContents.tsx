// components/programmatic/TableOfContents.tsx
// Reusable Inhaltsverzeichnis — Server Component

interface TOCItem {
  label: string;
  id: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
  cityName: string;
}

export default function TableOfContents({ items, cityName }: TableOfContentsProps) {
  return (
    <nav className="bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm" aria-label="Inhaltsverzeichnis">
      <p className="text-xs font-bold text-[#7A9E8E] uppercase tracking-wider mb-3">Inhaltsverzeichnis</p>
      <ol className="space-y-1.5 text-sm">
        {items.map((item, i) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="flex items-center gap-2 text-[#4A6358] hover:text-[#1A4731] transition-colors py-0.5">
              <span className="text-[#3DA16A] font-mono text-xs font-bold">{i + 1}.</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// components/programmatic/VideoPlaceholder.tsx
// Video-Engagement Sektion — Server Component

interface VideoPlaceholderProps {
  title: string;
  description: string;
  thumbnailAlt: string;
  duration: string;
}

export default function VideoPlaceholder({ title, description, thumbnailAlt, duration }: VideoPlaceholderProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="relative bg-gradient-to-br from-[#1A4731] to-[#0A1910] aspect-video flex items-center justify-center cursor-pointer group" role="img" aria-label={thumbnailAlt}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="relative z-10 text-center px-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all">
            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <p className="text-white font-bold text-sm leading-snug">{title}</p>
          <p className="text-white/60 text-xs mt-1">{duration} Min.</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-[#4A6358] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// components/programmatic/SocialProofBar.tsx
// Social Proof Counter — Server Component

interface SocialProofBarProps {
  anfragenGesamt: number;
  anfragenStadt: number;
  letzteAnfrage: string;
  zufriedenheit: number;
  cityName: string;
}

export default function SocialProofBar({ anfragenGesamt, anfragenStadt, letzteAnfrage, zufriedenheit, cityName }: SocialProofBarProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-[#1A4731] font-bold text-2xl">{anfragenGesamt.toLocaleString('de-DE')}+</p>
          <p className="text-gray-500 text-xs">Anfragen bundesweit</p>
        </div>
        <div>
          <p className="text-[#1A4731] font-bold text-2xl">{anfragenStadt}+</p>
          <p className="text-gray-500 text-xs">Anfragen in {cityName}</p>
        </div>
        <div>
          <p className="text-[#D97706] font-bold text-2xl">{zufriedenheit}%</p>
          <p className="text-gray-500 text-xs">Zufriedenheit</p>
        </div>
        <div>
          <p className="text-[#3DA16A] font-bold text-2xl">{letzteAnfrage}</p>
          <p className="text-gray-500 text-xs">Letzte Anfrage</p>
        </div>
      </div>
    </div>
  );
}

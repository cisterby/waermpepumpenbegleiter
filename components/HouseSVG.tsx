'use client';

import { motion } from 'framer-motion';

export default function HouseSVG() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full max-w-[520px] mx-auto"
    >
      <svg viewBox="0 0 500 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect x="80" y="160" width="280" height="220" rx="4" stroke="#1A4731" strokeWidth="2.5" fill="#F7F5F0" />

        <path d="M60 165 L220 60 L380 165" stroke="#1A4731" strokeWidth="3" fill="none" strokeLinejoin="round" />
        <path d="M80 160 L220 72 L360 160" fill="#1A4731" fillOpacity="0.06" />

        <rect x="300" y="100" width="30" height="60" rx="2" fill="#1A4731" fillOpacity="0.15" stroke="#1A4731" strokeWidth="1.5" />
        <rect x="305" y="105" width="8" height="8" rx="1" fill="#1A4731" fillOpacity="0.3" />

        <rect x="140" y="240" width="60" height="80" rx="3" fill="#1A4731" fillOpacity="0.08" stroke="#1A4731" strokeWidth="1.5" />
        <line x1="170" y1="240" x2="170" y2="320" stroke="#1A4731" strokeWidth="1" opacity="0.3" />
        <circle cx="163" cy="282" r="3" fill="#1A4731" fillOpacity="0.4" />

        <rect x="230" y="210" width="80" height="55" rx="3" fill="#4CAF7D" fillOpacity="0.1" stroke="#1A4731" strokeWidth="1.5" />
        <line x1="240" y1="210" x2="240" y2="265" stroke="#1A4731" strokeWidth="0.8" opacity="0.3" />
        <line x1="260" y1="210" x2="260" y2="265" stroke="#1A4731" strokeWidth="0.8" opacity="0.3" />
        <line x1="280" y1="210" x2="280" y2="265" stroke="#1A4731" strokeWidth="0.8" opacity="0.3" />
        <line x1="300" y1="210" x2="300" y2="265" stroke="#1A4731" strokeWidth="0.8" opacity="0.3" />
        <line x1="230" y1="232" x2="310" y2="232" stroke="#1A4731" strokeWidth="0.8" opacity="0.3" />
        <line x1="230" y1="248" x2="310" y2="248" stroke="#1A4731" strokeWidth="0.8" opacity="0.3" />

        {[110, 155, 200, 245, 290, 335].map((x) => (
          <g key={x}>
            <line x1={x} y1="350" x2={x} y2="380" stroke="#B45309" strokeWidth="1.5" opacity="0.3" />
            {x < 335 && (
              <line x1={x} y1="365" x2={x + 45} y2="365" stroke="#B45309" strokeWidth="1.5" opacity="0.3" />
            )}
          </g>
        ))}

        <rect x="235" y="290" width="70" height="50" rx="2" fill="#1A4731" fillOpacity="0.06" stroke="#1A4731" strokeWidth="1.2" />
        <line x1="242" y1="300" x2="298" y2="300" stroke="#B45309" strokeWidth="2" opacity="0.5" />
        <line x1="242" y1="308" x2="298" y2="308" stroke="#B45309" strokeWidth="2" opacity="0.5" />
        <line x1="242" y1="316" x2="298" y2="316" stroke="#B45309" strokeWidth="2" opacity="0.5" />
        <line x1="242" y1="324" x2="298" y2="324" stroke="#B45309" strokeWidth="2" opacity="0.5" />

        <g>
          <rect x="390" y="280" width="80" height="100" rx="6" fill="#1A4731" fillOpacity="0.1" stroke="#1A4731" strokeWidth="2" />
          <rect x="400" y="290" width="60" height="30" rx="3" fill="#4CAF7D" fillOpacity="0.2" stroke="#1A4731" strokeWidth="1" />
          <text x="430" y="310" textAnchor="middle" fill="#1A4731" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700">WP</text>
          <circle cx="415" cy="340" r="8" fill="none" stroke="#1A4731" strokeWidth="1.5" />
          <circle cx="445" cy="340" r="8" fill="none" stroke="#1A4731" strokeWidth="1.5" />
          <path d="M413 336 L417 340 L413 344" stroke="#1A4731" strokeWidth="1.2" fill="none" />
          <path d="M443 336 L447 340 L443 344" stroke="#1A4731" strokeWidth="1.2" fill="none" />
          <rect x="400" y="356" width="60" height="16" rx="2" fill="#1A4731" fillOpacity="0.06" stroke="#1A4731" strokeWidth="0.8" />
          <text x="430" y="368" textAnchor="middle" fill="#4A6358" fontFamily="Plus Jakarta Sans" fontSize="7">Wärmepumpe</text>
        </g>

        <motion.g
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <path
            d="M390 330 L370 330 L370 300 L360 300"
            stroke="#4CAF7D"
            strokeWidth="2"
            strokeDasharray="6 4"
            fill="none"
          />
          <path
            d="M360 300 L340 300 L340 365 L335 365"
            stroke="#4CAF7D"
            strokeWidth="2"
            strokeDasharray="6 4"
            fill="none"
          />
        </motion.g>

        <motion.g
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        >
          <path
            d="M390 345 L375 345 L375 370 L335 370"
            stroke="#B45309"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
            opacity="0.6"
          />
        </motion.g>

        <g>
          <rect x="100" y="185" width="60" height="30" rx="6" fill="#1A4731" />
          <text x="130" y="204" textAnchor="middle" fill="#F0FAF4" fontFamily="JetBrains Mono" fontSize="14" fontWeight="700">21°C</text>
        </g>

        <g>
          <rect x="395" y="245" width="70" height="26" rx="6" fill="#4A6358" />
          <text x="430" y="263" textAnchor="middle" fill="#F0FAF4" fontFamily="JetBrains Mono" fontSize="12" fontWeight="700">-5°C</text>
        </g>

        <g>
          <rect x="92" y="342" width="42" height="24" rx="4" fill="#2D7A52" />
          <text x="113" y="353" textAnchor="middle" fill="white" fontFamily="JetBrains Mono" fontSize="8" fontWeight="700">A+++</text>
          <rect x="92" y="366" width="42" height="4" rx="1" fill="#4CAF7D" />
          <rect x="92" y="372" width="35" height="4" rx="1" fill="#4CAF7D" opacity="0.6" />
          <rect x="92" y="378" width="28" height="4" rx="1" fill="#F59E0B" opacity="0.5" />
        </g>
      </svg>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { year: '2020', stueck: 97000 },
  { year: '2021', stueck: 154000 },
  { year: '2022', stueck: 236000 },
  { year: '2023', stueck: 193000 },
  { year: '2024', stueck: 193000 },
  { year: '2025', stueck: 299000 },
];

const timeline = [
  {
    year: '2024',
    badge: null,
    text: 'GEG in Kraft: Jede neue Heizung muss 65% erneuerbare Energie nutzen',
  },
  {
    year: '30.06.2026',
    badge: 'In 15 Monaten!',
    text: 'Städte über 100.000 Einwohner: 65%-EE-Pflicht für Bestandsgebäude',
  },
  {
    year: '30.06.2028',
    badge: null,
    text: 'Alle übrigen Kommunen: Gleiche Pflicht tritt in Kraft',
  },
  {
    year: '2045',
    badge: null,
    text: 'Fossile Heizungen vollständig verboten',
  },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[rgba(26,71,49,0.12)] rounded-lg px-4 py-3 shadow-wp-md">
      <p className="font-body text-xs text-wp-text-light mb-1">{label}</p>
      <p className="font-mono text-sm font-bold text-wp-primary">
        {payload[0].value.toLocaleString('de-DE')} WP
      </p>
    </div>
  );
}

export default function WarumJetztSection() {
  return (
    <section className="bg-white section-padding">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="overline mb-4">Regulatorischer Druck</p>
          <h2 className="font-display text-wp-text">
            Das GEG 2024 macht die Entscheidung unausweichlich
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative pl-8">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-wp-primary/20" />

              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-wp-primary border-2 border-white" />
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-bold text-wp-primary">
                        {item.year}
                      </span>
                      {item.badge && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-wp-accent text-white font-body text-xs font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-sm text-wp-text-secondary leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-body text-sm font-medium text-wp-text mb-4">
              Wärmepumpen-Installationen Deutschland
            </p>
            <div className="h-[320px]">
              [ResponsiveContainer width="100%" height="100%"]
                [AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}]
                  [CartesianGrid strokeDasharray="3 3" stroke="rgba(26,71,49,0.08)" |]
                  [XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fontFamily: 'Plus Jakarta Sans', fill: '#4A6358' }}
                    axisLine={{ stroke: 'rgba(26,71,49,0.12)' }}
                    tickLine={false}
                  |]
                  [YAxis
                    tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#7A9E8E' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =] `${(v / 1000).toFixed(0)}k`}
                    label={{
                      value: 'Installierte WP',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 11, fontFamily: 'Plus Jakarta Sans', fill: '#7A9E8E' },
                      offset: 10,
                    }}
                  />
                  [Tooltip content={[CustomTooltip |]} />
                  [Area
                    type="monotone"
                    dataKey="stueck"
                    stroke="#1A4731"
                    strokeWidth={2}
                    fill="#4CAF7D"
                    fillOpacity={0.15}
                  |]
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="font-body text-xs text-wp-text-light mt-3 text-right">
              2025: +55% ggü. Vorjahr
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

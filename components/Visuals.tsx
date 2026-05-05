type VisualProps = {
  type: string;
  large?: boolean;
  short?: boolean;
};

export function VisualCard({ type, large, short }: VisualProps) {
  return (
    <div className={`visual-card ${large ? 'large' : ''} ${short ? 'short' : ''}`} aria-label={`${type} technical visual`}>
      <ServiceVisual type={type} />
    </div>
  );
}

function ServiceVisual({ type }: { type: string }) {
  const title = typeLabel(type);
  return (
    <svg className="diagram" viewBox="0 0 560 240" role="img" aria-label={title} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`bg-${type}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={type === 'cloud' ? '#def4ea' : type === 'fiori' ? '#eef0ff' : type === 'landscape' || type === 'tiers' ? '#fff1d8' : '#d9e8f5'} />
        </linearGradient>
        <linearGradient id={`panel-${type}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fbff" />
        </linearGradient>
        <filter id={`shadow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#042c53" floodOpacity="0.13" />
        </filter>
      </defs>
      <rect width="560" height="240" fill={`url(#bg-${type})`} />
      <circle cx="485" cy="42" r="95" fill="#185fa5" opacity="0.06" />
      <path d="M0 184 C105 132 184 208 292 156 C394 107 454 113 560 76 L560 240 L0 240 Z" fill="#185fa5" opacity="0.07" />
      <text x="30" y="42" fill="#042c53" fontSize="19" fontWeight="800">{title}</text>
      <text x="30" y="66" fill="#555555" fontSize="12">ERPLeague visual workflow</text>
      {type === 'support' ? <SupportGraphic type={type} /> : null}
      {type === 'roadmap' ? <RoadmapGraphic type={type} /> : null}
      {type === 'cloud' ? <CloudGraphic type={type} /> : null}
      {type === 'landscape' ? <LandscapeGraphic /> : null}
      {type === 'fiori' ? <FioriGraphic type={type} /> : null}
      {type === 'integration' ? <IntegrationGraphic /> : null}
      {type === 'advisory' ? <AdvisoryGraphic type={type} /> : null}
      {type === 'tiers' ? <TierGraphic /> : null}
      {type === 'erp' ? <ErpGraphic type={type} /> : null}
      {!['support', 'roadmap', 'cloud', 'landscape', 'fiori', 'integration', 'advisory', 'tiers', 'erp'].includes(type) ? <DefaultGraphic type={type} /> : null}
    </svg>
  );
}

function SupportGraphic({ type }: { type: string }) {
  return (
    <g filter={`url(#shadow-${type})`}>
      <rect x="54" y="94" width="190" height="92" rx="18" fill="#ffffff" stroke="#c7daeb" />
      <rect x="78" y="116" width="92" height="10" rx="5" fill="#185fa5" opacity="0.2" />
      <rect x="78" y="140" width="132" height="10" rx="5" fill="#185fa5" opacity="0.14" />
      <rect x="78" y="164" width="74" height="10" rx="5" fill="#185fa5" opacity="0.1" />
      <circle cx="218" cy="116" r="13" fill="#1d6b3a" opacity="0.16" />
      <path d="M212 116h12M218 110v12" stroke="#1d6b3a" strokeWidth="3" strokeLinecap="round" />

      <rect x="306" y="84" width="180" height="118" rx="20" fill="#ffffff" stroke="#c7daeb" />
      <circle cx="354" cy="132" r="30" fill="#eff7ff" stroke="#d6e9f8" />
      <path d="M343 121c4-7 17-7 21 0 3 4 2 12-4 17l-6 5-6-5c-6-5-7-13-5-17Z" fill="#185fa5" opacity="0.85" />
      <rect x="398" y="112" width="56" height="9" rx="4.5" fill="#185fa5" opacity="0.18" />
      <rect x="398" y="134" width="70" height="9" rx="4.5" fill="#185fa5" opacity="0.13" />
      <rect x="398" y="156" width="44" height="9" rx="4.5" fill="#185fa5" opacity="0.1" />
      <path d="M244 140H306" stroke="#185fa5" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" />
    </g>
  );
}

function RoadmapGraphic({ type }: { type: string }) {
  const stops = [
    ['ECC', 82],
    ['Assess', 190],
    ['Clean core', 318],
    ['S/4HANA', 454]
  ] as const;
  return (
    <g filter={`url(#shadow-${type})`}>
      <path d="M82 150 H454" stroke="#185fa5" strokeWidth="5" strokeLinecap="round" opacity="0.52" />
      {stops.map(([label, x], index) => (
        <g key={label}>
          <circle cx={x} cy="150" r="25" fill="#ffffff" stroke={index === stops.length - 1 ? '#1d6b3a' : '#185fa5'} strokeWidth="2.5" />
          <text x={x} y="155" textAnchor="middle" fill="#042c53" fontSize="11" fontWeight="800">{label}</text>
          {index < stops.length - 1 ? <path d={`M${x + 30} 150h34`} stroke="#185fa5" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 7" /> : null}
        </g>
      ))}
      <rect x="80" y="88" width="382" height="34" rx="17" fill="#ffffff" stroke="#c7daeb" />
      <text x="270" y="110" textAnchor="middle" fill="#555" fontSize="12" fontWeight="700">Readiness · dependencies · data · cutover</text>
      <path d="M454 150l-13-8v16Z" fill="#1d6b3a" />
    </g>
  );
}

function CloudGraphic({ type }: { type: string }) {
  const modules = [
    ['Finance', 83, 152],
    ['Procure', 184, 178],
    ['Supply', 320, 178],
    ['HR', 432, 152]
  ] as const;
  return (
    <g filter={`url(#shadow-${type})`}>
      <path d="M205 127c5-24 26-41 51-41 20 0 38 11 47 28 8-4 17-5 26-2 21 6 33 28 27 48H172c-16 0-29-13-29-29s13-29 29-29c12 0 24 8 33 25Z" fill="#ffffff" stroke="#b9d4c2" strokeWidth="2" />
      <text x="270" y="139" textAnchor="middle" fill="#04342c" fontSize="20" fontWeight="800">GROW</text>
      <text x="270" y="158" textAnchor="middle" fill="#1d6b3a" fontSize="11" fontWeight="700">SAP Cloud ERP</text>
      {modules.map(([label, x, y]) => (
        <g key={label}>
          <path d={`M270 162 L${x} ${y - 18}`} stroke="#1d6b3a" strokeDasharray="5 7" strokeWidth="2" opacity="0.65" />
          <rect x={x - 42} y={y - 16} width="84" height="32" rx="11" fill="#ffffff" stroke="#b9d4c2" />
          <text x={x} y={y + 4} textAnchor="middle" fill="#04342c" fontSize="11" fontWeight="800">{label}</text>
        </g>
      ))}
    </g>
  );
}

function LandscapeGraphic() {
  return (
    <g>
      <rect x="52" y="100" width="116" height="58" rx="14" fill="#ffffff" stroke="#d9b86b" />
      <rect x="52" y="170" width="116" height="40" rx="12" fill="#ffffff" stroke="#d9b86b" />
      <rect x="390" y="98" width="118" height="112" rx="18" fill="#ffffff" stroke="#185fa5" strokeWidth="2" />
      <rect x="214" y="116" width="116" height="76" rx="16" fill="#ffffff" stroke="#c7daeb" />
      <text x="110" y="134" textAnchor="middle" fill="#042c53" fontSize="12" fontWeight="800">Source A</text>
      <text x="110" y="196" textAnchor="middle" fill="#042c53" fontSize="12" fontWeight="800">Source B</text>
      <text x="272" y="148" textAnchor="middle" fill="#042c53" fontSize="12" fontWeight="800">Map + Cleanse</text>
      <text x="272" y="167" textAnchor="middle" fill="#555" fontSize="10">SDT / SLO</text>
      <text x="449" y="142" textAnchor="middle" fill="#042c53" fontSize="13" fontWeight="800">Target</text>
      <text x="449" y="163" textAnchor="middle" fill="#555" fontSize="10">Auditable data</text>
      <path d="M168 129 C190 129 194 132 214 144" stroke="#185fa5" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M168 190 C188 188 196 178 214 164" stroke="#185fa5" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M330 154 H390" stroke="#185fa5" strokeWidth="3" strokeLinecap="round" strokeDasharray="7 7" />
      <path d="M388 154l-12-7v14Z" fill="#185fa5" />
    </g>
  );
}

function FioriGraphic({ type }: { type: string }) {
  return (
    <g filter={`url(#shadow-${type})`}>
      <rect x="62" y="92" width="262" height="122" rx="18" fill="#ffffff" stroke="#cacdf8" />
      <rect x="82" y="116" width="76" height="34" rx="10" fill="#eef0ff" stroke="#cacdf8" />
      <rect x="170" y="116" width="76" height="34" rx="10" fill="#eef0ff" stroke="#cacdf8" />
      <rect x="258" y="116" width="42" height="34" rx="10" fill="#eef0ff" stroke="#cacdf8" />
      <rect x="82" y="164" width="214" height="12" rx="6" fill="#26215c" opacity="0.14" />
      <rect x="82" y="188" width="150" height="12" rx="6" fill="#26215c" opacity="0.1" />
      <rect x="372" y="82" width="86" height="140" rx="20" fill="#ffffff" stroke="#cacdf8" />
      <rect x="390" y="108" width="50" height="72" rx="12" fill="#eef0ff" />
      <circle cx="415" cy="198" r="7" fill="#26215c" opacity="0.18" />
      <text x="193" y="205" textAnchor="middle" fill="#555" fontSize="10">desktop Fiori launchpad</text>
      <text x="415" y="99" textAnchor="middle" fill="#26215c" fontSize="10" fontWeight="800">UI5</text>
    </g>
  );
}

function IntegrationGraphic() {
  const nodes = [
    ['CRM', 108, 96],
    ['WMS', 112, 180],
    ['Payroll', 446, 94],
    ['E-Com', 444, 180],
    ['EDI', 280, 204]
  ] as const;
  return (
    <g>
      <circle cx="280" cy="136" r="48" fill="#ffffff" stroke="#185fa5" strokeWidth="2" />
      <text x="280" y="132" textAnchor="middle" fill="#042c53" fontSize="18" fontWeight="800">SAP</text>
      <text x="280" y="153" textAnchor="middle" fill="#555" fontSize="10">Integration Suite</text>
      {nodes.map(([label, x, y]) => (
        <g key={label}>
          <path d={`M280 136 L${x} ${y}`} stroke="#185fa5" strokeWidth="2" strokeDasharray="5 7" opacity="0.58" />
          <rect x={x - 42} y={y - 20} width="84" height="40" rx="12" fill="#ffffff" stroke="#c7daeb" />
          <text x={x} y={y + 5} textAnchor="middle" fill="#042c53" fontSize="12" fontWeight="800">{label}</text>
        </g>
      ))}
    </g>
  );
}

function AdvisoryGraphic({ type }: { type: string }) {
  const items = [
    ['Review', 74],
    ['Options', 194],
    ['Business case', 326],
    ['Govern', 456]
  ] as const;
  return (
    <g filter={`url(#shadow-${type})`}>
      <path d="M74 170 C160 92 282 216 456 118" stroke="#185fa5" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="9 9" />
      {items.map(([label, x], index) => (
        <g key={label}>
          <circle cx={x} cy={index % 2 ? 138 : 166} r="24" fill="#ffffff" stroke="#185fa5" strokeWidth="2" />
          <text x={x} y={(index % 2 ? 143 : 171)} textAnchor="middle" fill="#042c53" fontSize="10" fontWeight="800">{label}</text>
        </g>
      ))}
      <rect x="62" y="88" width="436" height="34" rx="17" fill="#ffffff" stroke="#c7daeb" />
      <text x="280" y="110" textAnchor="middle" fill="#555" fontSize="12" fontWeight="700">Independent roadmap · RFP · governance</text>
    </g>
  );
}

function TierGraphic() {
  const tiers = [
    ['Essentials', 70, 148, '10–20h'],
    ['Standard', 220, 118, '20–40h'],
    ['Extended', 370, 88, '40h+']
  ] as const;
  return (
    <g>
      {tiers.map(([label, x, y, hours], index) => (
        <g key={label}>
          <rect x={x} y={y} width="120" height={205 - y} rx="14" fill="#ffffff" stroke="#d9b86b" />
          <rect x={x} y={y} width="120" height="36" rx="14" fill="#f59e0b" opacity={0.14 + index * 0.08} />
          <text x={x + 60} y={y + 24} textAnchor="middle" fill="#042c53" fontSize="12" fontWeight="800">{label}</text>
          <text x={x + 60} y={y + 66} textAnchor="middle" fill="#555" fontSize="11">Monthly</text>
          <text x={x + 60} y={y + 88} textAnchor="middle" fill="#92400e" fontSize="18" fontWeight="900">{hours}</text>
        </g>
      ))}
    </g>
  );
}

function ErpGraphic({ type }: { type: string }) {
  return (
    <g filter={`url(#shadow-${type})`}>
      <rect x="64" y="92" width="432" height="116" rx="18" fill="#ffffff" stroke="#c7daeb" />
      <rect x="84" y="112" width="110" height="76" rx="13" fill="#eff7ff" />
      <path d="M104 170h18v-30h-18Zm30 0h18v-46h-18Zm30 0h18v-22h-18Z" fill="#185fa5" opacity="0.7" />
      <rect x="224" y="112" width="110" height="24" rx="12" fill="#edf6ff" />
      <rect x="224" y="152" width="236" height="10" rx="5" fill="#185fa5" opacity="0.16" />
      <rect x="224" y="176" width="184" height="10" rx="5" fill="#185fa5" opacity="0.11" />
      <text x="279" y="128" textAnchor="middle" fill="#042c53" fontSize="12" fontWeight="800">NetSuite / ERP</text>
      <circle cx="438" cy="124" r="16" fill="#1d6b3a" opacity="0.14" />
      <path d="M430 124l6 6 12-14" stroke="#1d6b3a" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function DefaultGraphic({ type }: { type: string }) {
  return (
    <g filter={`url(#shadow-${type})`}>
      <rect x="70" y="102" width="420" height="90" rx="18" fill="#ffffff" stroke="#c7daeb" />
      <rect x="100" y="126" width="120" height="10" rx="5" fill="#185fa5" opacity="0.18" />
      <rect x="100" y="150" width="300" height="10" rx="5" fill="#185fa5" opacity="0.12" />
      <rect x="100" y="174" width="220" height="10" rx="5" fill="#185fa5" opacity="0.1" />
    </g>
  );
}

function typeLabel(type: string) {
  const labels: Record<string, string> = {
    support: 'Senior SAP Support Desk',
    roadmap: 'ECC → S/4HANA Roadmap',
    cloud: 'GROW with SAP Cloud ERP',
    landscape: 'SDT / SLO Landscape Move',
    fiori: 'BTP + Fiori Extension',
    integration: 'SAP Integration Hub',
    advisory: 'ERP Advisory Roadmap',
    tiers: 'Flexible Managed Support',
    erp: 'NetSuite / ERP Optimisation',
    pillars: 'Solutions · Services · Community · Learning',
    activate: 'Prepare → Explore → Realise → Deploy → Run',
    portal: 'Secure Client Workspace'
  };
  return labels[type] ?? 'ERPLeague Visual';
}

export function PillarsVisual() {
  return (
    <div className="visual-card large">
      <svg className="diagram" viewBox="0 0 820 280" role="img" aria-label="GROW with SAP pillars visual">
        <rect width="820" height="280" fill="#f7fbff" />
        <text x="40" y="48" fill="#04342c" fontSize="24" fontWeight="800">GROW with SAP</text>
        <text x="40" y="76" fill="#555" fontSize="13">Solutions · Services · Community · Learning</text>
        {[
          ['Solutions', 58],
          ['Services', 245],
          ['Community', 432],
          ['Learning', 619]
        ].map(([label, x]) => (
          <g key={label}>
            <rect x={Number(x)} y="112" width="145" height="105" rx="18" fill="#ffffff" stroke="#b9d4c2" />
            <circle cx={Number(x) + 72} cy="144" r="20" fill="#1d6b3a" opacity="0.16" />
            <text x={Number(x) + 72} y="180" fill="#04342c" textAnchor="middle" fontSize="16" fontWeight="800">{label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

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
        <linearGradient id={`g-${type}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d9e8f5" />
        </linearGradient>
        <filter id={`shadow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#042c53" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect width="560" height="240" fill={`url(#g-${type})`} />
      <path d="M0 180 C110 130 180 210 292 154 C390 105 445 112 560 78 L560 240 L0 240 Z" fill="#185fa5" opacity="0.08" />
      {type === 'integration' ? <IntegrationGraphic /> : null}
      {type === 'landscape' ? <LandscapeGraphic /> : null}
      {type === 'tiers' ? <TierGraphic /> : null}
      {type !== 'integration' && type !== 'landscape' && type !== 'tiers' ? <DefaultGraphic type={type} /> : null}
      <text x="32" y="44" fill="#042c53" fontSize="20" fontWeight="700">{title}</text>
      <text x="32" y="68" fill="#555555" fontSize="12">Senior-led SAP and ERP delivery</text>
    </svg>
  );
}

function DefaultGraphic({ type }: { type: string }) {
  return (
    <g filter={`url(#shadow-${type})`}>
      <rect x="54" y="92" width="170" height="88" rx="16" fill="#ffffff" stroke="#c7daeb" />
      <rect x="76" y="114" width="92" height="10" rx="5" fill="#185fa5" opacity="0.22" />
      <rect x="76" y="136" width="126" height="10" rx="5" fill="#185fa5" opacity="0.16" />
      <rect x="76" y="158" width="78" height="10" rx="5" fill="#185fa5" opacity="0.12" />
      <rect x="274" y="78" width="210" height="116" rx="18" fill="#ffffff" stroke="#c7daeb" />
      <circle cx="318" cy="134" r="28" fill="#185fa5" opacity="0.15" />
      <path d="M318 120 L336 138 L318 156 L300 138 Z" fill="#185fa5" opacity="0.75" />
      <path d="M224 136 H274" stroke="#185fa5" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 9" />
      <rect x="364" y="112" width="78" height="9" rx="4.5" fill="#185fa5" opacity="0.18" />
      <rect x="364" y="135" width="96" height="9" rx="4.5" fill="#185fa5" opacity="0.14" />
      <rect x="364" y="158" width="60" height="9" rx="4.5" fill="#185fa5" opacity="0.12" />
    </g>
  );
}

function IntegrationGraphic() {
  const nodes = [
    ['CRM', 108, 94],
    ['WMS', 110, 174],
    ['Payroll', 446, 92],
    ['E-Com', 444, 176],
    ['EDI', 280, 195]
  ] as const;
  return (
    <g>
      <circle cx="280" cy="128" r="46" fill="#ffffff" stroke="#185fa5" strokeWidth="2" />
      <text x="280" y="124" textAnchor="middle" fill="#042c53" fontSize="17" fontWeight="700">SAP</text>
      <text x="280" y="145" textAnchor="middle" fill="#555" fontSize="10">hub</text>
      {nodes.map(([label, x, y]) => (
        <g key={label}>
          <path d={`M280 128 L${x} ${y}`} stroke="#185fa5" strokeWidth="2" strokeDasharray="5 7" opacity="0.55" />
          <rect x={x - 42} y={y - 20} width="84" height="40" rx="12" fill="#ffffff" stroke="#c7daeb" />
          <text x={x} y={y + 5} textAnchor="middle" fill="#042c53" fontSize="12" fontWeight="700">{label}</text>
        </g>
      ))}
    </g>
  );
}

function LandscapeGraphic() {
  return (
    <g>
      <rect x="58" y="92" width="120" height="70" rx="14" fill="#ffffff" stroke="#c7daeb" />
      <rect x="58" y="172" width="120" height="42" rx="12" fill="#ffffff" stroke="#c7daeb" />
      <rect x="382" y="108" width="130" height="92" rx="18" fill="#ffffff" stroke="#185fa5" strokeWidth="2" />
      <path d="M178 126 C232 126 278 122 338 150" fill="none" stroke="#185fa5" strokeWidth="4" strokeLinecap="round" />
      <path d="M178 193 C236 192 274 178 338 150" fill="none" stroke="#185fa5" strokeWidth="4" strokeLinecap="round" />
      <path d="M338 150 L322 138 M338 150 L318 158" stroke="#185fa5" strokeWidth="4" strokeLinecap="round" />
      <text x="118" y="130" textAnchor="middle" fill="#042c53" fontSize="13" fontWeight="700">SAP A</text>
      <text x="118" y="198" textAnchor="middle" fill="#042c53" fontSize="13" fontWeight="700">SAP B</text>
      <text x="447" y="150" textAnchor="middle" fill="#042c53" fontSize="14" fontWeight="700">Target</text>
      <text x="447" y="170" textAnchor="middle" fill="#555" fontSize="10">S/4HANA</text>
    </g>
  );
}

function TierGraphic() {
  const tiers = [
    ['Essentials', 70, 142],
    ['Standard', 220, 112],
    ['Extended', 370, 82]
  ] as const;
  return (
    <g>
      {tiers.map(([label, x, y], index) => (
        <g key={label}>
          <rect x={x} y={y} width="120" height={200 - y} rx="14" fill="#ffffff" stroke="#c7daeb" />
          <rect x={x} y={y} width="120" height="36" rx="14" fill="#185fa5" opacity={0.18 + index * 0.08} />
          <text x={x + 60} y={y + 24} textAnchor="middle" fill="#042c53" fontSize="12" fontWeight="700">{label}</text>
          <text x={x + 60} y={y + 66} textAnchor="middle" fill="#555" fontSize="11">Monthly</text>
          <text x={x + 60} y={y + 86} textAnchor="middle" fill="#185fa5" fontSize="18" fontWeight="800">Hours</text>
        </g>
      ))}
    </g>
  );
}

function typeLabel(type: string) {
  const labels: Record<string, string> = {
    support: 'Support / Helpdesk',
    roadmap: 'ECC → S/4HANA Roadmap',
    cloud: 'GROW with SAP Cloud ERP',
    landscape: 'Landscape Transformation',
    fiori: 'Fiori + BTP Extension',
    integration: 'SAP Integration Hub',
    advisory: 'ERP Advisory Roadmap',
    tiers: 'Flexible Support Tiers',
    erp: 'ERP Dashboard',
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

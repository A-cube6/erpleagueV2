export const serviceOptions = [
  'SAP Application Support',
  'S/4HANA Readiness & Migration',
  'GROW with SAP Implementation',
  'SAP Landscape Transformation & Data Migration (SDT/SLO)',
  'SAP BTP / Fiori / UI5 Development',
  'SAP Integration Services',
  'ERP Advisory / Digital Transformation',
  'Managed ERP Support',
  'Oracle NetSuite / ERP Support',
  'Client Portal / Cloud Product Enquiry',
  'Other'
];

export function serviceThemeClass(badge: string) {
  const key = badge.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `service-theme-${key}`;
}

export const services = [
  {
    id: 'sap-support',
    title: 'SAP Application Support',
    badge: 'Support',
    href: '/services#sap-support',
    headline: 'Responsive SAP Support When You Need It',
    body: 'Day-to-day functional and technical SAP support for incident triage, break-fix resolution, minor enhancements, knowledge transfer, and system stabilisation. We act as your senior SAP team — responding fast, documenting clearly, and reducing recurring issues over time.',
    outcomes: [
      'Faster incident resolution with senior first-line triage',
      'Reduced backlog through structured prioritisation',
      'Clear documentation and knowledge transfer to internal teams',
      'Flexible support hours and engagement model'
    ],
    cta: 'Discuss Your Support Needs',
    ctaHref: '/#contact',
    visual: 'support'
  },
  {
    id: 's4hana',
    title: 'S/4HANA Readiness & Migration',
    badge: 'Modernisation',
    href: '/services#s4hana',
    headline: 'Navigate Your S/4HANA Journey Without the Guesswork',
    body: "Whether you're on SAP ECC and facing the 2027 deadline, or already exploring clean-core principles, ERPLeague gives you a practical readiness assessment, process impact analysis, and a phased migration roadmap — without over-engineering the path forward.",
    outcomes: [
      'Custom readiness assessment mapped to your current SAP landscape',
      'Custom code and interface dependency review',
      'Clean-core strategy and SAP BTP extension planning',
      'Data migration approach and master data quality review',
      'Phased roadmap with realistic timeline and cost inputs'
    ],
    cta: 'Book an S/4HANA Readiness Check',
    ctaHref: '/#contact',
    visual: 'roadmap'
  },
  {
    id: 'grow-sap',
    title: 'GROW with SAP Implementation',
    badge: 'Cloud ERP',
    href: '/grow-with-sap',
    headline: 'Cloud ERP for Growing Australian Businesses — Fast, Predictable, Proven',
    body: "GROW with SAP is SAP's cloud ERP offering purpose-built for mid-size organisations. ERPLeague implements GROW with SAP (SAP S/4HANA Cloud Public Edition) with an accelerated methodology, pre-configured industry best practices, and a fixed, transparent scope — so you go live faster and with confidence.",
    outcomes: [
      'SAP S/4HANA Cloud Public Edition: finance, procurement, supply chain, HR',
      'Pre-configured processes aligned to Australian business standards',
      'Predictable scope, timeline, and investment — no surprise blowouts',
      'Evergreen cloud updates — always on the latest SAP release',
      'Dedicated ERPLeague senior consultant throughout delivery'
    ],
    cta: 'Explore GROW with SAP',
    ctaHref: '/grow-with-sap',
    visual: 'cloud'
  },
  {
    id: 'landscape-migration',
    title: 'SAP Landscape Transformation & Data Migration (SDT/SLO)',
    badge: 'Transformation',
    href: '/services#landscape-migration',
    headline: 'Restructure, Consolidate, or Carve Out Your SAP Landscape — With Precision',
    body: 'SAP System Data Migration (SDT) and Selective Data Transition (SLO) are specialist tools for organisations that need to merge SAP systems, carve out business units, restructure legal entities, or migrate selective data sets during an S/4HANA move. ERPLeague brings the technical depth and project discipline to make these complex transitions safe and auditable.',
    when: [
      'Mergers, acquisitions, or divestitures requiring SAP system consolidation or carve-out',
      'Moving from a legacy SAP landscape to a new S/4HANA target with selective data take-on',
      'Re-organising company codes, controlling areas, or plant structures',
      'Data cleansing and selective historical data migration for go-live',
      'Greenfield S/4HANA implementations with structured legacy data migration'
    ],
    outcomes: [
      'SAP SDT (System Data Transition) — full system migration with structural change',
      'SAP SLO (Selective Data Transition) — move selective objects, company codes, or data',
      'Data quality assessment, mapping, and transformation design',
      'Cutover planning, mock runs, and go-live support',
      'Post-migration reconciliation and audit trail'
    ],
    cta: 'Talk to Us About Your Landscape Transition',
    ctaHref: '/#contact',
    visual: 'landscape'
  },
  {
    id: 'btp-fiori',
    title: 'SAP BTP, Fiori & UI5 Development',
    badge: 'Development',
    href: '/services#btp-fiori',
    headline: 'Extend SAP the Right Way — Clean-Core, Modern, Maintainable',
    body: 'Rather than modifying the SAP core, ERPLeague builds extensions, custom Fiori apps, and integrations on SAP Business Technology Platform (BTP) using clean-core principles. The result: custom functionality that survives upgrades, scales with your business, and delights users.',
    outcomes: [
      'Custom Fiori / UI5 apps for approvals, data capture, and operational tasks',
      'SAP BTP CAP/RAP-aligned extension development',
      'Clean-core compliance — no custom modifications to SAP standard',
      'Side-by-side extensions hosted on BTP',
      'User experience redesign for high-friction SAP workflows'
    ],
    cta: 'Discuss Your BTP or Fiori Requirement',
    ctaHref: '/#contact',
    visual: 'fiori'
  },
  {
    id: 'integration',
    title: 'SAP Integration Services',
    badge: 'Integration',
    href: '/services#integration',
    headline: 'Connect Your SAP System to the Rest of Your Business',
    body: 'Many ERP problems are integration problems in disguise. ERPLeague assesses your existing interfaces, designs reliable API patterns, and implements middleware solutions that keep SAP and your third-party systems in sync — without fragile point-to-point connections.',
    outcomes: [
      'Interface landscape assessment — identify fragile or undocumented connections',
      'API design and middleware pattern recommendations (SAP Integration Suite, BTP)',
      'EDI, file-based, and real-time integration patterns',
      'Third-party system connectivity: Salesforce, WMS, payroll, e-commerce',
      'Monitoring and alerting for integration reliability'
    ],
    cta: 'Review Your Integration Landscape',
    ctaHref: '/#contact',
    visual: 'integration'
  },
  {
    id: 'erp-advisory',
    title: 'ERP Advisory & Digital Transformation',
    badge: 'Advisory',
    href: '/services#erp-advisory',
    headline: 'Independent ERP Advice That Puts Your Business First',
    body: "Before committing to a multi-million dollar ERP program, you need an advisor who doesn't have a conflict of interest. ERPLeague provides independent ERP selection, roadmap planning, business case development, and implementation governance — giving you the clarity to make confident decisions.",
    outcomes: [
      'ERP system selection: SAP vs Oracle vs Microsoft vs alternatives',
      'Current-state landscape review and future-state architecture design',
      'Business case and ROI modelling for executive and board-level approval',
      'Implementation partner evaluation and RFP support',
      'Independent governance and quality assurance during delivery'
    ],
    cta: 'Book an ERP Advisory Session',
    ctaHref: '/#contact',
    visual: 'advisory'
  },
  {
    id: 'managed-support',
    title: 'Managed ERP Support',
    badge: 'Managed',
    href: '/services#managed-support',
    headline: 'Senior SAP Capability On Tap — Without the Headcount',
    body: "Carrying a permanent SAP team is expensive. Outsourcing to a large AMS provider means slow response and junior escalations. ERPLeague's managed support model gives SMEs and mid-market teams direct access to senior SAP expertise on a flexible monthly basis — covering incidents, enhancements, and proactive system health.",
    included: [
      'Defined monthly hours with senior functional and technical coverage',
      'Incident management, break-fix, and minor enhancement delivery',
      'Monthly service report and system health summary',
      'Proactive monitoring for critical SAP processes',
      'Optional S/4HANA readiness or transformation advisory add-on'
    ],
    outcomes: [],
    cta: 'Talk to Us About Managed Support',
    ctaHref: '/#contact',
    visual: 'tiers'
  },
  {
    id: 'netsuite',
    title: 'Oracle NetSuite / ERP Support',
    badge: 'ERP',
    href: '/services#netsuite',
    headline: 'Practical Support for NetSuite and Non-SAP ERP Environments',
    body: "Not every business runs on SAP — and that's fine. ERPLeague provides functional and technical support for Oracle NetSuite and other ERP platforms, covering finance, operations, reporting, integration, and optimisation. Practical advice without being locked into one vendor.",
    outcomes: [
      'NetSuite functional support: finance, inventory, order management, reporting',
      'NetSuite integration with third-party systems',
      'Custom scripting, workflows, and SuiteAnalytics support',
      'System health review and optimisation recommendations',
      'ERP platform evaluation if considering a move to SAP'
    ],
    cta: 'Discuss Your NetSuite Needs',
    ctaHref: '/#contact',
    visual: 'erp'
  }
];

export const industries = [
  {
    id: 'government-public-sector',
    icon: '🏛',
    name: 'Government & Public Sector',
    description: 'Managing grants, assets, procurement and reporting under strict governance frameworks. ERPLeague supports public sector teams where governance, accountability and auditability are non-negotiable.',
    relevance: 'SAP for public sector compliance, BAS, grant management, asset accounting'
  },
  {
    id: 'healthcare',
    icon: '✚',
    name: 'Healthcare',
    description: 'Complex workforce, procurement, asset management and patient-related financial flows. We help healthcare organisations simplify ERP operations and connect clinical, workforce and finance systems.',
    relevance: 'SAP for healthcare finance, inventory, payroll and rostering integration'
  },
  {
    id: 'professional-services',
    icon: '▣',
    name: 'Professional Services',
    description: 'Project-based billing, resource planning, multi-entity finance and client reporting. ERPLeague helps services firms improve visibility across project margin, billing and resource utilisation.',
    relevance: 'SAP PS, time & expense, multi-currency, revenue recognition'
  },
  {
    id: 'manufacturing',
    icon: '🏭',
    name: 'Manufacturing',
    description: 'BOM management, production planning, quality, procurement and supply chain integration. We support manufacturers moving from operational firefighting to reliable, data-led production control.',
    relevance: 'SAP PP/MM/QM, GROW with SAP for mid-size manufacturers'
  },
  {
    id: 'retail-distribution',
    icon: '🛒',
    name: 'Retail & Distribution',
    description: 'Inventory, order management, supplier integration, warehouse and customer billing. ERPLeague improves ERP flow across sales, warehouse, fulfilment and finance operations.',
    relevance: 'SAP SD/MM/WM, GROW with SAP, EDI integration'
  },
  {
    id: 'construction-asset-management',
    icon: '⛑',
    name: 'Construction & Asset Management',
    description: 'Project cost control, plant maintenance, procurement and subcontractor management. We help asset-intensive organisations improve maintenance, project tracking and operational accountability.',
    relevance: 'SAP PM/PS, asset lifecycle, CMMS integration'
  },
  {
    id: 'resources-energy',
    icon: '⚡',
    name: 'Resources & Energy',
    description: 'Asset-heavy operations, remote workforces, complex procurement and strict safety obligations. ERPLeague supports ERP workflows where uptime and reporting confidence matter.',
    relevance: 'SAP PM/MM, asset maintenance, procurement, reporting and integration'
  },
  {
    id: 'not-for-profit',
    icon: '◇',
    name: 'Not-for-Profit',
    description: 'Grant tracking, fund accounting, procurement control and reporting discipline. We help purpose-led organisations get more value from lean ERP and finance teams.',
    relevance: 'Finance, procurement, reporting, grant management and system optimisation'
  }
];

export const navigation = [
  { label: 'Industries', href: '/industries' },
  { label: 'GROW with SAP', href: '/grow-with-sap' },
  { label: 'Partner', href: '/partner' },
  { label: 'Client Portal', href: '/portal' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' }
];

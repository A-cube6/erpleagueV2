import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Buttons';
import { PillarsVisual } from '@/components/Visuals';

export const metadata: Metadata = {
  title: 'GROW with SAP | ERPLeague Australia',
  description: 'GROW with SAP implementation services for Australian mid-market businesses moving to SAP S/4HANA Cloud Public Edition.'
};

const benefits = [
  ['Accelerated Deployment', 'Go live in months, not years. Pre-configured processes mean less configuration time and faster value realisation.'],
  ['Predictable Investment', 'Fixed scope and timeline. No surprise cost blowouts. Clear milestone-based delivery.'],
  ['Always Current', 'Automatic cloud updates keep you on the latest SAP release — no upgrade projects, no technical debt.'],
  ['Best-Practice Processes', "Industry processes from SAP's global experience are pre-built and ready to activate — or adapt with ERPLeague guidance."]
];

const solutionScope = [
  ['Finance (FI/CO)', 'General ledger, accounts payable/receivable, asset accounting, cost centre reporting, profit centre analysis', 'ATO compliance, GST, BAS-ready reporting'],
  ['Procurement (MM/Ariba)', 'Purchase orders, vendor management, goods receipts, invoice matching, spend analytics', 'Local supplier integration, ABN validation'],
  ['Supply Chain', 'Inventory management, demand planning, warehouse management, MRP, goods movements', 'Australian distribution and fulfilment'],
  ['Manufacturing', 'Production planning, BOM management, shop floor control, quality management', 'Local manufacturing operations'],
  ['Sales & Distribution', 'Sales orders, pricing, delivery, billing, customer master management', 'GST-inclusive pricing, local tax rules'],
  ['Human Resources (SuccessFactors)', 'Employee records, payroll integration, leave management, workforce analytics', 'STP payroll compliance, Fair Work Act'],
  ['Reporting & Analytics', 'SAP Analytics Cloud integration, live financial reporting, operational dashboards', 'Board-ready reporting with live SAP data']
];

const phases = [
  ['Prepare', 'Project setup, team onboarding, system provisioning, scope confirmation', 'Project manager, solution architect assigned', '2–3 weeks'],
  ['Explore', 'Fit-to-standard workshops, gap analysis, configuration decisions, data migration planning', 'Senior functional consultants lead workshops', '4–6 weeks'],
  ['Realise', 'System configuration, data migration, integration build, user acceptance testing', 'Technical + functional delivery team', '8–14 weeks'],
  ['Deploy', 'Cutover planning, go-live execution, hypercare support', 'Senior lead on-site/available during cutover', '2–3 weeks'],
  ['Run', 'Post-go-live support, optimisation, managed services handover', 'Managed support or client team', 'Ongoing']
];

const goodFit = [
  'Mid-size business (50–2,000 employees)',
  'Currently on SAP Business One, ECC, ByDesign, or no ERP',
  'Wanting to modernise without a 3-year program',
  'Finance, procurement or supply chain as primary driver',
  'Open to adopting SAP best-practice processes'
];

const otherApproach = [
  'Complex legacy customisation that must be retained',
  'Highly bespoke manufacturing with non-standard MRP logic',
  'Multi-national with complex intercompany requirements (consider RISE with SAP)',
  'Purely looking for a cheap upgrade without process change',
  'Organisations not ready for organisational change'
];

export default function GrowWithSapPage() {
  return (
    <>
      <section className="page-hero green tall">
        <div className="container center-text">
          <span className="grow-badge">GROW with SAP</span>
          <p className="eyebrow dark">GROW with SAP · Cloud ERP · Powered by ERPLeague</p>
          <h1>The Smarter Path to SAP Cloud ERP for Growing Australian Businesses</h1>
          <p className="hero-copy">GROW with SAP delivers SAP S/4HANA Cloud Public Edition with pre-configured best practices, accelerated implementation, and continuous cloud innovation — at a price point and timeline built for mid-size organisations. ERPLeague brings the senior SAP expertise to make your implementation fast, clean, and built to last.</p>
          <div className="button-row" style={{ justifyContent: 'center' }}>
            <ButtonLink href="/#contact">Book a GROW with SAP Demo →</ButtonLink>
            <ButtonLink href="/assets/grow-with-sap-overview.pdf" variant="secondary" download>Download Overview</ButtonLink>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <h2>Everything you need to run a modern business on SAP — in the cloud, from day one</h2>
              <p>GROW with SAP is SAP's flagship offering for mid-market companies moving to cloud ERP. It combines SAP S/4HANA Cloud Public Edition, adoption acceleration services, community, and learning — all in one package. You get industry best practices baked in, regular automated updates, and a deployment approach designed for speed and predictability.</p>
            </div>
            <PillarsVisual />
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container center-text">
          <h2>Key benefits</h2>
          <div className="grid grid-4 services-snapshot">
            {benefits.map(([title, description]) => (
              <article className="card" key={title}>
                <span className="badge green">Benefit</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Run your core business on one integrated cloud platform</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Module / Capability</th>
                  <th>What It Covers</th>
                  <th>Australian Relevance</th>
                </tr>
              </thead>
              <tbody>
                {solutionScope.map(([module, covers, relevance]) => (
                  <tr key={module}>
                    <td><strong>{module}</strong></td>
                    <td>{covers}</td>
                    <td>{relevance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <h2>How ERPLeague delivers your GROW with SAP implementation</h2>
          <p className="lead">A practical SAP Activate-aligned delivery rhythm: Prepare → Explore → Realise → Deploy → Run.</p>
          <div className="phase-timeline" aria-label="GROW with SAP delivery timeline">
            {phases.map(([phase, what, role, duration], index) => (
              <article className="phase-card" key={phase}>
                <div className="step-number">{index + 1}</div>
                <h3>{phase}</h3>
                <p><strong>What happens:</strong> {what}</p>
                <p><strong>ERPLeague role:</strong> {role}</p>
                <p><strong>Typical duration:</strong> {duration}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>GROW with SAP is the right fit if...</h2>
          <div className="fit-grid">
            <div className="fit-card good">
              <h3>✅ You ARE a good fit</h3>
              <ul className="simple-list">
                {goodFit.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="fit-card bad">
              <h3>❌ Consider a different approach</h3>
              <ul className="simple-list">
                {otherApproach.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-banner green">
        <div className="container center-text">
          <h2>Ready to see if GROW with SAP is right for your business?</h2>
          <p className="lead">Book a no-obligation 30-minute GROW with SAP discovery call with an ERPLeague senior consultant. We'll assess your readiness, answer your questions, and give you an honest view of scope and timeline.</p>
          <ButtonLink href="/#contact">Book Your GROW with SAP Discovery Call →</ButtonLink>
        </div>
      </section>
    </>
  );
}

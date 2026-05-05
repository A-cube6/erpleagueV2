import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Buttons';
import { PartnerForm } from '@/components/Forms';

export const metadata: Metadata = {
  title: 'Partner Program | ERPLeague Australia',
  description: 'ERPLeague partner program for technology partners, referral partners and SAP delivery partners in Australia.'
};

const partnerTypes = [
  ['Technology Partners', 'ISVs, SaaS platforms, and SAP add-on vendors looking to expand into Australian mid-market via ERPLeague engagements.', 'Joint go-to-market, co-sell agreements, integration support, named referral'],
  ['Referral Partners', 'Accountants, business advisors, MSPs and IT consultancies who have clients needing SAP or ERP help.', 'Referral fee structure, transparent pipeline tracking, no conflict of interest'],
  ['Delivery Partners', 'SAP functional/technical consultants and boutique firms who want to sub-contract into ERPLeague projects or overflow capacity.', 'Flexible sub-contract arrangements, senior-led projects, clear scopes and rates']
];


const technologyPartnerships = [
  {
    name: 'SAP',
    partnerType: 'Silver Partner',
    description: 'Certified SAP partner delivering S/4HANA readiness, GROW with SAP, BTP/Fiori, landscape transformation, Security/IAM & GRC and managed support for Australian businesses.',
    iconText: 'SAP',
    iconClass: 'sap-icon',
    chips: ['S/4HANA', 'GROW with SAP', 'GRC/IAG', 'BTP', 'SDT/SLO']
  },
  {
    name: 'Oracle NetSuite',
    partnerType: 'Alliance Partner',
    description: 'NetSuite implementation, support and optimisation for Australian businesses. Finance, inventory, order management, reporting, integration and custom scripting.',
    iconText: 'NETSUITE',
    iconClass: 'netsuite-icon',
    chips: ['Finance', 'Inventory', 'SuiteAnalytics', 'Integration']
  },
  {
    name: 'Databricks',
    partnerType: 'Technology Partner',
    description: 'Data lakehouse, analytics and AI/ML workloads alongside SAP environments. ERPLeague integrates Databricks with SAP data sources to unlock real-time analytics and predictive insights.',
    iconText: '◆',
    iconClass: 'databricks-icon',
    chips: ['Data Lakehouse', 'SAP Integration', 'AI/ML', 'Analytics']
  }
];

const whyPartner = [
  ['Direct access to ERPLeague senior leadership — no account management layers', 'Transparent and honest communication about client situations'],
  ['Clear commercial terms with no surprises or hidden clip fees', "Commitment to the client's best outcome above all else"],
  ['Joint marketing and co-branding where appropriate', 'Respect for confidentiality and IP on both sides'],
  ['Access to ERPLeague delivery methodology and tools', 'Proactive communication when situations change'],
  ['Mutual referral opportunities across the partner network', 'Alignment with ERPLeague values: practical, senior-led, Australian-focused']
];

export default function PartnerPage() {
  return (
    <>
      <section className="page-hero green">
        <div className="container">
          <p className="eyebrow dark">Partner Program</p>
          <h1>Grow Your SAP Practice Alongside ERPLeague</h1>
          <p className="hero-copy">Whether you're a technology vendor, SAP reseller, managed service provider, or specialist consultant, ERPLeague offers a collaborative partner model built on mutual trust, clear commercial terms, and shared client success.</p>
          <ButtonLink href="/partner#partner-contact">Explore Partnership Opportunities →</ButtonLink>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {partnerTypes.map(([type, who, offer]) => (
              <article className="card partner-type-card" key={type}>
                <span className="badge green">Partner Type</span>
                <h3>{type}</h3>
                <p><strong>Who this is for:</strong> {who}</p>
                <p><strong>What we offer:</strong> {offer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section partner-showcase-section">
        <div className="container">
          <p className="eyebrow dark">Technology Partnerships</p>
          <h2 className="partner-showcase-title">Our technology partnerships</h2>
          <div className="partner-showcase-grid">
            {technologyPartnerships.map((partner) => (
              <article className="partner-showcase-card" key={partner.name}>
                <div className="partner-showcase-head">
                  <span className={`partner-icon partner-showcase-icon ${partner.iconClass}`}>{partner.iconText}</span>
                  <div>
                    <h3>{partner.name}</h3>
                    <span className={`badge ${partner.name === 'Databricks' ? '' : 'green'} partner-mini-badge ${partner.name === 'SAP' ? 'partner-badge-blue' : partner.name === 'Oracle NetSuite' ? 'partner-badge-green' : 'partner-badge-orange'}`}>{partner.partnerType}</span>
                  </div>
                </div>
                <p>{partner.description}</p>
                <div className="partner-chip-row">
                  {partner.chips.map((chip) => (
                    <span
                      key={chip}
                      className={`partner-chip ${partner.name === 'SAP' ? 'partner-chip-blue' : partner.name === 'Oracle NetSuite' ? 'partner-chip-green' : 'partner-chip-orange'}`}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <h2>A partner that works the way you do</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>What you get</th>
                  <th>What we expect</th>
                </tr>
              </thead>
              <tbody>
                {whyPartner.map(([get, expect]) => (
                  <tr key={get}>
                    <td>{get}</td>
                    <td>{expect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="partner-contact" className="section">
        <div className="container contact-wrap">
          <div className="card contact-card">
            <p className="eyebrow">Partner enquiry</p>
            <h2>Start the conversation</h2>
            <p>Use this form if you are a technology vendor, referral partner, delivery partner, or specialist consultant interested in working with ERPLeague.</p>
            <div className="logo-placeholder-row" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <div className="logo-placeholder">Technology Partners</div>
              <div className="logo-placeholder">Delivery Network</div>
            </div>
          </div>
          <PartnerForm />
        </div>
      </section>
    </>
  );
}

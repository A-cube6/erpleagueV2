import type { Metadata } from 'next';
import { industries } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Industries | ERPLeague Australia',
  description: 'SAP and ERP services for Australian government, healthcare, professional services, manufacturing, retail, distribution, construction, resources, energy and not-for-profit organisations.'
};

export default function IndustriesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>SAP & ERP Solutions Across Australian Industries</h1>
          <p className="hero-copy">ERPLeague works with organisations across the sectors where process, accountability and systems matter most. We understand your industry's specific compliance requirements, operational rhythms, and ERP challenges.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {industries.map((industry) => (
              <article id={industry.id} className="card industry-card" key={industry.id}>
                <div className="icon-circle">{industry.icon}</div>
                <h3>{industry.name}</h3>
                <p>{industry.description}</p>
                <p><strong>SAP/ERP relevance:</strong> {industry.relevance}</p>
                <a className="link-arrow" href="/#contact">Talk to Us →</a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

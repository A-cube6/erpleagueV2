import Link from 'next/link';
import { ButtonLink } from '@/components/Buttons';
import { ContactForm } from '@/components/Forms';
import { services, industries } from '@/lib/site-data';

const values = [
  {
    icon: '◎',
    title: 'Direct Senior Access',
    body: 'Work directly with experienced SAP consultants from day one — no handoffs to juniors after the sale.'
  },
  {
    icon: '◈',
    title: 'Australian-First Delivery',
    body: 'Local team, local time zones, and deep understanding of Australian compliance and business requirements.'
  },
  {
    icon: '◇',
    title: 'Practical, Not Theoretical',
    body: 'Advice tied to real business operations — not slide decks. We focus on outcomes that move your organisation forward.'
  },
  {
    icon: '◉',
    title: 'Flexible Engagement Models',
    body: 'Advisory, project-based, or ongoing managed support — structured around what your business actually needs.'
  }
];

const stats = [
  ['Senior-led', 'Every engagement'],
  ['SAP + ERP', 'Technical & functional'],
  ['Australian', 'Local team, local market'],
  ['Flexible', 'Advisory to managed support']
];

const growBenefits = [
  'Pre-configured best-practice processes out of the box',
  'Predictable scope, timeline, and investment',
  'Continuous cloud updates — always current, always secure',
  'SAP S/4HANA Public Cloud: finance, procurement, supply chain, HR'
];

const processSteps = [
  ['Diagnose', 'Identify where your SAP/ERP environment creates friction, cost or risk.'],
  ['Prioritise', 'Separate urgent operational issues from longer-term improvement work.'],
  ['Deliver', 'Use senior ERP capability to execute with clean communication and visible progress.'],
  ['Improve', 'Turn repeat issues into better workflows, reporting, documentation and governance.']
];

const healthChecklist = [
  'Review current SAP/ERP pain points and support gaps',
  'Assess S/4HANA, GROW with SAP, or clean-core readiness',
  'Identify reporting, integration, and automation opportunities',
  'Evaluate landscape transformation and data migration needs',
  'Recommend practical next steps — tailored to your situation'
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content fade-in-up">
            <p className="eyebrow dark">SAP & ERP Services · Australia</p>
            <h1>Stop firefighting your ERP. Start running it with confidence.</h1>
            <p className="hero-copy">ERPLeague is a boutique Australian SAP and ERP consultancy. We deliver senior-led support, S/4HANA readiness, GROW with SAP implementation, landscape transformation, BTP/Fiori development, and managed ERP services — without the big-firm overhead.</p>
            <div className="button-row">
              <ButtonLink href="/#contact">Book a Free ERP Health Check →</ButtonLink>
              <ButtonLink href="/services" variant="secondary">Explore Services</ButtonLink>
            </div>
          </div>
          <div className="stat-strip fade-in-up delay-2" aria-label="ERPLeague highlights">
            {stats.map(([stat, label]) => (
              <div className="stat-item" key={stat}>
                <strong>{stat}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="technology-partners" aria-label="ERPLeague technology partnerships">
        <div className="container">
          <p className="partner-strip-title">Our Technology Partnerships</p>
          <div className="partner-logo-row">
            <div className="partner-logo-card">
              <span className="partner-icon sap-icon">SAP</span>
              <span><strong>SAP</strong><small>Silver Partner</small></span>
            </div>
            <div className="partner-logo-card">
              <span className="partner-icon netsuite-icon">NETSUITE</span>
              <span><strong>Oracle NetSuite</strong><small>Alliance Partner</small></span>
            </div>
            <div className="partner-logo-card">
              <span className="partner-icon databricks-icon">◆</span>
              <span><strong>Databricks</strong><small>Technology Partner</small></span>
            </div>
            <div className="partner-logo-card">
              <span className="partner-icon aws-icon">AWS</span>
              <span><strong>Amazon AWS</strong><small>Cloud Partner</small></span>
            </div>
            <div className="partner-logo-card">
              <span className="partner-icon azure-icon">▦</span>
              <span><strong>Microsoft Azure</strong><small>Cloud Partner</small></span>
            </div>
          </div>
        </div>
      </section>

      <section className="client-trust" aria-label="Trusted by Australian organisations">
        <div className="container">
          <p className="client-trust-title">Trusted by Australian Organisations</p>
          <div className="client-logo-row">
            <div className="client-logo-card"><strong>Client A</strong><small>Government</small></div>
            <div className="client-logo-card"><strong>Client B</strong><small>Manufacturing</small></div>
            <div className="client-logo-card"><strong>Client C</strong><small>Healthcare</small></div>
            <div className="client-logo-card"><strong>Client D</strong><small>Prof. Services</small></div>
            <div className="client-logo-card"><strong>Client E</strong><small>Retail</small></div>
            <div className="client-logo-card"><strong>Client F</strong><small>Construction</small></div>
          </div>
          <p className="client-logo-note">Replace with actual client logos (monochrome). Written approval required before publishing.</p>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container center-text">
          <p className="eyebrow">Why ERPLeague</p>
          <h2>The SAP expertise your team needs — without the big-firm price tag</h2>
          <p className="lead">Most ERP problems don't need a 50-person consulting machine. They need a senior expert who understands your processes, diagnoses the root cause, and moves work forward. That's what we do every day.</p>
          <div className="grid grid-4 services-snapshot">
            {values.map((value, index) => (
              <article className={`card fade-in-up delay-${index + 1}`} key={value.title}>
                <div className="icon-circle">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <p className="eyebrow">Services</p>
          <h2>Practical SAP & ERP capability across the full delivery lifecycle</h2>
          <p className="lead">From day-to-day support to cloud transformation — we cover the services Australian mid-market and enterprise teams need most.</p>
          <div className="grid grid-3 services-snapshot">
            {services.map((service, index) => (
              <Link className="card service-card" href={service.href} key={service.title}>
                <div className="card-topline">
                  <span className="badge">{service.badge}</span>
                  <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.body.slice(0, 145)}...</p>
                <span className="link-arrow">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section compact">
        <div className="container">
          <h2>Built for sectors where systems, process and accountability matter</h2>
          <div className="pill-row" aria-label="Industry links">
            {industries.map((industry) => (
              <Link className="industry-pill" href={`/industries#${industry.id}`} key={industry.id}>{industry.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="grow-callout">
            <div className="grow-panel">
              <span className="grow-badge">GROW with SAP</span>
              <h2>Accelerate your move to SAP Cloud ERP with GROW with SAP</h2>
              <p>Designed for mid-size Australian businesses ready to modernise — without lengthy deployments or unpredictable costs. ERPLeague delivers GROW with SAP implementations backed by senior consultants who understand your industry.</p>
              <ButtonLink href="/grow-with-sap" variant="secondary">Learn About GROW with SAP →</ButtonLink>
            </div>
            <div className="benefit-list">
              {growBenefits.map((benefit) => <div className="check-line" key={benefit}>{benefit}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container center-text">
          <h2>A model that puts clarity before complexity</h2>
          <div className="process-diagram">
            {processSteps.map(([title, description], index) => (
              <article className="process-step" key={title}>
                <div className="step-number">{index + 1}</div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container center-text">
          <h2>Book a 30-Minute ERP Health Check — It's Free</h2>
          <p className="lead">A focused conversation to identify where your SAP or ERP environment is creating friction, risk, cost, or missed opportunity. No sales pitch. Just clarity.</p>
          <ul className="checklist">
            {healthChecklist.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <ButtonLink href="/#contact">Request Your Free Health Check →</ButtonLink>
        </div>
      </section>

      <section id="contact" className="section section-blue-light">
        <div className="container contact-wrap">
          <div className="card contact-card">
            <p className="eyebrow">Contact</p>
            <h2>Tell us where your ERP is creating friction</h2>
            <p>Use the form to request a free health check or ask about support, S/4HANA, GROW with SAP, landscape transformation, BTP/Fiori, integration, advisory, managed support, NetSuite or the client portal.</p>
            <p><strong>Email:</strong> hello@erpleague.com.au<br /><strong>Phone:</strong> +61 410 284 201</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Buttons';
import { VisualCard } from '@/components/Visuals';

export const metadata: Metadata = {
  title: 'Client Portal | ERPLeague Australia',
  description: 'Secure ERPLeague workspace for registered clients, subscribers and approved partners.'
};

const modules = [
  ['ERP Health Check Dashboard', 'Visual summary of your SAP/ERP environment — maturity score, risks and improvement actions.', 'Benchmark your environment against practical operating standards'],
  ['SAP Support Workspace', 'Log, track and manage support requests. View resolution history, notes and agreed priorities.', 'Clear visibility across incidents, enhancements and service commitments'],
  ['Automation & Reporting Toolkit', 'Access ERPLeague automation tools, reporting templates and process accelerators from one workspace.', 'Reusable accelerators for reporting, controls and operations'],
  ['Project Collaboration', 'Track milestones, decisions, documents and stakeholder updates across active ERPLeague engagements.', 'Shared delivery rhythm across client, partner and ERPLeague teams']
];

const tiers = [
  ['Client Access', 'Organisations engaged with ERPLeague for support or project delivery', 'Support workspace, project documents, health check results and team contacts'],
  ['Subscriber Access', 'Businesses subscribed to ERPLeague cloud products or accelerators', 'Automation toolkit, reporting templates, product dashboards and usage analytics'],
  ['Partner Access', 'Approved ERPLeague delivery and technology partners', 'Delivery methodology, joint project workspace and partner resources']
];

export default function PortalPage() {
  return (
    <>
      <section className="page-hero purple portal-hero-premium">
        <div className="container portal-hero-grid">
          <div>
            <p className="eyebrow dark">Client Portal · Registered Access</p>
            <h1>Your ERPLeague Workspace — All Your SAP Support in One Place</h1>
            <p className="hero-copy">A secure, private workspace for ERPLeague clients and subscribers. Manage support requests, track project progress, access reports and dashboards, and connect with your ERPLeague team.</p>
            <div className="button-row">
              <ButtonLink href="/login" variant="secondary">Log In</ButtonLink>
              <ButtonLink href="/#contact">Request Portal Access</ButtonLink>
            </div>
          </div>
          <div className="portal-hero-card" aria-hidden="true">
            <div className="portal-card-top"><span></span><span></span><span></span></div>
            <div className="portal-card-title">ERPLeague Workspace</div>
            <div className="portal-card-row wide"></div>
            <div className="portal-card-row"></div>
            <div className="portal-card-grid">
              <div></div><div></div><div></div><div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2 portal-intro" style={{ alignItems: 'center' }}>
            <div>
              <p className="eyebrow">Client workspace</p>
              <h2>A polished entry point for support, reporting and project collaboration</h2>
              <p className="lead">The portal is designed as a premium workspace for ERPLeague clients, subscribers and approved partners — bringing support visibility, health check insights and delivery updates into one place.</p>
            </div>
            <VisualCard type="portal" />
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <p className="eyebrow">Workspace modules</p>
          <h2>Client-facing capability in one clear interface</h2>
          <div className="grid grid-4 services-snapshot">
            {modules.map(([module, description, capability]) => (
              <article className="card portal-module premium-card" key={module}>
                <span className="badge purple">Workspace</span>
                <h3>{module}</h3>
                <p>{description}</p>
                <p><strong>Designed for:</strong> {capability}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Access model</p>
          <h2>Clear access tiers for clients, subscribers and partners</h2>
          <div className="access-tier-grid">
            {tiers.map(([tier, who, included]) => (
              <article className="card premium-card" key={tier}>
                <h3>{tier}</h3>
                <p><strong>Who gets access:</strong> {who}</p>
                <p><strong>What's included:</strong> {included}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

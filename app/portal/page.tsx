import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Buttons';
import { VisualCard } from '@/components/Visuals';

export const metadata: Metadata = {
  title: 'Client Portal | ERPLeague Australia',
  description: 'ERPLeague client portal placeholder for registered clients and subscribers. Future SAP support workspace, dashboards, automation and collaboration modules.'
};

const modules = [
  ['ERP Health Check Dashboard', 'Planned', 'Visual summary of your SAP/ERP environment — maturity score, risks, improvement actions.', 'AI-assisted benchmarking vs industry'],
  ['SAP Support Workspace', 'Planned', 'Log, track and manage support tickets. View resolution history and knowledge notes.', 'Integration with SAP Solution Manager'],
  ['Automation & Reporting Toolkit', 'Planned', 'Launch point for ERPLeague automation tools, report templates, and process accelerators.', 'Self-service report builder'],
  ['Project Collaboration', 'Planned', 'Shared project workspace: milestones, documents, decisions log, stakeholder updates.', 'MS Teams / Slack integration']
];

const tiers = [
  ['Client Access', 'Organisations engaged with ERPLeague for support or project delivery', 'Support workspace, project documents, health check results, team contacts'],
  ['Subscriber Access', 'Businesses subscribed to ERPLeague cloud products or accelerators', 'Automation toolkit, reporting templates, product dashboards, usage analytics'],
  ['Partner Access', 'Approved ERPLeague delivery and technology partners', 'Delivery methodology library, joint project workspace, partner resources']
];

export default function PortalPage() {
  return (
    <>
      <section className="page-hero purple">
        <div className="container">
          <p className="eyebrow dark">Client Portal · Registered Access</p>
          <h1>Your ERPLeague Workspace — All Your SAP Support in One Place</h1>
          <p className="hero-copy">A secure, private workspace for ERPLeague clients and subscribers. Manage support requests, track project progress, access reports and dashboards, and connect with your ERPLeague team.</p>
          <div className="button-row">
            <ButtonLink href="#" variant="secondary">Log In</ButtonLink>
            <ButtonLink href="/#contact">Request Portal Access</ButtonLink>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <p className="eyebrow">Future workspace</p>
              <h2>Built as a credible portal entry point now, ready for real modules later</h2>
              <p className="lead">The current portal page is public-facing and intentionally does not store or display client data. It can later be connected to Supabase Auth or Auth0 with organisation-level roles and Row Level Security.</p>
            </div>
            <VisualCard type="portal" />
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <h2>Portal feature modules</h2>
          <div className="grid grid-4 services-snapshot">
            {modules.map(([module, status, description, capability]) => (
              <article className="card portal-module" key={module}>
                <span className="badge purple">{status}</span>
                <h3>{module}</h3>
                <p>{description}</p>
                <p><strong>Future capability:</strong> {capability}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Access tiers</h2>
          <div className="access-tier-grid">
            {tiers.map(([tier, who, included]) => (
              <article className="card" key={tier}>
                <h3>{tier}</h3>
                <p><strong>Who gets access:</strong> {who}</p>
                <p><strong>What's included:</strong> {included}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="card tech-note">
            <h2>Security & tech note</h2>
            <p><strong>Recommended stack:</strong> Supabase Auth or Auth0 for organisation-level roles: client, subscriber, partner and admin.</p>
            <p><strong>Database:</strong> Supabase PostgreSQL for client data, support tickets and project metadata.</p>
            <p><strong>Hosting:</strong> Vercel, with GitHub as source control.</p>
            <p><strong>Current state:</strong> placeholder only — no data stored, no auth required for public demo.</p>
            <p><strong>Next phase:</strong> add Supabase auth, org-level permissions, Row Level Security and the first real Support Workspace module.</p>
          </div>
        </div>
      </section>
    </>
  );
}

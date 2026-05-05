import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ERPLeague Australia',
  description: 'ERPLeague Australia privacy policy placeholder.'
};

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p className="hero-copy">This page is a placeholder for ERPLeague Australia's privacy policy and should be reviewed by legal counsel before production launch.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2>Information we collect</h2>
          <p>ERPLeague may collect contact details and enquiry information submitted through the website, including name, email, phone, company, service interest and message content.</p>
          <h2>How information is used</h2>
          <p>Information submitted through this website is used to respond to enquiries, book health checks, discuss partnership opportunities, and provide requested information about ERPLeague services.</p>
          <h2>Client portal note</h2>
          <p>The current client portal page is a public placeholder. No real client data should be displayed until authentication, organisation-level permissions and database Row Level Security have been implemented.</p>
          <h2>Contact</h2>
          <p>For privacy questions, contact <a className="link-arrow" href="mailto:hello@erpleague.com.au">hello@erpleague.com.au</a>.</p>
        </div>
      </section>
    </>
  );
}

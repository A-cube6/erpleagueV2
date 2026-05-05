import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ERPLeague Australia',
  description: 'ERPLeague Australia privacy policy.'
};

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p className="hero-copy">ERPLeague Australia respects the confidentiality of client, partner and enquiry information.</p>
        </div>
      </section>
      <section className="section">
        <div className="container narrow-policy">
          <h2>Information we collect</h2>
          <p>ERPLeague may collect contact details and enquiry information submitted through the website, including name, email, phone, company, service interest and message content.</p>
          <h2>How information is used</h2>
          <p>Information submitted through this website is used to respond to enquiries, book health checks, discuss partnership opportunities, and provide requested information about ERPLeague services.</p>
          <h2>Client information</h2>
          <p>Client information is handled with appropriate confidentiality and used only for service delivery, support, reporting, project collaboration and agreed commercial communication.</p>
          <h2>Contact</h2>
          <p>For privacy questions, contact <a className="link-arrow" href="mailto:hello@erpleague.com.au">hello@erpleague.com.au</a>.</p>
        </div>
      </section>
    </>
  );
}

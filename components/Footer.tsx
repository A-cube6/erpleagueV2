import Link from 'next/link';
import { services } from '@/lib/site-data';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>ERPLeague Australia</h3>
            <p>Boutique Australian SAP and ERP consultancy for senior-led support, transformation and managed services.</p>
            <p>
              <a href="mailto:hello@erpleague.com.au">hello@erpleague.com.au</a>
              <a href="tel:+61410284201">+61 410 284 201</a>
              <a href="https://linkedin.com/company/erpleague" target="_blank" rel="noreferrer">LinkedIn</a>
            </p>
          </div>
          <div>
            <h4>Services</h4>
            {services.map((service) => (
              <Link href={service.href} key={service.title}>{service.title}</Link>
            ))}
          </div>
          <div>
            <h4>Company</h4>
            <Link href="/#about">About ERPLeague</Link>
            <Link href="/partner">Partner Program</Link>
            <Link href="/portal">Client Portal</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/#contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ERPLeague Australia. All rights reserved.</span>
          <span>Created by @Acube · Version 1.0 · May 2026</span>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from 'next';
import { services, serviceThemeClass } from '@/lib/site-data';
import { ButtonLink } from '@/components/Buttons';
import { VisualCard } from '@/components/Visuals';

export const metadata: Metadata = {
  title: 'SAP & ERP Services | ERPLeague Australia',
  description: 'SAP support, S/4HANA readiness, GROW with SAP, SAP landscape transformation, BTP/Fiori, integration, ERP advisory, managed support and NetSuite services.'
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow dark">What We Do</p>
          <h1>SAP & ERP Services Built for Australian Businesses</h1>
          <p className="hero-copy">We cover the full ERP lifecycle — from rapid support and S/4HANA readiness to cloud migration, landscape transformation, and managed services. Senior-led. Outcome-focused. No unnecessary complexity.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {services.map((service) => (
            <article id={service.id} className="service-detail" key={service.id}>
              <div className="service-copy">
                <span className={`badge ${serviceThemeClass(service.badge)}`}>{service.badge}</span>
                <h2>{service.headline}</h2>
                <p>{service.body}</p>

                {'when' in service && service.when ? (
                  <>
                    <h3>When you need this</h3>
                    <ul className="simple-list">
                      {service.when.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <h3>Key capabilities</h3>
                  </>
                ) : null}

                {'included' in service && service.included ? (
                  <>
                    <h3>What's included</h3>
                    <ul className="outcome-list">
                      {service.included.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </>
                ) : (
                  <>
                    <h3>Key outcomes</h3>
                    <ul className="outcome-list">
                      {service.outcomes.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </>
                )}

                <ButtonLink href={service.ctaHref} variant="outline">{service.cta} →</ButtonLink>
              </div>
              <VisualCard type={service.visual} large={service.id === 'landscape-migration' || service.id === 'grow-sap'} short={service.id === 'netsuite' || service.id === 'erp-advisory' || service.id === 'managed-support'} />
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

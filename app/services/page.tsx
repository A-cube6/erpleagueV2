import type { Metadata } from 'next';
import Image from 'next/image';
import { services, serviceThemeClass } from '@/lib/site-data';
import { ButtonLink } from '@/components/Buttons';


const serviceVisualAssets: Record<string, { src: string; alt: string }> = {
  support: {
    src: '/Asset/services/service-sap-support-desk.webp',
    alt: 'Premium SAP application support operations dashboard illustration'
  },
  roadmap: {
    src: '/Asset/services/service-ecc-to-s4hana-roadmap.webp',
    alt: 'S/4HANA readiness and migration roadmap illustration'
  },
  cloud: {
    src: '/Asset/services/service-grow-with-sap-cloud-erp.webp',
    alt: 'GROW with SAP cloud ERP growth illustration'
  },
  landscape: {
    src: '/Asset/services/service-sdt-slo-landscape-move.webp',
    alt: 'SAP landscape transformation and data migration pipeline illustration'
  },
  fiori: {
    src: '/Asset/services/service-btp-fiori-extension.webp',
    alt: 'SAP BTP Fiori and UI5 enterprise application design illustration'
  },
  integration: {
    src: '/Asset/services/service-sap-integration-hub.webp',
    alt: 'SAP integration hub and connected enterprise systems illustration'
  },
  advisory: {
    src: '/Asset/services/service-erp-advisory-roadmap.webp',
    alt: 'ERP advisory and digital transformation roadmap illustration'
  },
  tiers: {
    src: '/Asset/services/service-flexible-managed-support.webp',
    alt: 'Managed ERP support and proactive monitoring service flow illustration'
  },
  erp: {
    src: '/Asset/services/service-netsuite-erp-optimisation.webp',
    alt: 'Oracle NetSuite and multi ERP optimisation dashboard illustration'
  }
};

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
              <div className={`visual-card service-visual-image-card ${service.id === 'landscape-migration' || service.id === 'grow-sap' ? 'large' : ''} ${service.id === 'netsuite' || service.id === 'erp-advisory' || service.id === 'managed-support' ? 'short' : ''}`}>
                <Image
                  src={serviceVisualAssets[service.visual].src}
                  alt={serviceVisualAssets[service.visual].alt}
                  width={1200}
                  height={675}
                  sizes="(max-width: 900px) 100vw, 46vw"
                  className="service-visual-img"
                  priority={service.id === 'sap-support'}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

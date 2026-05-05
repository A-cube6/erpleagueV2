import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'ERPLeague Australia | SAP & ERP Services',
  description: 'Boutique Australian SAP and ERP consultancy delivering SAP support, S/4HANA readiness, GROW with SAP implementation, BTP/Fiori development, integration, advisory and managed services.',
  metadataBase: new URL('https://erpleague.com.au'),
  openGraph: {
    title: 'ERPLeague Australia | SAP & ERP Services',
    description: 'Senior-led SAP and ERP services for Australian businesses.',
    url: 'https://erpleague.com.au',
    siteName: 'ERPLeague Australia',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        <SiteHeader />
        <main className="site-main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

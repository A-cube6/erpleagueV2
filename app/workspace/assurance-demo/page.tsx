import type { Metadata } from 'next';
import { AssuranceDemo } from './AssuranceDemo';
import './assurance-demo.css';

export const metadata: Metadata = {
  title: 'Access Assurance Demo | ERPLeague Australia',
  description: 'Illustrative SAP access governance and audit scenario for ERPLeague clients.',
  robots: { index: false, follow: false }
};

export default function AssuranceDemoPage() {
  return <AssuranceDemo />;
}

import type { Metadata } from 'next';
import { DemoWorkspace } from './DemoWorkspace';

export const metadata: Metadata = {
  title: 'CUST Demo Workspace | ERPLeague Australia',
  description: 'Illustrative ERPLeague client workspace.',
  robots: { index: false, follow: false }
};

export default function WorkspacePage() {
  return <DemoWorkspace />;
}

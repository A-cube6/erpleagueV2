import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AssuranceDemo } from '../AssuranceDemo';
import { demoTileContexts, type DemoTileId } from '@/lib/demo-tiles';
import '../assurance-demo.css';

export function generateStaticParams() {
  return Object.keys(demoTileContexts).map((tile) => ({ tile }));
}

export const metadata: Metadata = {
  title: 'CUST Client Workspace Demo | ERPLeague Australia',
  robots: { index: false, follow: false }
};

export default function TileDemoPage({ params }: { params: { tile: string } }) {
  if (!(params.tile in demoTileContexts)) notFound();
  return <AssuranceDemo tile={params.tile as DemoTileId} />;
}

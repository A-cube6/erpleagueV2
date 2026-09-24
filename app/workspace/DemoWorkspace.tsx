'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity, ArrowRight, Blocks, ClipboardList, FileText, FolderKanban,
  Headset, KeyRound, LayoutGrid, LogOut, Search, ShieldCheck
} from 'lucide-react';
import { DEMO_SESSION_KEY } from '@/app/login/LoginPanel';

const tiles = [
  {
    id: 'landscape', title: 'ERP Landscape', group: 'Operations', icon: Activity, tone: 'blue',
    description: 'A single place to review the SAP landscape, service health and improvement priorities.',
    examples: ['Landscape overview', 'Health check findings', 'Improvement backlog']
  },
  {
    id: 'support', title: 'Support Requests', group: 'Operations', icon: Headset, tone: 'cyan',
    description: 'A client view of incidents, enhancements, ownership and next actions.',
    examples: ['Request register', 'Priority and owner', 'Resolution history']
  },
  {
    id: 'delivery', title: 'Project Delivery', group: 'Operations', icon: FolderKanban, tone: 'violet',
    description: 'Follow milestones, work packages and agreed decisions across the engagement.',
    examples: ['Delivery milestones', 'Decision log', 'Action tracker']
  },
  {
    id: 'access', title: 'Access Governance', group: 'Security & governance', icon: ShieldCheck, tone: 'green',
    description: 'Preview the governance view for role requests, access reviews and segregation of duties.',
    examples: ['Access review', 'Role design', 'SoD observations']
  },
  {
    id: 'pam', title: 'Privileged Access', group: 'Security & governance', icon: KeyRound, tone: 'amber',
    description: 'A proposed view of privileged access approvals, activity and audit evidence.',
    examples: ['Access request', 'Approval trail', 'Activity review']
  },
  {
    id: 'btp', title: 'BTP Security & CoE', group: 'Security & governance', icon: Blocks, tone: 'indigo',
    description: 'Trace CIS identity, subaccount roles, app visibility and CoE evidence.',
    examples: ['CIS / IAS / IPS', 'Role collections', 'CoE evidence']
  },
  {
    id: 'reports', title: 'Reports & Insights', group: 'Resources', icon: FileText, tone: 'rose',
    description: 'A home for client reporting, executive summaries and agreed performance measures.',
    examples: ['Status reports', 'Risk summary', 'Recommendations']
  },
  {
    id: 'documents', title: 'Documents & Actions', group: 'Resources', icon: ClipboardList, tone: 'teal',
    description: 'Find project material and track actions that need review or a decision.',
    examples: ['Document register', 'Open actions', 'Meeting outcomes']
  }
] as const;

export function DemoWorkspace() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem(DEMO_SESSION_KEY) !== 'iagcust') {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  const signOut = () => {
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    setReady(false);
    router.replace('/login');
  };

  if (!ready) return <div className="workspace-loading" role="status">Opening demo workspace…</div>;

  const visibleTiles = tiles.filter((tile) =>
    `${tile.title} ${tile.group} ${tile.description}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="workspace-page">
      <div className="workspace-bar">
        <div className="container workspace-bar-inner">
          <div className="workspace-brand"><LayoutGrid size={19} strokeWidth={2.2} aria-hidden="true" /><span>ERPLeague <strong>Workspace</strong></span></div>
          <div className="workspace-account"><span className="workspace-account-name">CUST · Demo</span><button type="button" onClick={signOut}><LogOut size={16} aria-hidden="true" /> Sign out</button></div>
        </div>
      </div>

      <div className="container workspace-content">
        <div className="workspace-intro">
          <div>
            <span className="workspace-kicker">Client workspace / CUST</span>
            <h1>Welcome to your workspace</h1>
            <p>Explore how delivery, support and governance could come together in one client view.</p>
          </div>
          <span className="workspace-demo-badge">DEMO · SAMPLE CONTENT</span>
        </div>

        <div className="workspace-feature">
          <div className="workspace-feature-icon"><ShieldCheck size={26} strokeWidth={1.8} aria-hidden="true" /></div>
          <div><span>INTERACTIVE CLIENT EXPERIENCE</span><h2>Follow an access risk from request to audit evidence</h2><p>Make a sample SoD decision, control a privileged session, and see the management metrics and evidence pack update together.</p></div>
          <button type="button" onClick={() => router.push('/workspace/assurance-demo')}>Run the scenario <ArrowRight size={17} aria-hidden="true" /></button>
        </div>

        <div className="workspace-tools">
          <div><h2>Applications</h2><p>Open any tile to explore its interactive sample view.</p></div>
          <label className="workspace-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Search applications</span><input type="search" placeholder="Search applications" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        </div>

        {(['Operations', 'Security & governance', 'Resources'] as const).map((group) => {
          const groupTiles = visibleTiles.filter((tile) => tile.group === group);
          return groupTiles.length > 0 && (
            <section className="workspace-group" key={group} aria-label={group}>
              <h3>{group}</h3>
              <div className="workspace-grid">
                {groupTiles.map((tile) => {
                  const Icon = tile.icon;
                  return (
                    <Link className={`workspace-tile tone-${tile.tone}`} href={`/workspace/assurance-demo/${tile.id}`} key={tile.id}>
                      <span className="workspace-tile-icon"><Icon size={27} strokeWidth={1.8} aria-hidden="true" /></span>
                      <span className="workspace-tile-title">{tile.title}</span>
                      <span className="workspace-tile-subtitle">Open demo view <ArrowRight size={15} aria-hidden="true" /></span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
        {visibleTiles.length === 0 && <p className="workspace-empty">No applications match “{query}”.</p>}

        <p className="workspace-disclaimer">This is an illustrative demo. The tiles do not connect to CUST systems, process requests or display real client information.</p>
      </div>
    </div>
  );
}

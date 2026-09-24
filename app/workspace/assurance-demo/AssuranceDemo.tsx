'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  Activity, ArrowLeft, ArrowRight, BadgeCheck, Check, CircleAlert, ClipboardCheck,
  Download, FileText, Fingerprint, FolderKanban, Headset, Info, KeyRound, LayoutDashboard, LockKeyhole, Mail,
  RotateCcw, Search, ShieldAlert, ShieldCheck, Workflow
} from 'lucide-react';
import { DEMO_SESSION_KEY } from '@/app/login/LoginPanel';
import {
  ASSURANCE_STORAGE_KEY, PAM_ALLOWED_TRANSACTION, PAM_BLOCKED_TRANSACTION, PAM_SAMPLE_ID, PAM_SAMPLE_TARGET,
  addEventNote, advanceDelivery, advancePam, advanceSupport, assuranceMeasures, checkPamSecurity, decideAccess, deliveryStages,
  expirePam, initialAssuranceState, isAssuranceState, recordPamTransaction, restoreAssuranceState,
  type AssuranceState, type SodDecision, type ReviewOutcome
} from '@/lib/assurance-demo';
import { demoTileContexts, type DemoTileId, type DemoView } from '@/lib/demo-tiles';
import { BTP_STORAGE_KEY, type BtpPersona } from '@/lib/btp-security-demo';
import { BtpSecurityDemo } from './BtpSecurityDemo';
import { EventLogDialog } from './EventLogDialog';

type Persona = 'Executive' | 'Requester' | 'Security' | 'Auditor';
type ReportId = 'snapshot' | 'sod' | 'pam' | 'trail';

const navigation: { id: DemoView; title: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', title: 'Outcome cockpit', icon: LayoutDashboard },
  { id: 'sod', title: 'Access governance', icon: ShieldAlert },
  { id: 'pam', title: 'Privileged access', icon: KeyRound },
  { id: 'evidence', title: 'Audit reports', icon: FileText },
  { id: 'landscape', title: 'Landscape fit', icon: Workflow },
  { id: 'btp', title: 'BTP Security & CoE', icon: ShieldCheck },
  { id: 'support', title: 'Support requests', icon: Headset },
  { id: 'delivery', title: 'Project delivery', icon: FolderKanban },
  { id: 'documents', title: 'Documents & actions', icon: ClipboardCheck }
];

const moduleTile: Partial<Record<DemoView, DemoTileId>> = {
  sod: 'access', pam: 'pam', evidence: 'reports', landscape: 'landscape', btp: 'btp',
  support: 'support', delivery: 'delivery', documents: 'documents'
};

const tileDescriptions: Record<DemoTileId, string> = {
  landscape: 'Map control ownership, then explore BTP identity and authorisation.',
  support: 'Trace a sample request from triage to resolution.',
  delivery: 'Review delivery stages, acceptance and handover evidence.',
  access: 'Resolve a sample SoD conflict and inspect its evidence.',
  pam: 'Approve, use and independently review privileged access.',
  btp: 'Trace CIS identity, BTP roles, app visibility and CoE evidence.',
  reports: 'Find and export sample compliance and audit reports.',
  documents: 'Find an action, its owner and the supporting record.'
};

const suggestedNotes: Record<Exclude<SodDecision, 'open'>, string> = {
  revised: 'Keep Invoice Release with its existing owner. Replace the requested Supplier Master Maintenance role with display-only access, then re-run the SoD check before provisioning.',
  mitigated: 'Allow the exceptional combination for seven days only. Assign a separate control owner to review supplier changes and related approvals daily; retain the residual SoD risk for certification.',
  held: 'Do not grant the requested access until the business owner confirms a separate approver or a control that addresses the conflict.'
};

const personaCopy: Record<Persona, string> = {
  Executive: 'Decide on risk, ownership and measurable outcomes.',
  Requester: 'Start and use the approved PAM ID within its time window.',
  Security: 'Check roles, approvals and the privileged session.',
  Auditor: 'Trace decisions, activity and independent review.'
};

const phaseLabels: Record<AssuranceState['pamPhase'], string> = {
  requested: 'Approval needed', approved: 'Approved · not started', active: 'Session in progress',
  ended: 'Security and audit due', reviewed: 'Review complete'
};

function InfoNote({ title, children, kind = 'blue' }: { title: string; children: React.ReactNode; kind?: 'blue' | 'amber' | 'green' }) {
  return <aside className={`assurance-info assurance-info-${kind}`}><Info size={18} aria-hidden="true" /><div><strong>{title}</strong><p>{children}</p></div></aside>;
}

function nowLabel() {
  return new Date().toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function pamTimeLabel(ms: number) {
  return new Date(ms).toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function csvCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function AssuranceDemo({ tile }: { tile?: DemoTileId }) {
  const router = useRouter();
  const tileContext = tile ? demoTileContexts[tile] : null;
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<DemoView>(tileContext?.start ?? 'overview');
  const [persona, setPersona] = useState<Persona>('Executive');
  const [btpPersona, setBtpPersona] = useState<BtpPersona>('Employee');
  const [btpResetKey, setBtpResetKey] = useState(0);
  const [state, setState] = useState<AssuranceState>(initialAssuranceState);
  const [draftDecision, setDraftDecision] = useState<Exclude<SodDecision, 'open'>>('revised');
  const [draftNote, setDraftNote] = useState(suggestedNotes.revised);
  const [draftOwner, setDraftOwner] = useState(initialAssuranceState.mitigationOwner);
  const [draftDays, setDraftDays] = useState(initialAssuranceState.mitigationDays);
  const [notice, setNotice] = useState('');
  const [selectedReport, setSelectedReport] = useState<ReportId>('snapshot');
  const [reportSearch, setReportSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [eventArea, setEventArea] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState('access');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [clockMs, setClockMs] = useState(() => Date.now());
  const closeEventLog = useCallback(() => setSelectedEventId(null), []);

  useEffect(() => {
    if (sessionStorage.getItem(DEMO_SESSION_KEY) !== 'iagcust') {
      router.replace('/login');
      return;
    }
    const requestedView = new URLSearchParams(window.location.search).get('view');
    if (!tile && navigation.some((item) => item.id === requestedView)) setView(requestedView as DemoView);
    try {
      const saved = sessionStorage.getItem(ASSURANCE_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isAssuranceState(parsed)) {
          setState(restoreAssuranceState(parsed));
          if (parsed.decision !== 'open') {
            setDraftDecision(parsed.decision);
            setDraftNote(parsed.decisionNote);
          }
          setDraftOwner(parsed.mitigationOwner);
          setDraftDays(parsed.mitigationDays);
        }
      }
    } catch { /* An invalid draft is replaced by the sample scenario. */ }
    setReady(true);
  }, [router, tile]);

  useEffect(() => {
    if (ready) sessionStorage.setItem(ASSURANCE_STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  useEffect(() => {
    if (!ready || !state.pamExpiresAt || !['approved', 'active'].includes(state.pamPhase)) return;
    const refreshWindow = () => {
      const now = Date.now();
      setClockMs(now);
      setState((current) => expirePam(current, nowLabel(), now));
    };
    const timeout = window.setTimeout(refreshWindow, Math.max(0, state.pamExpiresAt - Date.now()));
    const ticker = window.setInterval(() => setClockMs(Date.now()), 30000);
    window.addEventListener('focus', refreshWindow);
    document.addEventListener('visibilitychange', refreshWindow);
    return () => { window.clearTimeout(timeout); window.clearInterval(ticker); window.removeEventListener('focus', refreshWindow); document.removeEventListener('visibilitychange', refreshWindow); };
  }, [ready, state.pamExpiresAt, state.pamPhase]);

  if (!ready) return <div className="workspace-loading" role="status">Opening the access assurance demo…</div>;

  const measures = assuranceMeasures(state);
  const pamStatus = state.pamPhase === 'ended' ? `${state.pamClosureReason === 'expired' ? 'Expired' : 'Closed'} · ${state.pamSecurityCheckedAt ? 'audit review due' : 'security check due'}` : state.pamPhase === 'reviewed' ? `Reviewed · ${state.pamClosureReason === 'expired' ? 'expired' : 'closed'}` : phaseLabels[state.pamPhase];
  const minutesLeft = state.pamExpiresAt ? Math.max(0, Math.ceil((state.pamExpiresAt - clockMs) / 60000)) : 0;
  const visibleNavigation = tileContext ? navigation.filter((item) => (tileContext.views as readonly DemoView[]).includes(item.id)) : navigation;
  const showRoleRail = !tile || view === 'pam' || view === 'btp';
  const chooseView = (next: DemoView) => {
    if (tileContext && !(tileContext.views as readonly DemoView[]).includes(next)) {
      router.push(`/workspace/assurance-demo/${moduleTile[next] ?? 'reports'}`);
    } else {
      setView(next);
      if (next === 'evidence' && tile === 'access') setSelectedReport('sod');
      if (next === 'evidence' && tile === 'pam') setSelectedReport('pam');
      if (next === 'documents' && tile === 'delivery') setSelectedDocument('delivery');
    }
    if (next !== 'pam' && tile !== 'pam' && persona === 'Requester') setPersona('Executive');
    setNotice('');
  };
  const changeDecision = (choice: Exclude<SodDecision, 'open'>) => {
    setDraftDecision(choice);
    setDraftNote(suggestedNotes[choice]);
    setNotice('');
  };
  const saveDecision = () => {
    try {
      const next = decideAccess({ ...state, mitigationOwner: draftOwner, mitigationDays: draftDays }, draftDecision, draftNote, nowLabel());
      setState(next);
      setNotice('The decision and rationale were added to the sample evidence trail.');
    } catch (error) { setNotice((error as Error).message); }
  };
  const takePamAction = (outcome?: Exclude<ReviewOutcome, null>) => {
    try {
      const next = advancePam(state, nowLabel(), outcome, Date.now());
      setState(next);
      setClockMs(Date.now());
      setNotice(state.pamPhase === 'requested' ? 'Approved. The requester can view a sample notification; no email was sent.' : state.pamPhase === 'approved' ? 'The requester started the sample session. The approved window is now in use.' : 'The PAM status and sample audit trail have been updated.');
    } catch (error) { setNotice((error as Error).message); }
  };
  const takePamTransaction = (kind: 'approved' | 'out-of-scope') => {
    try {
      const next = recordPamTransaction(state, nowLabel(), kind, Date.now());
      setState(next);
      setSelectedEventId(next.events[next.events.length - 1].id);
      setNotice(kind === 'out-of-scope' ? 'The out-of-scope attempt was blocked and flagged in the sample log.' : 'Approved sample maintenance activity was recorded.');
    } catch (error) { setNotice((error as Error).message); }
  };
  const takeSecurityCheck = () => {
    try {
      setState(checkPamSecurity(state, nowLabel(), Date.now()));
      setNotice('Security checked the closed sample log. The Auditor can now record an independent outcome.');
    } catch (error) { setNotice((error as Error).message); }
  };
  const expirePamSample = () => {
    const now = Date.now();
    setState((current) => expirePam({ ...current, pamExpiresAt: now }, nowLabel(), now));
    setClockMs(now);
    setNotice('The demo clock advanced past the PAM expiry. Access is closed; independent review is due.');
  };
  const saveEventNote = (eventId: string, text: string) => {
    try {
      setState((current) => addEventNote(current, eventId, { actor: view === 'pam' ? `${persona} (demo)` : 'Demo viewer', at: nowLabel(), text }));
      setNotice('Comment saved to the sample event log.');
    } catch (error) { setNotice((error as Error).message); }
  };
  const takeSupportAction = () => {
    try {
      setState(advanceSupport(state, nowLabel()));
      setNotice('The support action was recorded in the sample trail.');
    } catch (error) { setNotice((error as Error).message); }
  };
  const takeDeliveryAction = () => {
    try {
      setState(advanceDelivery(state, nowLabel()));
      setNotice('The delivery stage was recorded in the sample trail.');
    } catch (error) { setNotice((error as Error).message); }
  };
  const resetDemo = () => {
    sessionStorage.removeItem(BTP_STORAGE_KEY);
    setBtpResetKey((current) => current + 1);
    setBtpPersona('Employee');
    setState(initialAssuranceState);
    setDraftDecision('revised');
    setDraftNote(suggestedNotes.revised);
    setDraftOwner(initialAssuranceState.mitigationOwner);
    setDraftDays(initialAssuranceState.mitigationDays);
    setView(tile && view === 'btp' ? 'btp' : tileContext?.start ?? 'overview');
    setPersona('Executive');
    setSelectedReport('snapshot');
    setReportSearch('');
    setEventSearch('');
    setEventArea('all');
    setSelectedEventId(null);
    setClockMs(Date.now());
    setNotice('The sample scenario has been reset.');
  };
  const scopedEvents = state.events.filter((event) => tile === 'access' ? ['Access request', 'SoD analysis', 'Access governance'].includes(event.area) : tile === 'pam' ? ['Privileged access', 'Activity evidence', 'Activity review'].includes(event.area) : true);
  const reports: { id: ReportId; title: string; detail: string; status: string; tone: string }[] = [
    { id: 'snapshot', title: 'Compliance snapshot', detail: `${measures.checkpoints.length} control checkpoints`, status: `${measures.evidenceCount}/${measures.checkpoints.length} captured`, tone: 'blue' },
    { id: 'sod', title: 'SoD decision register', detail: 'Access risk and owner', status: state.decision === 'open' ? 'Decision due' : 'Decision recorded', tone: state.decision === 'open' ? 'red' : 'green' },
    { id: 'pam', title: 'Privileged access review', detail: 'Approval, activity, review', status: state.pamPhase === 'reviewed' ? 'Reviewed' : 'Review pending', tone: state.pamPhase === 'reviewed' ? 'green' : 'yellow' },
    { id: 'trail', title: 'Audit event trail', detail: 'Searchable sample log', status: `${scopedEvents.length} events`, tone: 'blue' }
  ];
  const scopedReports = reports.filter((report) => tile === 'access' ? ['sod', 'trail'].includes(report.id) : tile === 'pam' ? ['pam', 'trail'].includes(report.id) : true);
  const visibleReports = scopedReports.filter((report) => `${report.title} ${report.detail}`.toLowerCase().includes(reportSearch.toLowerCase().trim()));
  const eventAreas = Array.from(new Set(scopedEvents.map((event) => event.area)));
  const filteredEvents = scopedEvents.filter((event) =>
    (eventArea === 'all' || event.area === eventArea) &&
    `${event.id} ${event.at} ${event.area} ${event.action} ${event.actor} ${event.detail} ${event.transaction ?? ''} ${(state.eventNotes?.[event.id] ?? []).map((note) => note.text).join(' ')}`.toLowerCase().includes(eventSearch.toLowerCase().trim())
  );
  const selectedEvent = state.events.find((event) => event.id === selectedEventId);
  const pamSessionEvents = state.events.filter((event) => !!event.transaction && event.area === 'Activity evidence');
  const downloadCsv = () => {
    let rows: string[][];
    if (selectedReport === 'snapshot') {
      rows = [['Case', 'Control checkpoint', 'Status'], ...measures.checkpoints.map((point) => ['DEMO-AG-1042', point.label, point.done ? 'Captured in demo' : 'Outstanding'])];
    } else if (selectedReport === 'sod') {
      rows = [['Case', 'Conflict', 'Decision', 'Rationale', 'Mitigation owner', 'Validity (days)'],
        ['DEMO-AG-1042', 'Supplier maintenance + invoice release', state.decision, state.decisionNote, state.decision === 'mitigated' ? state.mitigationOwner : '', state.decision === 'mitigated' ? String(state.mitigationDays) : '']];
    } else if (selectedReport === 'pam') {
      rows = [['Case', 'PAM ID', 'Requested system', 'Purpose', 'Window (hours)', 'Approved at', 'Expires at', 'Session status', 'Approval', 'Security check', 'Out-of-scope attempts', 'Independent review', 'Review outcome'],
        ['DEMO-AG-1042', PAM_SAMPLE_ID, PAM_SAMPLE_TARGET, state.pamReason, String(state.durationHours), state.pamApprovedAt ? pamTimeLabel(state.pamApprovedAt) : 'Pending', state.pamExpiresAt ? pamTimeLabel(state.pamExpiresAt) : 'Pending', pamStatus, state.pamPhase === 'requested' ? 'Pending' : state.approverNote, state.pamSecurityCheckedAt ? state.pamSecurityNote ?? '' : 'Pending', String(measures.flaggedTransactions), state.pamPhase === 'reviewed' ? state.reviewerNote : 'Pending', state.reviewOutcome ?? 'Pending']];
    } else {
      rows = [['Event ID', 'Recorded at', 'Area', 'Action', 'Actor', 'Evidence detail', 'Transaction', 'Result', 'Flagged', 'Reviewer comments'], ...filteredEvents.map((event) => [event.id, event.at, event.area, event.action, event.actor, event.detail, event.transaction ?? '', event.result ?? '', event.flagged ? 'Yes · blocked' : 'No', (state.eventNotes?.[event.id] ?? []).map((note) => `${note.actor} (${note.at}): ${note.text}`).join(' | ')])];
    }
    const csv = '\uFEFF' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `erpleague-cust-demo-${selectedReport}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="assurance-page">
      <div className="container assurance-wrap">
        <div className="assurance-utility">
          <Link href="/workspace"><ArrowLeft size={16} aria-hidden="true" /> Back to launchpad</Link>
          {(!tile || ['sod', 'pam', 'support', 'delivery', 'btp'].includes(view)) && <button type="button" onClick={resetDemo}><RotateCcw size={15} aria-hidden="true" /> Reset sample</button>}
        </div>

        {tile ? <header className="assurance-tile-header">
          <div><span>CUST DEMO WORKSPACE</span><h1>{tileContext?.title}</h1><p>{tileDescriptions[tile]}</p></div>
          <span className="assurance-tile-tag">SYNTHETIC EXAMPLE</span>
        </header> : <header className="assurance-hero">
          <div className="assurance-hero-copy">
            <span className="assurance-hero-eyebrow"><span className="assurance-live-dot" /> CUST CLIENT EXPERIENCE · INTERACTIVE DEMO</span>
            <h1>From access risk to audit evidence</h1>
            <p>Make a decision. Control an exception. Trace the evidence.</p>
            <div className="assurance-hero-tags">{view === 'btp' ? <><span>Sample case DEMO-BTP-042</span><span>Synthetic BTP and CIS records</span><span>No CUST connection</span></> : <><span>Sample case DEMO-AG-1042</span><span>Simulated SAP S/4 scope</span><span>No client data</span></>}</div>
          </div>
          <div className="assurance-hero-art" aria-hidden="true"><ShieldCheck size={50} strokeWidth={1.3} /><span>Request</span><ArrowRight size={20} /><span>Control</span><ArrowRight size={20} /><span>Evidence</span></div>
        </header>}

        <div className={`assurance-demo-ribbon${tile ? ' assurance-demo-ribbon-compact' : ''}`}><Info size={18} aria-hidden="true" /><p><strong>Demo only.</strong> {tile ? 'Synthetic data stays in this browser. No SAP or CUST connection.' : 'People, rules, logs and metrics are synthetic. Changes stay in this browser. CUST fitment requires discovery; no SAP system is connected.'}</p></div>

        <div className={`assurance-shell${showRoleRail ? '' : ' assurance-shell-no-rail'}`}>
          {showRoleRail &&
          <aside className="assurance-role-rail" aria-label="Role play section">
            <span className="assurance-role-eyebrow">ROLE PLAY</span>
            <h2>{view === 'btp' ? 'BTP role play' : view === 'pam' ? 'PAM role play' : 'Choose a perspective'}</h2>
            <p>{view === 'btp' ? 'Trace identity, access and review.' : view === 'pam' ? 'Approve, operate and review.' : 'See the same case through each role.'}</p>
            {view === 'btp' ? <><div className="assurance-role-buttons assurance-role-buttons-btp" role="group" aria-label="BTP security perspective">{(['Employee', 'Identity Ops', 'BTP Admin', 'CoE Reviewer'] as const).map((p) => <button type="button" key={p} aria-pressed={btpPersona === p} className={`assurance-role-button role-${p.toLowerCase().replace(' ', '-')} ${btpPersona === p ? 'active' : ''}`} onClick={() => setBtpPersona(p)}><strong>{p}</strong><span>{p === 'Employee' ? 'User experience' : p === 'Identity Ops' ? 'IPS & IAS' : p === 'BTP Admin' ? 'Roles & scope' : 'Evidence & audit'}</span></button>)}</div><div className="assurance-role-lens"><strong>{btpPersona} view</strong><p>{btpPersona === 'Employee' ? 'Test sign-in and app visibility.' : btpPersona === 'Identity Ops' ? 'Run IPS and inspect the sync.' : btpPersona === 'BTP Admin' ? 'Inspect and map role collections.' : 'Check the trail and review the fix.'}</p></div><div className="assurance-role-tip"><Info size={15} aria-hidden="true" /><span>Switch personas to complete the control journey.</span></div></> : <><div className="assurance-role-buttons" role="group" aria-label="Perspective">{(view === 'pam' ? ['Executive', 'Requester', 'Security', 'Auditor'] : ['Executive', 'Security', 'Auditor'] as Persona[]).map((p) => <button type="button" key={p} aria-pressed={persona === p} className={`assurance-role-button role-${p.toLowerCase()} ${persona === p ? 'active' : ''}`} onClick={() => { setPersona(p as Persona); setNotice(''); }}><strong>{p}</strong><span>{p === 'Executive' ? 'Approval' : p === 'Requester' ? 'Use PAM ID' : p === 'Security' ? 'Check activity' : 'Review evidence'}</span></button>)}</div><div className="assurance-role-lens"><strong>{persona} view</strong><p>{personaCopy[persona]}</p></div><div className="assurance-role-tip"><Info size={15} aria-hidden="true" /><span>{view === 'pam' ? 'Approve → requester uses the ID → security checks activity → auditor reviews.' : 'Switch to Auditor to complete the independent PAM review.'}</span></div></>}
          </aside>}
          <div className="assurance-stage">

        {!tile && view !== 'btp' && <><section className="assurance-metrics" aria-label="Sample outcome metrics">
          <div className="assurance-metric metric-red"><span>Open access risks</span><strong>{measures.unresolvedRiskRequests}</strong><small>{measures.mitigatedRiskRequests ? '1 mitigated risk remains' : '1 at scenario start'}</small></div>
          <div className="assurance-metric metric-yellow"><span>PAM reviews complete</span><strong>{measures.completedReviews} / 1</strong><small>{measures.sessionsAwaitingReview ? 'Independent review due' : 'Review after session closure'}</small></div>
          <div className="assurance-metric metric-blue"><span>Evidence captured</span><strong>{measures.evidenceCount} / {measures.checkpoints.length}</strong><small>Sample control checkpoints</small></div>
          <div className="assurance-metric metric-green"><span>Follow-ups</span><strong>{measures.flaggedFollowups}</strong><small>Flagged by independent review</small></div>
        </section>
        <p className="assurance-metric-note"><strong>Sample metrics only.</strong> CUST baseline and targets require discovery.</p></>}

        {tile === 'pam' && <section className="assurance-metrics assurance-metrics-pam" aria-label="PAM sample outcome metrics">
          <div className="assurance-metric metric-red"><span>Open access risks</span><strong>{measures.unresolvedRiskRequests}</strong><small>Separate sample SoD case</small></div>
          <div className="assurance-metric metric-blue"><span>Active PAM IDs</span><strong>{measures.activePam}</strong><small>Approved session in use</small></div>
          <div className="assurance-metric metric-green"><span>Closed PAM</span><strong>{measures.closedPam}</strong><small>Includes reviewed sessions</small></div>
          <div className="assurance-metric metric-yellow"><span>Pending review</span><strong>{measures.sessionsAwaitingReview}</strong><small>After close or expiry</small></div>
          <div className="assurance-metric metric-green"><span>PAM reviews complete</span><strong>{measures.completedReviews} / 1</strong><small>Independent outcome</small></div>
          <div className="assurance-metric metric-blue"><span>Evidence captured</span><strong>{measures.evidenceCount} / {measures.checkpoints.length}</strong><small>Sample checkpoints</small></div>
          <div className="assurance-metric metric-red"><span>Out-of-scope attempts</span><strong>{measures.flaggedTransactions}</strong><small>Blocked and flagged</small></div>
        </section>}

        {visibleNavigation.length > 1 && <nav className="assurance-nav" aria-label={`${tileContext?.title ?? 'Demo'} modules`}>{visibleNavigation.map(({ id, title, icon: Icon }) => <button type="button" key={id} aria-current={view === id ? 'page' : undefined} className={view === id ? 'active' : ''} onClick={() => chooseView(id)}><Icon size={18} aria-hidden="true" />{tile === 'delivery' && id === 'documents' ? 'Delivery records' : tile === 'access' && id === 'evidence' ? 'Access evidence' : tile === 'pam' && id === 'evidence' ? 'PAM evidence' : title}</button>)}</nav>}
        {notice && <div className="assurance-notice" role="status">{notice}</div>}

        {view === 'overview' && <div className="assurance-layout">
          <section className="assurance-main-panel">
            <div className="assurance-section-head"><span>THE CONTROL STORY</span><h2>Request → decision → evidence</h2><p>Follow an <strong>SoD risk</strong> and a separate <strong>PAM exception</strong>.</p></div>
            <div className="assurance-story-list">
              <button type="button" onClick={() => chooseView('sod')}><span className="assurance-story-number">01</span><div><strong>Resolve the SoD conflict</strong><p>Supplier maintenance + invoice release.</p><small>{state.decision === 'open' ? 'Decision due' : `Decision: ${state.decision}`}</small></div><ArrowRight size={18} aria-hidden="true" /></button>
              <button type="button" onClick={() => chooseView('pam')}><span className="assurance-story-number">02</span><div><strong>Control emergency access</strong><p>Approve a purpose and time window; review activity.</p><small>{phaseLabels[state.pamPhase]}</small></div><ArrowRight size={18} aria-hidden="true" /></button>
              <button type="button" onClick={() => chooseView('evidence')}><span className="assurance-story-number">03</span><div><strong>Show the audit trail</strong><p>Find the decision, owner and review.</p><small>{measures.evidenceCount} of {measures.checkpoints.length} checkpoints captured</small></div><ArrowRight size={18} aria-hidden="true" /></button>
            </div>
          </section>
          <aside className="assurance-side-panel"><h3>ERPLeague’s focus</h3><p><strong>Design the controls.</strong> Name owners. Make evidence usable.</p><div className="assurance-outcome-line"><ShieldCheck size={19} /><span><strong>Control design</strong> Risks, rules, least privilege</span></div><div className="assurance-outcome-line"><Fingerprint size={19} /><span><strong>Traceable access</strong> Request to review</span></div><div className="assurance-outcome-line"><Activity size={19} /><span><strong>Measured operation</strong> Exceptions and reviews</span></div><InfoNote title="Discovery first" kind="amber">Confirm rules, connectors, logs, retention and CUST owners before design.</InfoNote></aside>
        </div>}

        {view === 'sod' && <div className="assurance-layout">
          <section className="assurance-main-panel">
            <div className="assurance-section-head"><span>ACCESS GOVERNANCE · SAMPLE CASE</span><h2>Catch the conflict before the grant</h2><p>Check the <strong>requested role</strong> against <strong>existing access</strong>.</p></div>
            <div className="assurance-case-grid"><div><small>Requested</small><strong>Supplier Master Maintenance</strong><p>Urgent supplier onboarding.</p></div><div><small>Already held</small><strong>Invoice Release</strong><p>Sample S/4 user access.</p></div></div>
            <div className="assurance-risk"><CircleAlert size={22} aria-hidden="true" /><div><strong>HIGH · Sample SoD conflict</strong><p>One person could change supplier details and release an invoice. Confirm the rule in CUST discovery.</p></div></div>
            <h3 className="assurance-subhead">Choose a control response</h3>
            <div className="assurance-choices">
              <button type="button" aria-pressed={draftDecision === 'revised'} className={draftDecision === 'revised' ? 'selected' : ''} onClick={() => changeDecision('revised')}><BadgeCheck size={21} /><strong>Least privilege</strong><span>Display only; recheck SoD.</span></button>
              <button type="button" aria-pressed={draftDecision === 'mitigated'} className={draftDecision === 'mitigated' ? 'selected' : ''} onClick={() => changeDecision('mitigated')}><ClipboardCheck size={21} /><strong>Time-limited mitigation</strong><span>Named owner; daily review.</span></button>
              <button type="button" aria-pressed={draftDecision === 'held'} className={draftDecision === 'held' ? 'selected' : ''} onClick={() => changeDecision('held')}><LockKeyhole size={21} /><strong>Hold access</strong><span>No grant until control is agreed.</span></button>
            </div>
            {draftDecision === 'mitigated' && <div className="assurance-mitigation-fields"><label>Independent control owner<input value={draftOwner} onChange={(event) => setDraftOwner(event.target.value)} /></label><label>Mitigation validity<select value={draftDays} onChange={(event) => setDraftDays(Number(event.target.value))}><option value={1}>1 day</option><option value={7}>7 days</option><option value={14}>14 days</option></select></label></div>}
            <label className="assurance-comment-label" htmlFor="sod-note"><strong>Decision rationale · sample approver comment</strong><span>Make the business reason and accountable decision visible to a reviewer.</span></label>
            <textarea id="sod-note" rows={3} value={draftNote} onChange={(event) => setDraftNote(event.target.value)} />
            <button type="button" className="assurance-primary" onClick={saveDecision}>Record sample decision <ArrowRight size={17} /></button>
            {state.decision !== 'open' && <div className="assurance-result"><Check size={20} /><div><strong>Recorded: {state.decision === 'revised' ? 'role revised before provisioning' : state.decision === 'mitigated' ? 'residual risk with a compensating control' : 'request held; no access granted'}</strong><p>{state.decisionNote}</p>{state.decision === 'mitigated' && <p>Independent owner: {state.mitigationOwner} · validity: {state.mitigationDays} days.</p>}</div></div>}
          </section>
          <aside className="assurance-side-panel"><h3>Why this matters</h3><p><strong>SoD flags the conflict.</strong> An accountable owner must decide what happens next.</p><InfoNote title="SAP IAG fit">Access Analysis and approval can support the decision, subject to CUST’s rules and systems.</InfoNote><InfoNote title="Measure it" kind="green">Track open risks, decision age and mitigation review.</InfoNote><button type="button" className="assurance-next" onClick={() => chooseView('pam')}>Open Privileged Access tile <ArrowRight size={16} /></button></aside>
        </div>}

        {view === 'pam' && <div className="assurance-layout">
          <section className="assurance-main-panel">
            <div className="assurance-section-head"><span>PRIVILEGED ACCESS · SAMPLE EXCEPTION</span><h2>Approve → use → close → review</h2><p>Follow one <strong>PAM ID</strong> from the decision to independent evidence.</p></div>
            <div className="assurance-phase-row">{(['Requested', 'Approved', 'Active', state.pamClosureReason === 'expired' ? 'Expired' : 'Closed', 'Reviewed'] as const).map((label, index) => { const at = ['requested','approved','active','ended','reviewed'].indexOf(state.pamPhase); return <div className={`${at >= index ? 'done' : ''} ${at === index ? 'current' : ''}`} key={index}><span>{index + 1}</span><small>{label}</small></div>; })}</div>
            <div className={`assurance-pam-status${state.pamClosureReason === 'expired' ? ' is-expired' : ''}`}><strong>Current status: {pamStatus}</strong><span>{state.pamExpiresAt ? `Access window: ${pamTimeLabel(state.pamApprovedAt ?? state.pamExpiresAt - state.durationHours * 3_600_000)} → ${pamTimeLabel(state.pamExpiresAt)}${['approved','active'].includes(state.pamPhase) ? ` · ${minutesLeft} min left` : ''}` : 'Window starts when the Executive approves'}</span></div>
            {state.pamPhase !== 'reviewed' && <div className="assurance-role-gate"><strong>{state.pamPhase === 'requested' ? 'Executive · approve the request' : state.pamPhase === 'approved' ? 'Requester · start the approved session' : state.pamPhase === 'active' ? 'Requester · work within scope' : state.pamSecurityCheckedAt ? 'Auditor · independently review' : 'Security · check the closed log'}</strong><span>{state.pamPhase === 'requested' ? 'Approve the purpose, ID and time window.' : state.pamPhase === 'approved' ? 'Notification preview is below. Sign in to the target system and select the approved PAM ID.' : state.pamPhase === 'active' ? 'Run only approved maintenance actions, then close the session.' : state.pamSecurityCheckedAt ? 'Compare activity and any flags to the approved scope, then record an outcome.' : 'Inspect the transactions and expiry, record the security check, then hand over to Auditor.'}</span></div>}
            <div className="assurance-case-grid"><div><small>Requested system · sample</small><strong>{PAM_SAMPLE_TARGET}</strong><p>PAM ID {PAM_SAMPLE_ID} · scope: {PAM_ALLOWED_TRANSACTION}.</p></div><div><small>Access window</small><strong>{state.durationHours} hours from approval</strong><p>Expires automatically in this browser demo; the fast-forward control lets you test expiry.</p></div></div>
            <label className="assurance-comment-label" htmlFor="pam-reason"><strong>Business reason · sample requestor comment</strong><span>Why standard access cannot resolve this specific exception.</span></label>
            <textarea id="pam-reason" rows={2} value={state.pamReason} disabled={state.pamPhase !== 'requested' || persona !== 'Requester'} onChange={(event) => setState((current) => ({ ...current, pamReason: event.target.value }))} />
            <div className="assurance-form-row"><label htmlFor="pam-window">Maximum access window</label><select id="pam-window" value={state.durationHours} disabled={state.pamPhase !== 'requested' || persona !== 'Executive'} onChange={(event) => setState((current) => ({ ...current, durationHours: Number(event.target.value) }))}><option value={1}>1 hour</option><option value={2}>2 hours</option><option value={4}>4 hours</option></select></div>
            <label className="assurance-comment-label" htmlFor="pam-approval"><strong>Approval condition · independent approver comment</strong><span>Who approved the exception and how use will be checked.</span></label>
            <textarea id="pam-approval" rows={2} value={state.approverNote} disabled={state.pamPhase !== 'requested' || persona !== 'Executive'} onChange={(event) => setState((current) => ({ ...current, approverNote: event.target.value }))} />
            {state.pamPhase === 'requested' && persona === 'Executive' && <button type="button" className="assurance-primary" onClick={() => takePamAction()}>Approve sample request <ArrowRight size={17} /></button>}
            {state.pamPhase !== 'requested' && <div className="assurance-pam-email"><Mail size={19} /><div><strong>Sample approval email · preview only</strong><p>To: sample requester · Your PAM ID <b>{PAM_SAMPLE_ID}</b> is approved for <b>{PAM_SAMPLE_TARGET}</b> until <b>{state.pamExpiresAt ? pamTimeLabel(state.pamExpiresAt) : 'the displayed expiry'}</b>. Sign in with your own account, select the PAM ID and work only within the approved maintenance scope.</p><small>No email was sent. Exact sign-in, provisioning and notification behaviour require CUST validation.</small></div></div>}
            {state.pamPhase === 'approved' && persona === 'Requester' && <div className="assurance-pam-actions"><button type="button" className="assurance-primary" onClick={() => takePamAction()}>Start PAM session on requested system <ArrowRight size={17} /></button></div>}
            {state.pamPhase === 'active' && persona === 'Requester' && <div className="assurance-pam-actions"><button type="button" className="assurance-primary" onClick={() => takePamTransaction('approved')}>Run approved {PAM_ALLOWED_TRANSACTION.split(' · ')[0]} task</button><button type="button" className="assurance-outline" onClick={() => takePamTransaction('out-of-scope')}>Simulate blocked {PAM_BLOCKED_TRANSACTION.split(' · ')[0]} attempt</button><button type="button" className="assurance-outline" onClick={() => takePamAction()}>Close PAM session <ArrowRight size={16} /></button></div>}
            {['approved','active'].includes(state.pamPhase) && <button type="button" className="assurance-outline assurance-pam-expire" onClick={expirePamSample}>Fast-forward: expire sample access</button>}
            {['active','ended','reviewed'].includes(state.pamPhase) && <div className="assurance-activity"><strong>Transaction evidence · sample session</strong><div className="assurance-log-session-list">{pamSessionEvents.map((event) => <button type="button" key={event.id} className={`assurance-activity-event${event.flagged ? ' flagged' : ''}`} onClick={() => setSelectedEventId(event.id)}><strong>{event.transaction}</strong><span>{event.flagged ? 'BLOCKED · outside PAM scope' : 'ALLOWED · approved scope'}</span><small>Open {event.id} log and comments →</small></button>)}{pamSessionEvents.length === 0 && <p>{state.pamPhase === 'active' ? 'No transaction-level activity recorded yet. Run the approved task to create a sample log.' : 'No transaction-level activity was recorded before the access window closed.'}</p>}</div><button type="button" className="assurance-next" onClick={() => { chooseView('evidence'); setSelectedReport('trail'); }}>Open full event trail <ArrowRight size={16} /></button><small>All transactions and flags are synthetic. Verify real SAP log sources with CUST.</small></div>}
            {state.pamPhase === 'ended' && persona === 'Security' && <><label className="assurance-comment-label" htmlFor="pam-security-note"><strong>Security log check · comment</strong><span>Check the time window, transactions and blocked attempts; identify any item for the Auditor.</span></label><textarea id="pam-security-note" rows={2} value={state.pamSecurityNote ?? ''} disabled={!!state.pamSecurityCheckedAt} onChange={(event) => setState((current) => ({ ...current, pamSecurityNote: event.target.value }))} />{!state.pamSecurityCheckedAt ? <button type="button" className="assurance-primary" onClick={takeSecurityCheck}>Record security check <ArrowRight size={17} /></button> : <div className="assurance-result"><Check size={20} /><div><strong>Security check recorded</strong><p>Auditor can now independently review the sample evidence.</p></div></div>}</>}
            {state.pamPhase === 'ended' && persona === 'Auditor' && <>{!state.pamSecurityCheckedAt ? <InfoNote title="Security check due" kind="amber">Switch to Security to inspect the closed log and record its comment before independent review.</InfoNote> : <><InfoNote title="Security check on record" kind="green">{state.pamSecurityNote}</InfoNote><label className="assurance-comment-label" htmlFor="pam-review"><strong>Independent reviewer comment</strong><span>Compare activity and any blocked attempts with the approved purpose.</span></label><textarea id="pam-review" rows={2} value={state.reviewerNote} onChange={(event) => setState((current) => ({ ...current, reviewerNote: event.target.value }))} /><div className="assurance-action-row"><button type="button" className="assurance-primary" onClick={() => takePamAction('confirmed')}>Confirm review <Check size={17} /></button><button type="button" className="assurance-outline" onClick={() => takePamAction('followup')}>Flag follow-up <CircleAlert size={17} /></button></div></>}</>}
            {state.pamPhase === 'reviewed' && <div className="assurance-result"><Check size={20} /><div><strong>{state.reviewOutcome === 'followup' ? 'Review complete · follow-up flagged' : 'Independent review complete'}</strong>{persona === 'Auditor' && <p>{state.reviewerNote}</p>}</div></div>}
          </section>
          <aside className="assurance-side-panel"><h3>What the control proves</h3><div className="assurance-outcome-line"><KeyRound size={19} /><span><strong>Purpose and approval</strong> Captured before use.</span></div><div className="assurance-outcome-line"><LockKeyhole size={19} /><span><strong>Timed, scoped ID</strong> Requester operates within the approved window.</span></div><div className="assurance-outcome-line"><ClipboardCheck size={19} /><span><strong>Security and audit</strong> Blocked attempts remain visible; Auditor records an outcome.</span></div><InfoNote title="SAP fitment">ID provisioning, session method, email delivery and log coverage require CUST discovery.</InfoNote><InfoNote title="Measured result" kind="green">Active, closed, pending review and flagged counts update as this case changes.</InfoNote><button type="button" className="assurance-next" onClick={() => { chooseView('evidence'); setSelectedReport('trail'); }}>Open PAM event logs <ArrowRight size={16} /></button></aside>
        </div>}

        {view === 'evidence' && <div className="assurance-report-workspace">
          <div className="assurance-report-top"><div><span>REPORT CENTRE · SAMPLE DATA</span><h2>Find it. Check it. Export it.</h2><p>{tile === 'access' ? 'The SoD decision and its access event trail.' : tile === 'pam' ? 'The privileged review and its activity trail.' : 'Pick a report; follow each decision to its sample evidence.'}</p></div>{tile !== 'access' && tile !== 'pam' && <div><strong>{measures.evidenceCount} / {measures.checkpoints.length}</strong><span>checkpoints captured</span></div>}</div>
          <div className="assurance-report-finder"><label><Search size={18} aria-hidden="true" /><span className="sr-only">Find a report</span><input type="search" placeholder="Find a report by name or purpose" value={reportSearch} onChange={(event) => { const term = event.target.value; setReportSearch(term); const match = scopedReports.find((report) => `${report.title} ${report.detail}`.toLowerCase().includes(term.toLowerCase().trim())); if (match) setSelectedReport(match.id); }} /></label><span>{visibleReports.length} sample reports</span></div>
          <div className="assurance-report-catalog" role="group" aria-label="Sample reports">{visibleReports.map((report) => <button type="button" key={report.id} aria-pressed={selectedReport === report.id} className={`assurance-report-card report-${report.tone} ${selectedReport === report.id ? 'selected' : ''}`} onClick={() => setSelectedReport(report.id)}><span className="assurance-report-card-icon"><FileText size={19} aria-hidden="true" /></span><strong>{report.title}</strong><small>{report.detail}</small><em>{report.status}</em></button>)}{visibleReports.length === 0 && <p className="assurance-report-empty">No matching report in this workspace. Try another term.</p>}</div>
          <div className="assurance-report-toolbar"><div><span>SELECTED REPORT · DEMO-AG-1042</span><h3>{reports.find((report) => report.id === selectedReport)?.title}</h3><p>Generated from this browser session. Sample data only.</p></div><div><button type="button" className="assurance-primary" onClick={() => window.print()}><FileText size={17} /> Print / save PDF</button><button type="button" className="assurance-outline" onClick={downloadCsv}><Download size={17} /> Download CSV</button></div></div>
          <div className="assurance-layout assurance-report-layout">
            <section className="assurance-main-panel assurance-report" id="assurance-report">
              <div className="assurance-report-heading"><div><span>ERPLeague · SAMPLE ASSURANCE REPORT</span><h2>{reports.find((report) => report.id === selectedReport)?.title}</h2><p>Case DEMO-AG-1042 · CUST illustrative scenario</p></div><span className="assurance-report-badge">DEMO · NOT AN AUDIT OPINION</span></div>
              {selectedReport === 'snapshot' && <><div className="assurance-report-stats"><div><small>SoD decision</small><strong>{state.decision === 'open' ? 'Pending' : state.decision === 'held' ? 'Held' : state.decision === 'mitigated' ? 'Mitigated' : 'Revised'}</strong></div><div><small>Privileged review</small><strong>{pamStatus}</strong></div><div><small>Open follow-ups</small><strong>{measures.flaggedFollowups}</strong></div></div><h3>Control checkpoints</h3><div className="assurance-check-list">{measures.checkpoints.map((point) => <div key={point.label}><span className={point.done ? 'check-done' : 'check-open'}>{point.done ? <Check size={14} /> : '–'}</span><span>{point.label}</span><small>{point.done ? 'Captured' : 'Due'}</small></div>)}</div></>}
              {selectedReport === 'sod' && <><div className="assurance-report-stats"><div><small>Illustrative conflict</small><strong>Supplier maintenance + invoice release</strong></div><div><small>Decision</small><strong>{state.decision === 'open' ? 'Pending' : state.decision === 'held' ? 'Request held' : state.decision === 'mitigated' ? 'Mitigated · residual risk' : 'Revised to least privilege'}</strong></div><div><small>Unresolved requests</small><strong>{measures.unresolvedRiskRequests}</strong></div></div><h3>Decision and owner</h3><div className="assurance-decision-record"><p><strong>Rationale:</strong> {state.decisionNote || 'Awaiting a sample access decision.'}</p><p><strong>Decision role:</strong> Sample access approver.</p>{state.decision === 'mitigated' && <p><strong>Control owner:</strong> {state.mitigationOwner} · {state.mitigationDays} day validity.</p>}<p><strong>Rule:</strong> Illustrative conflict; CUST ruleset requires discovery.</p></div></>}
              {selectedReport === 'pam' && <><div className="assurance-report-stats"><div><small>Access window</small><strong>{state.durationHours} hours from approval</strong></div><div><small>Session status</small><strong>{pamStatus}</strong></div><div><small>Independent review</small><strong>{state.pamPhase === 'reviewed' ? state.reviewOutcome === 'followup' ? 'Follow-up flagged' : 'Complete' : 'Pending'}</strong></div></div><h3>Purpose to review</h3><div className="assurance-decision-record"><p><strong>PAM ID / target:</strong> {PAM_SAMPLE_ID} · {PAM_SAMPLE_TARGET}</p><p><strong>Purpose:</strong> {state.pamReason}</p><p><strong>Approval:</strong> {state.pamPhase === 'requested' ? 'Pending' : state.approverNote}</p><p><strong>Expiry:</strong> {state.pamExpiresAt ? pamTimeLabel(state.pamExpiresAt) : 'Starts at approval'}</p><p><strong>Transaction evidence:</strong> {pamSessionEvents.length} sample entries · {measures.flaggedTransactions} blocked outside scope.</p><p><strong>Security check:</strong> {state.pamSecurityCheckedAt ? state.pamSecurityNote : 'Pending after closure or expiry.'}</p><p><strong>Independent review:</strong> {state.pamPhase === 'reviewed' ? state.reviewerNote : 'Outstanding.'}</p></div></>}
              {selectedReport === 'trail' && <><div className="assurance-trail-filters"><label><Search size={16} aria-hidden="true" /><span className="sr-only">Search audit events</span><input type="search" placeholder="Search events, actor, transaction or comment" value={eventSearch} onChange={(event) => setEventSearch(event.target.value)} /></label><label><span className="sr-only">Filter by control area</span><select value={eventArea} onChange={(event) => setEventArea(event.target.value)}><option value="all">All control areas</option>{eventAreas.map((area) => <option key={area} value={area}>{area}</option>)}</select></label></div><p className="assurance-trail-count">Showing <strong>{filteredEvents.length}</strong> of {scopedEvents.length} sample events · <strong>Click any row</strong> to inspect its log and add a comment.</p><div className="assurance-event-table"><table><thead><tr><th>Event</th><th>When</th><th>Area</th><th>Control activity</th><th>Role</th></tr></thead><tbody>{filteredEvents.map((event) => <tr key={event.id} data-openable="true" onClick={() => setSelectedEventId(event.id)}><td><button type="button" aria-label={`Open log for ${event.id}`} onClick={() => setSelectedEventId(event.id)}>{event.id}</button></td><td>{event.at}</td><td>{event.area}</td><td><strong>{event.action}</strong><span>{event.detail}</span>{event.flagged && <span className="assurance-event-flag">BLOCKED · OUTSIDE PAM SCOPE</span>}</td><td>{event.actor}</td></tr>)}</tbody></table>{filteredEvents.length === 0 && <p className="assurance-report-empty">No sample events match these filters.</p>}</div></>}
              <p className="assurance-report-foot">Synthetic example only. No CUST identity, approval, SAP log or attestation is included.</p>
            </section>
            <aside className="assurance-side-panel assurance-report-guide"><h3>Audit reading guide</h3><p>Start with the control status. Open the decision or review. Use the event trail to find the recorded action.</p><div className="assurance-outcome-line"><BadgeCheck size={19} /><span><strong>Accountable role</strong> Named in each sample record.</span></div><div className="assurance-outcome-line"><CircleAlert size={19} /><span><strong>Open gaps</strong> Shown as pending or due.</span></div><div className="assurance-outcome-line"><Download size={19} /><span><strong>Export</strong> PDF view or the selected CSV.</span></div><InfoNote title="Production evidence" kind="amber">Confirm source IDs, rule versions, log provenance, retention and reviewer authority in CUST discovery.</InfoNote></aside>
          </div>
        </div>}

        {view === 'btp' && <BtpSecurityDemo key={btpResetKey} persona={btpPersona} onPersonaChange={setBtpPersona} />}

        {view === 'documents' && <div className="assurance-layout">
          <section className="assurance-main-panel">
            <div className="assurance-section-head"><span>DOCUMENTS & ACTIONS · SAMPLE REGISTER</span><h2>Find the record. See what is due.</h2><p>Select a record to inspect its owner, status and next action.</p></div>
            <div className={`assurance-document-grid${tile === 'delivery' ? ' assurance-document-grid-single' : ''}`} role="group" aria-label="Sample records">
              {tile !== 'delivery' && <button type="button" aria-pressed={selectedDocument === 'access'} className={selectedDocument === 'access' ? 'selected' : ''} onClick={() => setSelectedDocument('access')}><FileText size={21} /><strong>SoD decision</strong><small>{state.decision === 'open' ? 'Decision due' : 'Recorded'}</small></button>}
              {tile !== 'delivery' && <button type="button" aria-pressed={selectedDocument === 'pam'} className={selectedDocument === 'pam' ? 'selected' : ''} onClick={() => setSelectedDocument('pam')}><KeyRound size={21} /><strong>PAM review</strong><small>{state.pamPhase === 'reviewed' ? 'Complete' : 'Review due'}</small></button>}
              <button type="button" aria-pressed={selectedDocument === 'delivery'} className={selectedDocument === 'delivery' ? 'selected' : ''} onClick={() => setSelectedDocument('delivery')}><FolderKanban size={21} /><strong>Control handover</strong><small>{state.deliveryStage}/{deliveryStages.length} stages</small></button>
            </div>
            <div className="assurance-document-detail"><span>SAMPLE ACTION RECORD</span><h3>{selectedDocument === 'access' ? 'Record the access decision' : selectedDocument === 'pam' ? 'Close the independent review' : 'Confirm stage acceptance'}</h3><div className="assurance-boundary-facts"><div><small>Owner</small><strong>{selectedDocument === 'access' ? 'Sample access approver' : selectedDocument === 'pam' ? 'Independent sample reviewer' : 'Sample delivery lead'}</strong></div><div><small>Status</small><strong>{selectedDocument === 'access' ? state.decision === 'open' ? 'Awaiting decision' : `Decision: ${state.decision}` : selectedDocument === 'pam' ? phaseLabels[state.pamPhase] : `${state.deliveryStage} of ${deliveryStages.length} stages reviewed`}</strong></div><div><small>Next action</small><strong>{selectedDocument === 'access' ? state.decision === 'open' ? 'Choose and record a control response' : 'Verify the rationale and risk owner' : selectedDocument === 'pam' ? state.pamPhase === 'reviewed' ? 'Retain the review outcome' : 'Complete the session and independent review' : state.deliveryStage === deliveryStages.length ? 'Confirm production acceptance with CUST' : 'Record evidence for the next stage'}</strong></div></div><button type="button" className="assurance-next" onClick={() => chooseView(selectedDocument === 'delivery' ? 'delivery' : 'evidence')}>{selectedDocument === 'delivery' ? 'Open delivery stages' : 'Open related audit report'} <ArrowRight size={16} /></button></div>
          </section>
          <aside className="assurance-side-panel"><h3>From action to proof</h3><p><strong>Owner → status → next action → evidence.</strong> The register reflects choices made in this browser session.</p><InfoNote title="No production records">Document IDs, approvals, dates and retention rules would come from agreed CUST sources.</InfoNote><InfoNote title="Audit outcome" kind="green">An auditor can find a decision, its owner and any open action without searching a slide deck.</InfoNote></aside>
        </div>}

        {view === 'support' && <div className="assurance-layout">
          <section className="assurance-main-panel">
            <div className="assurance-section-head"><span>SUPPORT · SAMPLE REQUEST</span><h2>Trace the missing tile</h2><p>Check <strong>identity</strong>, <strong>provisioning</strong>, <strong>tile visibility</strong> and <strong>backend access</strong>.</p></div>
            <div className="assurance-case-grid"><div><small>Case · DEMO-SUP-031</small><strong>Maintenance tile missing</strong><p>After an approved role change.</p></div><div><small>Sample status</small><strong>{state.supportStage === 'new' ? 'Needs triage' : state.supportStage === 'triaged' ? 'Owner identified' : 'Resolved in demo'}</strong><p>Demo record only.</p></div></div>
            <InfoNote title="Business process check">Trace the approved access request first. A visible tile and backend permission are separate checks.</InfoNote>
            <div className="assurance-support-checks"><h3>Sample triage path</h3><ol><li>Confirm the person and approved request.</li><li>Check identity provisioning and role mapping.</li><li>Check launchpad visibility and application authorisation.</li><li>Record the owner, fix and evidence before closure.</li></ol></div>
            <label className="assurance-comment-label" htmlFor="support-note"><strong>Support investigation comment</strong><span>Record what was checked and who should act next.</span></label>
            <textarea id="support-note" rows={3} value={state.supportNote} disabled={state.supportStage === 'resolved'} onChange={(event) => setState((current) => ({ ...current, supportNote: event.target.value }))} />
            {state.supportStage !== 'resolved' && <button type="button" className="assurance-primary" onClick={takeSupportAction}>{state.supportStage === 'new' ? 'Record sample triage' : 'Close sample support case'} <ArrowRight size={17} /></button>}
            {state.supportStage === 'resolved' && <div className="assurance-result"><Check size={20} /><div><strong>Sample support case closed</strong><p>The investigation comment is included in the downloadable event trail.</p></div></div>}
          </section>
          <aside className="assurance-side-panel"><h3>Client visibility</h3><p><strong>Status, owner and resolution</strong> in one view.</p><InfoNote title="Governance link" kind="green">Tie the support fix to its approved access request. Agree ticket IDs with CUST.</InfoNote><InfoNote title="Candidate measures">Request age, provisioning failures and resolution time require a real baseline.</InfoNote></aside>
        </div>}

        {view === 'delivery' && <div className="assurance-layout">
          <section className="assurance-main-panel">
            <div className="assurance-section-head"><span>PROJECT DELIVERY · SAMPLE WORKSTREAM</span><h2>From discovery to control handover</h2><p>Each stage needs an <strong>owner</strong>, <strong>acceptance check</strong> and <strong>evidence</strong>.</p></div>
            <div className="assurance-delivery-progress"><strong>{state.deliveryStage} / {deliveryStages.length}</strong><span>sample stages reviewed</span><div><span style={{ width: `${state.deliveryStage / deliveryStages.length * 100}%` }} /></div></div>
            <div className="assurance-delivery-list">{deliveryStages.map((stage, index) => <div key={stage} className={index < state.deliveryStage ? 'complete' : index === state.deliveryStage ? 'current' : ''}><span>{index < state.deliveryStage ? <Check size={16} /> : String(index + 1).padStart(2, '0')}</span><div><strong>{stage}</strong><p>{[
              'Confirm systems, identity boundaries, owners and logs.',
              'Agree SoD rules, roles, approvals and mitigation.',
              'Configure approved SAP controls and integrations.',
              'Test, evidence, hand over and measure outcomes.'
            ][index]}</p></div></div>)}</div>
            <label className="assurance-comment-label" htmlFor="delivery-note"><strong>Stage acceptance comment · sample delivery lead</strong><span>What evidence or decision lets this workstream move forward?</span></label>
            <textarea id="delivery-note" rows={3} value={state.deliveryNote} disabled={state.deliveryStage === deliveryStages.length} onChange={(event) => setState((current) => ({ ...current, deliveryNote: event.target.value }))} />
            {state.deliveryStage < deliveryStages.length ? <button type="button" className="assurance-primary" onClick={takeDeliveryAction}>Record sample stage review <ArrowRight size={17} /></button> : <div className="assurance-result"><Check size={20} /><div><strong>Sample stages reviewed</strong><p>Each stage has an entry in the demonstration trail. Production acceptance requires CUST sign-off and verified evidence.</p></div></div>}
          </section>
          <aside className="assurance-side-panel"><h3>Delivery proof</h3><p><strong>Agree → configure → test → hand over.</strong> CUST owners approve the real scope.</p><InfoNote title="SAP standard first">Assess SAP IAG standard controls. Confirm ownership before any portal integration.</InfoNote><InfoNote title="Measure handover" kind="green">Agree targets for risk age, review completion and evidence retrieval.</InfoNote></aside>
        </div>}

        {view === 'landscape' && <div className="assurance-layout">
          <section className="assurance-main-panel"><div className="assurance-section-head"><span>CONTROL BOUNDARIES · PROPOSED</span><h2>Know which layer owns the control</h2><p>Validate <strong>sources</strong>, <strong>systems</strong>, <strong>connectors</strong> and <strong>owners</strong> with CUST.</p></div>
            <div className="assurance-landscape">
              <div><Fingerprint size={24} /><small>01 · ENTERPRISE IDENTITY</small><strong>Source and IdP</strong><p>CUST owns identity policy and lifecycle data.</p></div>
              <div><Workflow size={24} /><small>02 · SAP CLOUD IDENTITY</small><strong>IAS / IPS, if selected</strong><p>Federate sign-in and provision supported SAP apps.</p></div>
              <div><ShieldCheck size={24} /><small>03 · SAP ACCESS GOVERNANCE</small><strong>SAP IAG</strong><p>Assess risk, approve access and review exceptions.</p></div>
              <div><LockKeyhole size={24} /><small>04 · TARGET SYSTEMS</small><strong>SAP and BTP authorisation</strong><p>Backend permission enforces the access decision.</p></div>
              <div><LayoutDashboard size={24} /><small>05 · CLIENT EXPERIENCE</small><strong>ERPLeague portal</strong><p>Surface agreed decisions, actions and evidence.</p></div>
            </div>
          </section>
          <aside className="assurance-side-panel"><h3>Validate with CUST</h3><ol className="assurance-discovery-list"><li>Which source and IdP own identity lifecycle?</li><li>Which SAP apps and BTP subaccounts are in scope?</li><li>Where do IAS, IPS and enterprise identity connect?</li><li>Who owns role catalogues and assignments?</li><li>What logs, retention and residency rules apply?</li></ol><InfoNote title="Implementation">Confirm account boundaries, connectors and owners before agreeing a portal data feed.</InfoNote></aside>
        </div>}

        {!tile && view !== 'btp' && <div className="assurance-bottom-note"><ShieldCheck size={20} /><p><strong>Proposed outcome:</strong> named decisions, visible exceptions and traceable evidence. Baseline and targets require discovery.</p></div>}
          </div>
        </div>
      </div>
      {selectedEvent && <EventLogDialog key={selectedEvent.id} event={selectedEvent} notes={state.eventNotes?.[selectedEvent.id] ?? []} sessionEvents={pamSessionEvents} noteActor={view === 'pam' ? persona : 'Demo viewer'} onSave={(text) => saveEventNote(selectedEvent.id, text)} onClose={closeEventLog} />}
    </div>
  );
}

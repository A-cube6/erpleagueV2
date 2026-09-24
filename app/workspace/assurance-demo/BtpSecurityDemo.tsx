'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight, Check, CircleAlert, Download, FileText, Fingerprint, Info,
  KeyRound, LayoutDashboard, LockKeyhole, Search, ShieldCheck, Workflow
} from 'lucide-react';
import {
  BTP_STORAGE_KEY, assignBtpCollection, btpReviewReady, closeBtpReview, initialBtpState,
  isBtpState, runIpsSync, sampleRoleCatalog, sampleSubaccounts, scenarioNames,
  testBtpAccess, type BtpLayer, type BtpPersona, type BtpScope, type BtpScenario,
  type BtpState
} from '@/lib/btp-security-demo';
import './btp-security.css';

type Step = 'ips' | 'ias' | 'roles' | 'app' | 'coe';
type CatalogEntry = 'viewer' | 'approver' | 'admin';

const steps: { id: Step; label: string; owner: BtpPersona; icon: typeof Workflow }[] = [
  { id: 'ips', label: 'IPS provisioning', owner: 'Identity Ops', icon: Workflow },
  { id: 'ias', label: 'IAS sign-in', owner: 'Employee', icon: Fingerprint },
  { id: 'roles', label: 'Role catalogue', owner: 'BTP Admin', icon: KeyRound },
  { id: 'app', label: 'User visibility', owner: 'Employee', icon: LayoutDashboard },
  { id: 'coe', label: 'CoE evidence', owner: 'CoE Reviewer', icon: ShieldCheck }
];

function atLabel() {
  return new Date().toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function csvCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function Marker({ title, children, tone = 'blue' }: { title: string; children: React.ReactNode; tone?: 'blue' | 'yellow' | 'green' }) {
  return <div className={`btp-marker btp-marker-${tone}`}><Info size={17} aria-hidden="true" /><div><strong>{title}</strong><p>{children}</p></div></div>;
}

export function BtpSecurityDemo({ persona, onPersonaChange }: { persona: BtpPersona; onPersonaChange: (persona: BtpPersona) => void }) {
  const [loaded, setLoaded] = useState(false);
  const [demo, setDemo] = useState<BtpState>(() => initialBtpState());
  const [step, setStep] = useState<Step>('ips');
  const [selectedRole, setSelectedRole] = useState<CatalogEntry>('approver');
  const [mappingNote, setMappingNote] = useState('Approved sample maintenance approver access for the selected subaccount.');
  const [reviewDraft, setReviewDraft] = useState('Verified group sync, IAS sign-in, least-privilege collection and application access in this sample.');
  const [layer, setLayer] = useState<BtpLayer | 'All'>('All');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(BTP_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isBtpState(parsed)) {
          setDemo(parsed);
          if (parsed.adminGrant) setSelectedRole('admin');
          if (parsed.reviewNote) setReviewDraft(parsed.reviewNote);
        }
      }
    } catch { /* Start a new synthetic case if a browser draft is invalid. */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) sessionStorage.setItem(BTP_STORAGE_KEY, JSON.stringify(demo));
  }, [loaded, demo]);

  if (!loaded) return <div className="workspace-loading" role="status">Opening BTP security case…</div>;

  const scope = sampleSubaccounts[demo.scope];
  const catalog = sampleRoleCatalog(demo.scope);
  const role = catalog.find((entry) => entry.id === selectedRole) ?? catalog[1];
  const stale = !!demo.lastTest && demo.lastTest.revision !== demo.revision;
  const clean = btpReviewReady(demo);
  const filteredEvents = demo.events.filter((event) =>
    (layer === 'All' || event.layer === layer) &&
    `${event.id} ${event.actor} ${event.layer} ${event.action} ${event.outcome} ${event.detail}`.toLowerCase().includes(search.toLowerCase().trim())
  );
  const statuses: Record<Step, string> = {
    ips: demo.ips === 'ok' ? 'Group ready' : demo.ips === 'failed' ? 'Sync failed' : 'Not run',
    ias: demo.signedIn ? 'Authenticated' : 'Not tested',
    roles: demo.adminGrant ? 'Broad admin grant' : demo.mapping === 'approver' ? 'Business role mapped' : 'Mapping missing',
    app: !demo.lastTest ? 'Not tested' : stale ? 'Retest due' : demo.lastTest.broad ? 'Excess access' : demo.lastTest.visible ? 'Visible' : 'Tile hidden',
    coe: demo.review === 'closed' ? 'Reviewed' : 'Review open'
  };
  const next: { step: Step; owner: BtpPersona; action: string } | null = demo.ips !== 'ok' ?
    { step: 'ips', owner: 'Identity Ops', action: demo.ips === 'failed' ? 'Correct the sample IPS mapping and retry' : 'Run the IPS group sync' } :
    !demo.lastTest ? { step: 'ias', owner: 'Employee', action: 'Test sign-in and application access' } :
    demo.mapping === 'none' || demo.adminGrant ? { step: 'roles', owner: 'BTP Admin', action: demo.adminGrant ? 'Remove the direct admin grant' : 'Map the approved business role' } :
    stale || !demo.lastTest.visible ? { step: 'app', owner: 'Employee', action: 'Retest the user view after the change' } :
    demo.review === 'open' ? { step: 'coe', owner: 'CoE Reviewer', action: 'Review and close the sample exception' } : null;

  const updateCase = (nextScope: BtpScope, nextScenario: BtpScenario) => {
    setDemo(initialBtpState(nextScope, nextScenario));
    setSelectedRole(nextScenario === 'broad-admin' ? 'admin' : 'approver');
    setStep('ips');
    setLayer('All');
    setSearch('');
    setNotice('A new synthetic case has started for this scope and scenario.');
  };
  const takeAction = (action: () => BtpState, nextStep?: Step) => {
    try {
      setDemo(action());
      if (nextStep) setStep(nextStep);
      setNotice('Sample control trace updated.');
    } catch (error) { setNotice((error as Error).message); }
  };
  const downloadTrace = () => {
    const rows = [
      ['Event ID', 'Recorded at', 'Global account', 'Directory', 'Subaccount', 'Region', 'Actor', 'Layer', 'Action', 'Outcome', 'Detail'],
      ...filteredEvents.map((event) => [event.id, event.at, 'CUST illustrative global account', scope.directory, scope.name, scope.region, event.actor, event.layer, event.action, event.outcome, event.detail])
    ];
    const csv = '\uFEFF' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `erpleague-btp-security-${demo.scope}-${demo.scenario}-sample-trace.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <div className="btp-demo">
    <header className="btp-intro"><div><span>BTP SECURITY & CoE · DEMO-BTP-042</span><h2>Signed in. Where did the app go?</h2><p>Follow one sample employee from <strong>CIS identity</strong> to <strong>BTP access</strong>, then resolve and evidence the gap.</p></div><span className="btp-intro-badge">SYNTHETIC CASE</span></header>

    <div className="btp-scope-head"><div><strong>1 · Choose an account boundary</strong><span>Role collections and assignments belong to the selected scope.</span></div><label>Simulate a gap<select value={demo.scenario} onChange={(event) => updateCase(demo.scope, event.target.value as BtpScenario)}>{(Object.keys(scenarioNames) as BtpScenario[]).map((id) => <option key={id} value={id}>{scenarioNames[id]}</option>)}</select></label></div>
    <div className="btp-scope-grid" role="group" aria-label="Sample BTP subaccounts">{(Object.keys(sampleSubaccounts) as BtpScope[]).map((id) => { const item = sampleSubaccounts[id]; return <button type="button" key={id} aria-pressed={demo.scope === id} className={demo.scope === id ? 'selected' : ''} onClick={() => updateCase(id, demo.scenario)}><span>{item.stage}</span><strong>{item.name}</strong><small>{item.region}</small></button>; })}</div>
    <div className="btp-scope-path"><span><strong>Global account</strong> CUST illustrative</span><ArrowRight size={15} aria-hidden="true" /><span><strong>Directory</strong> {scope.directory}</span><ArrowRight size={15} aria-hidden="true" /><span><strong>Subaccount</strong> {scope.name}</span><span className="btp-region"><strong>Region</strong> {scope.region}</span></div>
    <Marker title="Scope and residency">Names and regions are illustrative. Actual subaccounts, service availability, logs and residency requirements need CUST validation.</Marker>

    <div className="btp-next" role="status"><div><strong>{next ? `Next: ${next.action}` : 'Case complete · evidence ready'}</strong><span>{next ? `${next.owner} role · select the highlighted step` : 'See the CoE report and export the synthetic trace.'}</span></div>{next && <button type="button" onClick={() => { onPersonaChange(next.owner); setStep(next.step); }}>{next.owner} view <ArrowRight size={16} /></button>}</div>

    <nav className="btp-steps" aria-label="BTP security walkthrough">{steps.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-current={step === id ? 'step' : undefined} className={step === id ? 'active' : ''} onClick={() => { setStep(id); setNotice(''); }}><Icon size={19} aria-hidden="true" /><strong>{label}</strong><small>{statuses[id]}</small></button>)}</nav>
    {notice && <div className="assurance-notice" role="status">{notice}</div>}

    <div className="btp-workspace">
      <section className="btp-step-panel">
        {step === 'ips' && <><div className="btp-step-title"><span>02 · IDENTITY PROVISIONING</span><h3>Did the group reach CIS?</h3><p><strong>IPS</strong> simulates the source-to-directory group update.</p></div><div className="btp-map"><div><small>SAMPLE SOURCE</small><strong>Maya Chen · asset maintenance</strong><span>Approved group: DEMO_ASSET_APPROVERS</span></div><ArrowRight size={18} /><div><small>CIS IDENTITY DIRECTORY</small><strong>{demo.ips === 'ok' ? 'Group membership present' : demo.ips === 'failed' ? 'Update failed' : 'Awaiting sync'}</strong><span>Job outcome: {statuses.ips}</span></div></div><Marker title="What IPS proves" tone={demo.ips === 'failed' ? 'yellow' : 'blue'}>A successful job provides the sample group; it does not itself assign a BTP role collection. Review source, target, transformations and job logs in discovery.</Marker>{persona === 'Identity Ops' ? demo.ips !== 'ok' ? <button className="assurance-primary" type="button" onClick={() => takeAction(() => runIpsSync(demo, atLabel()), demo.ips === 'failed' ? 'ips' : 'ias')}>{demo.ips === 'failed' ? 'Retry corrected IPS sync' : 'Run sample IPS sync'} <ArrowRight size={16} /></button> : <div className="btp-step-done"><Check size={18} /> Sample group sync recorded</div> : <div className="btp-role-hint">Identity Ops runs this step. <button type="button" onClick={() => onPersonaChange('Identity Ops')}>Switch role</button></div>}</>}

        {step === 'ias' && <><div className="btp-step-title"><span>03 · AUTHENTICATION</span><h3>IAS sign-in can succeed</h3><p>Authentication and application authorisation are separate checks.</p></div><div className="btp-identity-facts"><div><small>Corporate identity</small><strong>Sample employee active</strong></div><div><small>CIS / IAS trust</small><strong>Simulated successful sign-in</strong></div><div><small>MFA policy</small><strong>Source and rules to confirm</strong></div></div><Marker title="Authentication path">This is a synthetic IAS sign-in through a proposed corporate identity provider. Any MFA enforcement point depends on CUST’s actual trust and policy configuration.</Marker>{persona === 'Employee' ? <button className="assurance-primary" type="button" onClick={() => takeAction(() => testBtpAccess(demo, atLabel()), 'app')}>{demo.signedIn ? 'Retest sign-in and access' : 'Test sign-in and access'} <ArrowRight size={16} /></button> : <div className="btp-role-hint">Employee runs this check. <button type="button" onClick={() => onPersonaChange('Employee')}>Switch role</button></div>}</>}

        {step === 'roles' && <><div className="btp-step-title"><span>04 · SUBACCOUNT AUTHORISATION</span><h3>Which role collection applies?</h3><p>Browse the <strong>sample roles in {scope.name}</strong>.</p></div><div className="btp-catalogue" role="group" aria-label="Role catalogue">{catalog.map((entry) => <button type="button" key={entry.id} aria-pressed={selectedRole === entry.id} className={selectedRole === entry.id ? 'selected' : ''} onClick={() => setSelectedRole(entry.id)}><strong>{entry.name}</strong><span>{entry.tier}</span></button>)}</div><div className="btp-role-detail"><div><small>SELECTED COLLECTION</small><strong>{role.name}</strong><p>{role.purpose}</p></div><div><small>Included sample roles</small><strong>{role.roles.join(' · ')}</strong></div><div><small>Assignment in this subaccount</small><strong>{selectedRole === 'approver' ? demo.mapping === 'approver' ? 'DEMO_ASSET_APPROVERS group mapped' : 'Group mapping missing' : selectedRole === 'admin' ? demo.adminGrant ? 'Direct sample user grant · excessive' : 'No sample user assigned' : 'No sample user assigned'}</strong></div></div><Marker title="Business and platform access differ" tone="yellow">Subaccount Administrator is a platform grant. The maintenance app’s approve action comes from its own sample business collection.</Marker>
          {persona === 'BTP Admin' ? demo.mapping === 'none' || demo.adminGrant ? selectedRole === (demo.adminGrant ? 'admin' : 'approver') ? <><label className="assurance-comment-label" htmlFor="btp-mapping-note"><strong>Assignment reason · sample admin comment</strong><span>State the approved scope before changing the collection.</span></label><textarea id="btp-mapping-note" rows={2} value={mappingNote} onChange={(event) => setMappingNote(event.target.value)} /><button className="assurance-primary" type="button" onClick={() => takeAction(() => assignBtpCollection(demo, mappingNote, atLabel()), 'app')}>{demo.adminGrant ? 'Remove broad admin grant' : 'Map approved group'} <ArrowRight size={16} /></button></> : <p className="btp-role-hint">Select <strong>{demo.adminGrant ? 'Subaccount Administrator' : catalog[1].name}</strong> to record this change.</p> : <div className="btp-step-done"><Check size={18} /> Least-privilege business collection mapped</div> : <div className="btp-role-hint">BTP Admin records an assignment. <button type="button" onClick={() => onPersonaChange('BTP Admin')}>Switch role</button></div>}
        </>}

        {step === 'app' && <><div className="btp-step-title"><span>05 · USER VIEW</span><h3>What can the employee actually do?</h3><p>Compare <strong>tile visibility</strong> with the app’s sample backend permission.</p></div><div className={`btp-app-preview ${demo.lastTest?.visible && !stale ? 'visible' : 'hidden'}`}><div><LayoutDashboard size={25} /><strong>Maintenance approvals</strong><span>{!demo.lastTest ? 'Run the sign-in test' : stale ? 'Retest after configuration change' : demo.lastTest.visible ? 'Tile visible' : 'Tile hidden'}</span></div><div><small>Sample app action</small><strong>{!demo.lastTest || stale ? 'Awaiting current test' : demo.lastTest.allowed ? 'Approve permitted' : 'Not available'}</strong></div></div><Marker title="Visibility is not the whole authorisation" tone={demo.lastTest?.visible && !stale ? 'green' : 'yellow'}>A role collection can govern access; a launchpad or site, if in scope, may have separate content visibility. Both boundaries require a real fitment check.</Marker>{persona === 'Employee' ? <button className="assurance-primary" type="button" onClick={() => takeAction(() => testBtpAccess(demo, atLabel()), 'coe')}>{demo.lastTest ? 'Retest my app access' : 'Test my app access'} <ArrowRight size={16} /></button> : <div className="btp-role-hint">Employee tests the outcome. <button type="button" onClick={() => onPersonaChange('Employee')}>Switch role</button></div>}</>}

        {step === 'coe' && <><div className="btp-step-title"><span>06 · CENTRE OF EXCELLENCE</span><h3>Close the loop with evidence</h3><p>Confirm the scope, fix, retest and independent review.</p></div><div className="btp-coe-checks"><div className={demo.ips === 'ok' ? 'ok' : 'open'}><span>{demo.ips === 'ok' ? <Check size={15} /> : <CircleAlert size={15} />}</span>IPS group sync</div><div className={demo.signedIn ? 'ok' : 'open'}><span>{demo.signedIn ? <Check size={15} /> : <CircleAlert size={15} />}</span>IAS sign-in test</div><div className={demo.mapping === 'approver' && !demo.adminGrant ? 'ok' : 'open'}><span>{demo.mapping === 'approver' && !demo.adminGrant ? <Check size={15} /> : <CircleAlert size={15} />}</span>Least-privilege mapping</div><div className={clean ? 'ok' : 'open'}><span>{clean ? <Check size={15} /> : <CircleAlert size={15} />}</span>Current access retest</div></div><Marker title="CoE responsibility" tone={clean ? 'green' : 'yellow'}>The reviewer checks the selected subaccount, region, identity logs, role mapping and user outcome before recording a sample conclusion.</Marker>{persona === 'CoE Reviewer' ? demo.review === 'closed' ? <div className="btp-step-done"><Check size={18} /> Independently reviewed: {demo.reviewNote}</div> : <><label className="assurance-comment-label" htmlFor="btp-review-note"><strong>Independent CoE comment</strong><span>Record why the exception can be closed.</span></label><textarea id="btp-review-note" rows={3} value={reviewDraft} onChange={(event) => setReviewDraft(event.target.value)} /><button className="assurance-primary" type="button" disabled={!clean} onClick={() => takeAction(() => closeBtpReview(demo, reviewDraft, atLabel()))}>Record review <Check size={16} /></button>{!clean && <p className="btp-review-gate">Fix the gap and complete a current employee retest first.</p>}</> : <div className="btp-role-hint">CoE Reviewer closes the case. <button type="button" onClick={() => onPersonaChange('CoE Reviewer')}>Switch role</button></div>}</>}
      </section>

      <aside className="btp-user-panel"><span>USER IMPACT · MAYA CHEN</span><h3>{demo.review === 'closed' ? 'Access verified and reviewed' : demo.lastTest ? stale ? 'Change made · retest needed' : demo.lastTest.broad ? 'App works · admin risk open' : demo.lastTest.visible ? 'App visible · review due' : 'Signed in · app missing' : 'Run the sample access test'}</h3><p>{demo.lastTest?.reason ?? 'A successful IAS sign-in does not prove that the app is available.'}</p><div className="btp-control-check"><div><Fingerprint size={17} /><span>IAS sign-in</span><strong>{demo.signedIn ? 'Success' : 'Untested'}</strong></div><div><Workflow size={17} /><span>IPS group</span><strong>{statuses.ips}</strong></div><div><KeyRound size={17} /><span>Group → role collection</span><strong>{demo.mapping === 'approver' ? 'Mapped' : 'Missing'}</strong></div><div><LockKeyhole size={17} /><span>Direct admin grant</span><strong className={demo.adminGrant ? 'btp-danger' : ''}>{demo.adminGrant ? 'Excessive' : 'None'}</strong></div><div><LayoutDashboard size={17} /><span>App tile</span><strong>{statuses.app}</strong></div></div><div className="btp-user-note"><Info size={17} /><span><strong>Sample controls only.</strong> No production IAS, IPS, BTP or CUST records are used.</span></div></aside>
    </div>

    <section className="btp-print-report" aria-label="BTP CoE sample evidence pack"><div className="btp-report-heading"><div><span>CoE REPORT · DEMO-BTP-042</span><h3>Trace every identity and access decision</h3><p>{scope.name} · {scope.region} · {scenarioNames[demo.scenario]}</p></div><span className={demo.review === 'closed' ? 'btp-status-complete' : 'btp-status-open'}>{demo.review === 'closed' ? 'REVIEW COMPLETE' : 'SAMPLE EXCEPTION OPEN'}</span></div><div className="btp-report-facts"><div><small>Identity</small><strong>Sample employee · Maya Chen</strong></div><div><small>Approved group</small><strong>DEMO_ASSET_APPROVERS</strong></div><div><small>Role collection</small><strong>{demo.mapping === 'approver' ? catalog[1].name : 'Not mapped'}</strong></div><div><small>CoE reviewer</small><strong>{demo.review === 'closed' ? 'Independent sample reviewer' : 'Pending'}</strong></div></div>{demo.review === 'closed' && <p className="btp-review-record"><strong>Review comment:</strong> {demo.reviewNote}</p>}
      <div className="btp-trace-tools"><div><label><Search size={16} aria-hidden="true" /><span className="sr-only">Search BTP trace</span><input type="search" placeholder="Find an actor, event or outcome" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label><span className="sr-only">Filter trace by layer</span><select value={layer} onChange={(event) => setLayer(event.target.value as BtpLayer | 'All')}><option value="All">All layers</option>{(['Scope', 'IPS', 'IAS', 'BTP roles', 'App', 'CoE'] as const).map((entry) => <option key={entry} value={entry}>{entry}</option>)}</select></label></div><div><button type="button" className="assurance-outline" onClick={downloadTrace}><Download size={16} /> Download trace CSV</button><button type="button" className="assurance-primary" onClick={() => window.print()}><FileText size={16} /> Print / save PDF</button></div></div>
      <div className="btp-trace-table"><table><thead><tr><th>ID / time</th><th>Control</th><th>Action and evidence</th><th>Actor</th><th>Result</th></tr></thead><tbody>{filteredEvents.map((event) => <tr key={event.id}><td><strong>{event.id}</strong><small>{event.at}</small></td><td>{event.layer}</td><td><strong>{event.action}</strong><small>{event.detail}</small></td><td>{event.actor}</td><td><span className={['Failed', 'Not visible', 'Excess access'].includes(event.outcome) ? 'btp-badge-warn' : 'btp-badge-ok'}>{event.outcome}</span></td></tr>)}</tbody></table>{filteredEvents.length === 0 && <p className="btp-trace-empty">No sample events match these filters.</p>}</div><p className="btp-report-foot">Illustrative audit artefact. Source IDs, log provenance, retention and reviewer authority require CUST discovery.</p>
    </section>
  </div>;
}

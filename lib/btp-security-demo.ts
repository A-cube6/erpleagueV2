/** Browser-only, synthetic BTP security case. No SAP or CUST system is connected. */
export const BTP_STORAGE_KEY = 'erpleague:btp-security-demo:v1';

export const sampleSubaccounts = {
  dev: { name: 'Asset Services · DEV', directory: 'Asset Operations', region: 'Australia · illustrative', stage: 'Development', suffix: 'DEV' },
  prod: { name: 'Asset Services · PROD', directory: 'Asset Operations', region: 'Australia · illustrative', stage: 'Production', suffix: 'PROD' },
  pilot: { name: 'Mobility Pilot · TEST', directory: 'Innovation', region: 'Region to confirm', stage: 'Pilot', suffix: 'TEST' }
} as const;

export type BtpScope = keyof typeof sampleSubaccounts;
export type BtpScenario = 'missing-mapping' | 'failed-provisioning' | 'broad-admin';
export type BtpPersona = 'Employee' | 'Identity Ops' | 'BTP Admin' | 'CoE Reviewer';
export type BtpLayer = 'Scope' | 'IPS' | 'IAS' | 'BTP roles' | 'App' | 'CoE';

export type BtpEvent = {
  id: string;
  at: string;
  actor: string;
  layer: BtpLayer;
  action: string;
  outcome: string;
  detail: string;
};

export type BtpAccessTest = {
  revision: number;
  visible: boolean;
  allowed: boolean;
  broad: boolean;
  reason: string;
};

export type BtpState = {
  scope: BtpScope;
  scenario: BtpScenario;
  ips: 'idle' | 'failed' | 'ok';
  signedIn: boolean;
  mapping: 'none' | 'approver';
  adminGrant: boolean;
  revision: number;
  lastTest: BtpAccessTest | null;
  review: 'open' | 'closed';
  reviewNote: string;
  events: BtpEvent[];
};

export const scenarioNames: Record<BtpScenario, string> = {
  'missing-mapping': 'Signed in, app missing',
  'failed-provisioning': 'IPS group sync fails',
  'broad-admin': 'Excess admin privilege'
};

export function sampleRoleCatalog(scope: BtpScope) {
  const suffix = sampleSubaccounts[scope].suffix;
  return [
    { id: 'viewer', name: `Asset_Approval_Viewer_${suffix}`, roles: ['SampleApp.Display'], purpose: 'Read maintenance approvals', tier: 'Business' },
    { id: 'approver', name: `Asset_Approval_Approver_${suffix}`, roles: ['SampleApp.Display', 'SampleApp.Approve'], purpose: 'Review and approve maintenance work', tier: 'Business' },
    { id: 'admin', name: 'Subaccount Administrator', roles: ['Platform administration'], purpose: 'Manage subaccount configuration', tier: 'Platform' }
  ] as const;
}

export function initialBtpState(scope: BtpScope = 'dev', scenario: BtpScenario = 'missing-mapping'): BtpState {
  return {
    scope, scenario, ips: 'idle', signedIn: false,
    mapping: scenario === 'broad-admin' ? 'approver' : 'none',
    adminGrant: scenario === 'broad-admin', revision: 0,
    lastTest: null, review: 'open', reviewNote: '',
    events: [{
      id: 'BTP-E01', at: 'Scenario setup', actor: 'Demo setup', layer: 'Scope',
      action: 'Sample case opened', outcome: 'Open',
      detail: `${sampleSubaccounts[scope].name} · ${sampleSubaccounts[scope].region} · ${scenarioNames[scenario]}. No CUST data.`
    }]
  };
}

export function isBtpState(value: unknown): value is BtpState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<BtpState>;
  return !!state.scope && state.scope in sampleSubaccounts &&
    ['missing-mapping', 'failed-provisioning', 'broad-admin'].includes(state.scenario || '') &&
    ['idle', 'failed', 'ok'].includes(state.ips || '') &&
    ['none', 'approver'].includes(state.mapping || '') && typeof state.adminGrant === 'boolean' &&
    ['open', 'closed'].includes(state.review || '') &&
    typeof state.revision === 'number' && typeof state.signedIn === 'boolean' &&
    typeof state.reviewNote === 'string' && Array.isArray(state.events) &&
    state.events.every((event) => event && typeof event.id === 'string' && typeof event.at === 'string' &&
      typeof event.actor === 'string' && typeof event.layer === 'string' && typeof event.action === 'string' &&
      typeof event.outcome === 'string' && typeof event.detail === 'string') &&
    (state.lastTest === null || (!!state.lastTest && typeof state.lastTest.revision === 'number' &&
      typeof state.lastTest.visible === 'boolean' && typeof state.lastTest.allowed === 'boolean' &&
      typeof state.lastTest.broad === 'boolean' && typeof state.lastTest.reason === 'string'));
}

function addEvent(state: BtpState, at: string, actor: string, layer: BtpLayer, action: string, outcome: string, detail: string): BtpState {
  const id = `BTP-E${String(state.events.length + 1).padStart(2, '0')}`;
  return { ...state, events: [...state.events, { id, at, actor, layer, action, outcome, detail }] };
}

export function runIpsSync(state: BtpState, at: string): BtpState {
  if (state.ips === 'ok') return state;
  const failure = state.scenario === 'failed-provisioning' && state.ips === 'idle';
  const next = { ...state, ips: failure ? 'failed' : 'ok', revision: state.revision + 1, review: 'open' } as BtpState;
  return addEvent(next, at, 'Sample identity operator', 'IPS', failure ? 'Group sync failed' : state.ips === 'failed' ? 'Group sync retried' : 'Group synced', failure ? 'Failed' : 'Completed',
    failure ? 'Sample source group attribute missing; no group update reached the CIS Identity Directory.' : 'Sample group DEMO_ASSET_APPROVERS present in the CIS Identity Directory.');
}

export function assignBtpCollection(state: BtpState, note: string, at: string): BtpState {
  if (state.ips !== 'ok') throw new Error('Complete the IPS group sync before testing the assignment.');
  if (state.mapping === 'approver' && !state.adminGrant) return state;
  if (!note.trim()) throw new Error('Add an assignment reason for the sample evidence trail.');
  const next = { ...state, mapping: 'approver', adminGrant: false, revision: state.revision + 1, review: 'open' } as BtpState;
  return addEvent(next, at, 'Sample BTP administrator', 'BTP roles', state.adminGrant ? 'Broad admin grant removed' : 'Group mapped to role collection', 'Recorded',
    state.adminGrant ? `Direct Subaccount Administrator grant removed; approved business role retained in ${sampleSubaccounts[state.scope].name}. Reason: ${note.trim()}` :
      `${sampleRoleCatalog(state.scope)[1].name} mapped to DEMO_ASSET_APPROVERS in ${sampleSubaccounts[state.scope].name}. Reason: ${note.trim()}`);
}

export function testBtpAccess(state: BtpState, at: string): BtpState {
  const groupReady = state.ips === 'ok';
  const visible = groupReady && state.mapping === 'approver';
  const broad = state.adminGrant;
  const reason = !groupReady ? 'IAS sign-in succeeded; IPS group is not present.' :
    state.mapping === 'none' ? 'IAS sign-in succeeded; group has no role collection mapping in this subaccount.' :
    broad ? 'App visible through its business role, but a separate direct admin grant is excessive.' :
    'App visible and sample approval permitted by the mapped business role.';
  const next: BtpState = {
    ...state, signedIn: true, review: 'open',
    lastTest: { revision: state.revision, visible, allowed: visible, broad, reason }
  };
  const signed = addEvent(next, at, 'Sample employee', 'IAS', 'Sign-in tested', 'Succeeded', 'Corporate identity authentication simulated through IAS; MFA policy path requires discovery.');
  return addEvent(signed, at, 'Sample employee', 'App', 'Application access tested', visible ? broad ? 'Excess access' : 'Allowed' : 'Not visible', reason);
}

export function btpReviewReady(state: BtpState) {
  return state.ips === 'ok' && state.mapping === 'approver' && !state.adminGrant && !!state.lastTest &&
    state.lastTest.revision === state.revision && state.lastTest.visible && state.lastTest.allowed && !state.lastTest.broad;
}

export function closeBtpReview(state: BtpState, note: string, at: string): BtpState {
  if (!btpReviewReady(state)) throw new Error('Resolve the gap and retest the user access before closing the review.');
  if (!note.trim()) throw new Error('Add an independent CoE review comment.');
  return addEvent({ ...state, review: 'closed', reviewNote: note.trim() }, at, 'Independent sample CoE reviewer', 'CoE', 'Control evidence reviewed', 'Closed', note.trim());
}

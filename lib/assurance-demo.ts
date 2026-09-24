/** Synthetic control case for the CUST pitch. No SAP or CUST system is connected. */
export const ASSURANCE_STORAGE_KEY = 'erpleague:assurance-demo:v1';

export type SodDecision = 'open' | 'revised' | 'mitigated' | 'held';
export type PamPhase = 'requested' | 'approved' | 'active' | 'ended' | 'reviewed';
export type ReviewOutcome = 'confirmed' | 'followup' | null;
export type SupportStage = 'new' | 'triaged' | 'resolved';

export type AuditEvent = {
  id: string;
  at: string;
  actor: string;
  area: string;
  action: string;
  detail: string;
  transaction?: string;
  result?: 'allowed' | 'blocked';
  flagged?: boolean;
};

export type EventNote = { actor: string; at: string; text: string };
export const PAM_SAMPLE_ID = 'PAM_CUST_DEMO_01';
export const PAM_SAMPLE_TARGET = 'Illustrative SAP S/4 system';
export const PAM_ALLOWED_TRANSACTION = 'IW32 · Change Maintenance Order';
export const PAM_BLOCKED_TRANSACTION = 'SU01 · User Maintenance';

export type AssuranceState = {
  decision: SodDecision;
  decisionNote: string;
  mitigationOwner: string;
  mitigationDays: number;
  pamPhase: PamPhase;
  pamReason: string;
  durationHours: number;
  approverNote: string;
  pamSecurityNote?: string;
  pamSecurityCheckedAt?: number;
  reviewerNote: string;
  reviewOutcome: ReviewOutcome;
  pamApprovedAt?: number;
  pamExpiresAt?: number;
  pamStartedAt?: number;
  pamClosedAt?: number;
  pamClosureReason?: 'completed' | 'expired';
  eventNotes?: Record<string, EventNote[]>;
  supportStage: SupportStage;
  supportNote: string;
  deliveryStage: number;
  deliveryNote: string;
  events: AuditEvent[];
};

export const initialAssuranceState: AssuranceState = {
  decision: 'open',
  decisionNote: '',
  mitigationOwner: 'Sample finance control owner',
  mitigationDays: 7,
  pamPhase: 'requested',
  pamReason: 'Correct a maintenance order following an urgent asset repair.',
  durationHours: 2,
  approverNote: 'Approve only the named exception and access window; require independent activity review.',
  pamSecurityNote: 'Checked the approved window and transaction log; any denied, out-of-scope attempt is highlighted for the independent reviewer.',
  reviewerNote: 'Compared the sample activity with the approved purpose and recorded the review outcome.',
  reviewOutcome: null,
  eventNotes: {},
  supportStage: 'new',
  supportNote: 'Confirm the approved request, identity provisioning result, launchpad visibility and backend authorisation before resolving.',
  deliveryStage: 0,
  deliveryNote: 'Record the control owner, acceptance criteria and evidence required for this sample stage.',
  events: [
    { id: 'DEMO-E01', at: 'Scenario setup', actor: 'Sample requestor', area: 'Access request', action: 'Role change requested', detail: 'Supplier Master Maintenance requested; Invoice Release already held.' },
    { id: 'DEMO-E02', at: 'Scenario setup', actor: 'Sample IAG analysis', area: 'SoD analysis', action: 'Illustrative conflict identified', detail: 'Supplier maintenance + invoice release is flagged by the sample risk rule.' }
  ]
};

const pamPhases: PamPhase[] = ['requested', 'approved', 'active', 'ended', 'reviewed'];

export function isAssuranceState(value: unknown): value is AssuranceState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<AssuranceState>;
  return ['open', 'revised', 'mitigated', 'held'].includes(state.decision || '') &&
    pamPhases.includes(state.pamPhase as PamPhase) &&
    Array.isArray(state.events) &&
    typeof state.decisionNote === 'string' &&
    typeof state.mitigationOwner === 'string' &&
    typeof state.mitigationDays === 'number' &&
    typeof state.pamReason === 'string' &&
    typeof state.approverNote === 'string' &&
    typeof state.reviewerNote === 'string' &&
    typeof state.durationHours === 'number' &&
    ['new', 'triaged', 'resolved'].includes(state.supportStage || '') &&
    typeof state.supportNote === 'string' &&
    typeof state.deliveryStage === 'number' &&
    typeof state.deliveryNote === 'string';
}

function addEvent(state: AssuranceState, at: string, actor: string, area: string, action: string, detail: string, extras: Partial<AuditEvent> = {}): AssuranceState {
  const id = `DEMO-E${String(state.events.length + 1).padStart(2, '0')}`;
  return { ...state, events: [...state.events, { id, at, actor, area, action, detail, ...extras }] };
}

/** Keeps older browser sessions usable after the timed PAM example was introduced. */
export function restoreAssuranceState(state: AssuranceState, now = Date.now()): AssuranceState {
  const needsWindow = ['approved', 'active'].includes(state.pamPhase) && !state.pamExpiresAt;
  return {
    ...state,
    eventNotes: state.eventNotes ?? {},
    pamSecurityNote: state.pamSecurityNote ?? initialAssuranceState.pamSecurityNote,
    ...(needsWindow ? { pamApprovedAt: now, pamExpiresAt: now + state.durationHours * 3_600_000 } : {})
  };
}

export function addEventNote(state: AssuranceState, eventId: string, note: EventNote): AssuranceState {
  if (!state.events.some((event) => event.id === eventId)) throw new Error('This sample event no longer exists.');
  if (!note.text.trim()) throw new Error('Add a short comment before saving the log note.');
  return { ...state, eventNotes: {
    ...state.eventNotes,
    [eventId]: [...(state.eventNotes?.[eventId] ?? []), { ...note, text: note.text.trim() }]
  } };
}

export function decideAccess(state: AssuranceState, choice: Exclude<SodDecision, 'open'>, note: string, at: string): AssuranceState {
  if (!note.trim()) throw new Error('Add a short decision rationale before recording this outcome.');
  if (choice === 'mitigated' && (!state.mitigationOwner.trim() || state.mitigationDays <= 0)) throw new Error('Name the independent mitigation owner and validity window.');
  const actions = {
    revised: 'Request revised to least privilege',
    mitigated: 'Risk accepted with a time-limited mitigation',
    held: 'Request held; access not granted'
  };
  const detail = choice === 'mitigated' ? `${note.trim()} Control owner: ${state.mitigationOwner.trim()}; valid for ${state.mitigationDays} days.` : note.trim();
  return addEvent({ ...state, decision: choice, decisionNote: note.trim() }, at, 'Sample access approver', 'Access governance', actions[choice], detail);
}

export function advancePam(state: AssuranceState, at: string, outcome?: Exclude<ReviewOutcome, null>, now = Date.now()): AssuranceState {
  if (state.pamPhase === 'requested') {
    if (!state.pamReason.trim() || !state.approverNote.trim()) throw new Error('Record the business reason and approver comment first.');
    let next = addEvent(state, at, 'Sample requestor', 'Privileged access', 'Emergency access requested', state.pamReason.trim());
    next = addEvent({ ...next, pamPhase: 'approved', pamApprovedAt: now, pamExpiresAt: now + state.durationHours * 3_600_000 }, at, 'Executive sample approver', 'Privileged access', `${state.durationHours}-hour access window approved`, state.approverNote.trim());
    next = addEvent(next, at, 'Demo notification preview', 'Privileged access', 'Approval notification prepared', `Sample requestor notified in the demo: ${PAM_SAMPLE_ID} is approved until the displayed expiry. No email was sent.`);
    return next;
  }
  if (state.pamPhase === 'approved') {
    if (state.pamExpiresAt && now >= state.pamExpiresAt) throw new Error('The approved PAM window has expired. Close and review this sample request.');
    return addEvent({ ...state, pamPhase: 'active', pamStartedAt: now }, at, 'Sample requestor', 'Privileged access', 'Privileged session started', `Requester signed into ${PAM_SAMPLE_TARGET} and selected approved ID ${PAM_SAMPLE_ID}. Window ends at the displayed expiry.`);
  }
  if (state.pamPhase === 'active') {
    if (state.pamExpiresAt && now >= state.pamExpiresAt) return expirePam(state, at, now);
    return addEvent({ ...state, pamPhase: 'ended', pamClosedAt: now, pamClosureReason: 'completed' }, at, 'Sample requestor', 'Activity evidence', 'Privileged session closed', 'Requester signed out. Sample transaction records are available in the audit trail; independent review is due.');
  }
  if (state.pamPhase === 'ended') {
    if (!state.pamSecurityCheckedAt) throw new Error('Security must check the closed PAM log before independent audit review.');
    if (!state.reviewerNote.trim() || !outcome) throw new Error('Record the independent reviewer comment and choose an outcome.');
    if (outcome === 'confirmed' && state.events.some((event) => event.flagged && event.area === 'Activity evidence')) {
      throw new Error('An out-of-scope transaction attempt is flagged. Record a follow-up for independent review.');
    }
    return addEvent({ ...state, pamPhase: 'reviewed', reviewOutcome: outcome }, at, 'Independent sample reviewer', 'Activity review', outcome === 'confirmed' ? 'Activity review completed' : 'Activity flagged for follow-up', state.reviewerNote.trim());
  }
  return state;
}

export function checkPamSecurity(state: AssuranceState, at: string, now = Date.now()): AssuranceState {
  if (state.pamPhase !== 'ended') throw new Error('Security can check the PAM log only after the access window closes.');
  if (state.pamSecurityCheckedAt) return state;
  if (!state.pamSecurityNote?.trim()) throw new Error('Record the Security log check before handing it to the Auditor.');
  return addEvent({ ...state, pamSecurityCheckedAt: now, pamSecurityNote: state.pamSecurityNote.trim() }, at,
    'Sample security analyst', 'Activity review', 'Security session check completed', state.pamSecurityNote.trim());
}

export function recordPamTransaction(state: AssuranceState, at: string, kind: 'approved' | 'out-of-scope', now = Date.now()): AssuranceState {
  if (state.pamPhase !== 'active') throw new Error('Start the approved PAM session before recording activity.');
  if (state.pamExpiresAt && now >= state.pamExpiresAt) throw new Error('The PAM window has expired. No more activity can be recorded.');
  const flagged = kind === 'out-of-scope';
  return addEvent(state, at, 'Sample requestor', 'Activity evidence', flagged ? 'Out-of-scope transaction blocked' : 'Approved transaction performed',
    flagged ? 'Sample SU01 attempt is outside the approved PAM role. Access was denied and the attempt was flagged for independent review.' : 'Sample IW32 maintenance-order change was within the approved purpose.',
    { transaction: flagged ? PAM_BLOCKED_TRANSACTION : PAM_ALLOWED_TRANSACTION, result: flagged ? 'blocked' : 'allowed', flagged });
}

export function expirePam(state: AssuranceState, at: string, now = Date.now()): AssuranceState {
  if (!['approved', 'active'].includes(state.pamPhase) || !state.pamExpiresAt || now < state.pamExpiresAt) return state;
  return addEvent({ ...state, pamPhase: 'ended', pamClosedAt: now, pamClosureReason: 'expired' }, at, 'Sample access control', 'Activity evidence',
    state.pamPhase === 'active' ? 'PAM window expired; session closed' : 'PAM approval expired without use',
    state.pamPhase === 'active' ? 'The simulated time window ended. No further PAM activity is allowed; independent review is due.' : 'The approved access window ended before the requester started a session. Review the unused grant.');
}

export function assuranceMeasures(state: AssuranceState) {
  const approved = pamPhases.indexOf(state.pamPhase) >= 1;
  const checkpoints = [
    { label: 'Access request recorded', done: true },
    { label: 'SoD conflict identified', done: true },
    { label: 'Access decision and reason captured', done: state.decision !== 'open' && !!state.decisionNote },
    { label: 'Privileged access purpose recorded', done: approved },
    { label: 'Named approval and time window recorded', done: approved },
    { label: 'Illustrative transaction activity attached', done: state.events.some((event) => !!event.transaction || event.action === 'Demonstration session closed') },
    { label: 'Security log check documented', done: !!state.pamSecurityCheckedAt },
    { label: 'Independent review documented', done: state.pamPhase === 'reviewed' && !!state.reviewerNote }
  ];
  return {
    unresolvedRiskRequests: state.decision === 'open' || state.decision === 'held' ? 1 : 0,
    mitigatedRiskRequests: state.decision === 'mitigated' ? 1 : 0,
    completedReviews: state.pamPhase === 'reviewed' ? 1 : 0,
    activePam: state.pamPhase === 'active' ? 1 : 0,
    closedPam: ['ended', 'reviewed'].includes(state.pamPhase) ? 1 : 0,
    flaggedTransactions: state.events.filter((event) => event.flagged && event.area === 'Activity evidence').length,
    sessionsAwaitingReview: state.pamPhase === 'ended' ? 1 : 0,
    flaggedFollowups: state.reviewOutcome === 'followup' ? 1 : 0,
    evidenceCount: checkpoints.filter((item) => item.done).length,
    checkpoints
  };
}

export const deliveryStages = [
  'Landscape and ownership discovery',
  'Risk rules and role design',
  'SAP control configuration and integration',
  'Testing, evidence and handover'
] as const;

export function advanceSupport(state: AssuranceState, at: string): AssuranceState {
  if (state.supportStage === 'resolved') return state;
  if (!state.supportNote.trim()) throw new Error('Add a support investigation note before moving the case forward.');
  const next: SupportStage = state.supportStage === 'new' ? 'triaged' : 'resolved';
  return addEvent({ ...state, supportStage: next }, at, 'Sample support analyst', 'Support workspace',
    next === 'triaged' ? 'Access issue triaged' : 'Sample access issue resolved', state.supportNote.trim());
}

export function advanceDelivery(state: AssuranceState, at: string): AssuranceState {
  if (state.deliveryStage >= deliveryStages.length) return state;
  if (!state.deliveryNote.trim()) throw new Error('Record the sample acceptance or evidence note before completing this stage.');
  const stage = deliveryStages[state.deliveryStage];
  return addEvent({ ...state, deliveryStage: state.deliveryStage + 1 }, at, 'Sample delivery lead', 'Delivery plan',
    `${stage} reviewed`, state.deliveryNote.trim());
}

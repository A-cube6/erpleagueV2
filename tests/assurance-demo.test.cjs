const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../lib/assurance-demo.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;
const scope = { exports: {} };
new Function('module', 'exports', compiled)(scope, scope.exports);
const {
  addEventNote, advancePam, assuranceMeasures, checkPamSecurity, expirePam,
  initialAssuranceState, recordPamTransaction, restoreAssuranceState
} = scope.exports;
const at = '24 Sep 2026, 11:00 am';
const t = 1_800_000_000_000;
const fresh = () => structuredClone(initialAssuranceState);

test('approval activates only when the requester starts, then closes and reviews after Security', () => {
  let state = advancePam(fresh(), at, undefined, t);
  assert.equal(state.pamPhase, 'approved');
  assert.equal(state.pamExpiresAt, t + state.durationHours * 3_600_000);
  assert.equal(assuranceMeasures(state).activePam, 0);
  state = advancePam(state, at, undefined, t + 1);
  assert.equal(assuranceMeasures(state).activePam, 1);
  state = recordPamTransaction(state, at, 'approved', t + 2);
  assert.equal(state.events.at(-1).result, 'allowed');
  const eventId = state.events.at(-1).id;
  state = addEventNote(state, eventId, { actor: 'Security (demo)', at, text: '   In scope.   ' });
  assert.equal(state.eventNotes[eventId][0].text, 'In scope.');
  state = advancePam(state, at, undefined, t + 3);
  assert.equal(state.pamPhase, 'ended');
  assert.equal(assuranceMeasures(state).closedPam, 1);
  assert.equal(assuranceMeasures(state).sessionsAwaitingReview, 1);
  assert.throws(() => advancePam(state, at, 'confirmed', t + 4), /Security must check/);
  state = checkPamSecurity(state, at, t + 5);
  state = advancePam(state, at, 'confirmed', t + 6);
  assert.equal(assuranceMeasures(state).completedReviews, 1);
  assert.equal(assuranceMeasures(state).sessionsAwaitingReview, 0);
  assert.equal(assuranceMeasures(state).evidenceCount, assuranceMeasures(state).checkpoints.length - 1); // Separate SoD decision remains outstanding.
});

test('blocked out-of-scope activity remains logged and requires independent follow-up', () => {
  let state = advancePam(fresh(), at, undefined, t);
  state = advancePam(state, at, undefined, t + 1);
  state = recordPamTransaction(state, at, 'out-of-scope', t + 2);
  assert.equal(state.events.at(-1).transaction.startsWith('SU01'), true);
  assert.equal(state.events.at(-1).result, 'blocked');
  assert.equal(assuranceMeasures(state).flaggedTransactions, 1);
  state = checkPamSecurity(advancePam(state, at, undefined, t + 3), at, t + 4);
  assert.throws(() => advancePam(state, at, 'confirmed', t + 5), /out-of-scope transaction/);
  state = advancePam(state, at, 'followup', t + 5);
  assert.equal(assuranceMeasures(state).flaggedFollowups, 1);
  assert.equal(state.reviewOutcome, 'followup');
});

test('approved access expires before use; activity cannot be recorded after expiry', () => {
  let state = advancePam(fresh(), at, undefined, t);
  const expiredAt = state.pamExpiresAt;
  state = expirePam(state, at, expiredAt);
  assert.equal(state.pamPhase, 'ended');
  assert.equal(state.pamClosureReason, 'expired');
  assert.equal(assuranceMeasures(state).activePam, 0);
  assert.equal(assuranceMeasures(state).sessionsAwaitingReview, 1);
  assert.equal(assuranceMeasures(state).checkpoints.find((p) => p.label.includes('transaction activity')).done, false);
  assert.throws(() => recordPamTransaction(state, at, 'approved', expiredAt + 1), /Start the approved PAM session/);
});

test('active window expiry closes the session and older saved cases remain readable', () => {
  let state = advancePam(fresh(), at, undefined, t);
  state = advancePam(state, at, undefined, t + 1);
  assert.throws(() => recordPamTransaction(state, at, 'approved', state.pamExpiresAt), /expired/);
  state = expirePam(state, at, state.pamExpiresAt);
  assert.equal(state.pamClosureReason, 'expired');
  assert.equal(assuranceMeasures(state).closedPam, 1);
  const legacy = fresh();
  legacy.pamPhase = 'active';
  delete legacy.pamExpiresAt;
  delete legacy.eventNotes;
  const restored = restoreAssuranceState(legacy, t);
  assert.equal(restored.pamExpiresAt, t + restored.durationHours * 3_600_000);
  assert.deepEqual(restored.eventNotes, {});
});

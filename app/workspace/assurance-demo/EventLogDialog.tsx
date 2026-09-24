'use client';

import { useEffect, useRef, useState } from 'react';
import { CircleAlert, ClipboardCheck, Info, X } from 'lucide-react';
import {
  PAM_SAMPLE_ID, PAM_SAMPLE_TARGET, type AuditEvent, type EventNote
} from '@/lib/assurance-demo';

type Props = {
  event: AuditEvent;
  notes: EventNote[];
  sessionEvents: AuditEvent[];
  noteActor: string;
  onSave: (text: string) => void;
  onClose: () => void;
};

export function EventLogDialog({ event, notes, sessionEvents, noteActor, onSave, onClose }: Props) {
  const [draft, setDraft] = useState('');
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const isPam = ['Privileged access', 'Activity evidence', 'Activity review'].includes(event.area);

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab') return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), textarea:not([disabled]), input:not([disabled]), a[href]') ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { window.removeEventListener('keydown', onKeyDown); previous?.focus(); };
  }, [onClose]);

  return <div className="assurance-log-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="assurance-log-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="assurance-log-title" aria-describedby="assurance-log-subtitle">
      <header className="assurance-log-header">
        <div><span>DEMO EVENT LOG · {event.id}</span><h2 id="assurance-log-title">{event.action}</h2><p id="assurance-log-subtitle">{event.area} · {event.at}</p></div>
        <button type="button" ref={closeRef} className="assurance-log-close" aria-label="Close event log" onClick={onClose}><X size={20} /></button>
      </header>
      <div className="assurance-log-body">
        <div className="assurance-log-facts">
          <div><small>Recorded actor</small><strong>{event.actor}</strong></div>
          <div><small>Case</small><strong>DEMO-AG-1042</strong></div>
          {isPam && <><div><small>Illustrative PAM ID</small><strong>{PAM_SAMPLE_ID}</strong></div><div><small>Requested system</small><strong>{PAM_SAMPLE_TARGET}</strong></div></>}
        </div>
        <section className="assurance-log-section"><h3>Event details</h3><p>{event.detail}</p></section>
        {isPam && <section className="assurance-log-section"><h3>Transaction and scope</h3>
          {event.transaction ? <div className={`assurance-log-transaction ${event.flagged ? 'flagged' : 'allowed'}`}>
            {event.flagged ? <CircleAlert size={19} /> : <ClipboardCheck size={19} />}
            <div><strong>{event.transaction}</strong><p>{event.flagged ? 'Outside the approved maintenance scope. This sample attempt was blocked; no user maintenance was performed.' : 'Within the approved sample maintenance scope.'}</p></div>
            <span>{event.flagged ? 'BLOCKED & FLAGGED' : 'ALLOWED'}</span>
          </div> : <p>No transaction is attributed to this workflow event. Approval and notification records are separate from session activity.</p>}
          <h4>Session transaction log</h4>
          {sessionEvents.length ? <div className="assurance-log-session-list">{sessionEvents.map((item) => <div key={item.id} className={item.flagged ? 'flagged' : ''}><strong>{item.transaction}</strong><span>{item.flagged ? 'Blocked · outside approved PAM ID scope' : 'Allowed · within approved scope'}</span><small>{item.id} · {item.at}</small></div>)}</div> : <p>No transaction-level activity has been recorded in this sample session.</p>}
        </section>}
        <section className="assurance-log-section"><h3>Review comments</h3>
          {notes.length ? <ol className="assurance-log-notes">{notes.map((note, i) => <li key={`${note.at}-${i}`}><strong>{note.actor} · {note.at}</strong><p>{note.text}</p></li>)}</ol> : <p>No comments on this event yet.</p>}
          <label className="assurance-log-comment" htmlFor="assurance-event-comment"><strong>Add a sample comment</strong><span>State what was checked, why a transaction was flagged, or the next audit action.</span></label>
          <textarea id="assurance-event-comment" rows={3} maxLength={1000} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Example: Checked the denied SU01 attempt against the approved maintenance scope…" />
          <button type="button" className="assurance-primary" disabled={!draft.trim()} onClick={() => { onSave(draft); setDraft(''); }}>Save comment as {noteActor}</button>
        </section>
        <div className="assurance-log-foot"><Info size={16} /><span>Synthetic event, transaction and comment data. No SAP log is connected; actual logging and control coverage require CUST discovery.</span></div>
      </div>
    </section>
  </div>;
}

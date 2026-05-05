'use client';

import { useState } from 'react';
import { serviceOptions } from '@/lib/site-data';

type FormStatus = 'idle' | 'success';

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: serviceOptions[0],
    message: ''
  });

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status === 'success') setStatus('idle');
  };

  return (
    <div className="form-card" aria-label="ERPLeague enquiry form">
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" value={form.name} onChange={(event) => update('name', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="company">Company</label>
          <input id="company" value={form.company} onChange={(event) => update('company', event.target.value)} />
        </div>
        <div className="field full">
          <label htmlFor="serviceInterest">Service Interest</label>
          <select id="serviceInterest" value={form.serviceInterest} onChange={(event) => update('serviceInterest', event.target.value)}>
            {serviceOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className="field full">
          <label htmlFor="message">Message</label>
          <textarea id="message" rows={5} value={form.message} onChange={(event) => update('message', event.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" type="button" onClick={() => setStatus('success')}>Submit Enquiry</button>
      {status === 'success' && <p className="success-message">Thanks — we'll be in touch within 1 business day.</p>}
    </div>
  );
}

export function PartnerForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState({
    name: '',
    company: '',
    role: '',
    partnerType: 'Technology',
    message: ''
  });

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status === 'success') setStatus('idle');
  };

  return (
    <div className="form-card" aria-label="ERPLeague partner enquiry form">
      <div className="form-grid">
        <div className="field">
          <label htmlFor="partnerName">Name</label>
          <input id="partnerName" value={form.name} onChange={(event) => update('name', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="partnerCompany">Company</label>
          <input id="partnerCompany" value={form.company} onChange={(event) => update('company', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="partnerRole">Role</label>
          <input id="partnerRole" value={form.role} onChange={(event) => update('role', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="partnerType">Partner Type</label>
          <select id="partnerType" value={form.partnerType} onChange={(event) => update('partnerType', event.target.value)}>
            <option>Technology</option>
            <option>Referral</option>
            <option>Delivery</option>
            <option>Other</option>
          </select>
        </div>
        <div className="field full">
          <label htmlFor="partnerMessage">How We Can Work Together</label>
          <textarea id="partnerMessage" rows={5} value={form.message} onChange={(event) => update('message', event.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" type="button" onClick={() => setStatus('success')}>Start the Conversation →</button>
      {status === 'success' && <p className="success-message">Thanks — we'll be in touch within 1 business day.</p>}
    </div>
  );
}

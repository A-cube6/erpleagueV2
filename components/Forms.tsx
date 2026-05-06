'use client';

import { useState } from 'react';
import { serviceOptions } from '@/lib/site-data';

type FormStatus = 'idle' | 'success' | 'error';

const formCardClass = 'form-card rounded-[22px] border border-slate-200 bg-white/95 p-5 shadow-card backdrop-blur md:p-7';
const formGridClass = 'form-grid grid grid-cols-1 gap-4 md:grid-cols-2';
const fieldClass = 'field grid gap-2';
const fullFieldClass = `${fieldClass} full md:col-span-2`;
const labelClass = 'text-[13px] font-bold text-navy';
const inputClass = 'w-full !rounded-xl !border !border-slate-200 !bg-white !px-4 !py-3 text-[15px] text-slate-900 outline-none transition focus:!border-blue focus:!ring-4 focus:!ring-blue/10';
const errorInputClass = '!border-red-400 focus:!border-red-500 focus:!ring-red-100';
const requiredMarkClass = 'ml-1 text-red-600';
const errorMessageClass = 'text-xs font-semibold text-red-700';

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
    if (status !== 'idle') setStatus('idle');
  };

  const submit = () => {
    if (!form.email.trim()) {
      setStatus('error');
      return;
    }

    setStatus('success');
  };

  const emailHasError = status === 'error' && !form.email.trim();

  return (
    <div className={formCardClass} aria-label="ERPLeague enquiry form">
      <div className={formGridClass}>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="name">Name</label>
          <input className={inputClass} id="name" value={form.name} onChange={(event) => update('name', event.target.value)} />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="email">
            Email<span className={requiredMarkClass}>*</span>
          </label>
          <input
            className={`${inputClass} ${emailHasError ? errorInputClass : ''}`}
            id="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={emailHasError}
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
          />
          {emailHasError && <span className={errorMessageClass}>Email is required.</span>}
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="phone">Phone</label>
          <input className={inputClass} id="phone" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="company">Company</label>
          <input className={inputClass} id="company" value={form.company} onChange={(event) => update('company', event.target.value)} />
        </div>
        <div className={fullFieldClass}>
          <label className={labelClass} htmlFor="serviceInterest">Service Interest</label>
          <select className={inputClass} id="serviceInterest" value={form.serviceInterest} onChange={(event) => update('serviceInterest', event.target.value)}>
            {serviceOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className={fullFieldClass}>
          <label className={labelClass} htmlFor="message">Message</label>
          <textarea className={`${inputClass} min-h-[140px] resize-y`} id="message" rows={5} value={form.message} onChange={(event) => update('message', event.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary w-full sm:w-fit" type="button" onClick={submit}>Submit Enquiry</button>
      {status === 'success' && <p className="success-message rounded-xl bg-emerald-50 px-4 py-3 font-semibold text-emerald-900">Thanks — we'll be in touch within 1 business day.</p>}
    </div>
  );
}

export function PartnerForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    partnerType: 'Technology',
    message: ''
  });

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status !== 'idle') setStatus('idle');
  };

  const submit = () => {
    if (!form.email.trim()) {
      setStatus('error');
      return;
    }

    setStatus('success');
  };

  const emailHasError = status === 'error' && !form.email.trim();

  return (
    <div className={formCardClass} aria-label="ERPLeague partner enquiry form">
      <div className={formGridClass}>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="partnerName">Name</label>
          <input className={inputClass} id="partnerName" value={form.name} onChange={(event) => update('name', event.target.value)} />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="partnerEmail">
            Email<span className={requiredMarkClass}>*</span>
          </label>
          <input
            className={`${inputClass} ${emailHasError ? errorInputClass : ''}`}
            id="partnerEmail"
            type="email"
            required
            aria-required="true"
            aria-invalid={emailHasError}
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
          />
          {emailHasError && <span className={errorMessageClass}>Email is required.</span>}
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="partnerCompany">Company</label>
          <input className={inputClass} id="partnerCompany" value={form.company} onChange={(event) => update('company', event.target.value)} />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="partnerRole">Role</label>
          <input className={inputClass} id="partnerRole" value={form.role} onChange={(event) => update('role', event.target.value)} />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="partnerType">Partner Type</label>
          <select className={inputClass} id="partnerType" value={form.partnerType} onChange={(event) => update('partnerType', event.target.value)}>
            <option>Technology</option>
            <option>Referral</option>
            <option>Delivery</option>
            <option>Other</option>
          </select>
        </div>
        <div className={fullFieldClass}>
          <label className={labelClass} htmlFor="partnerMessage">How We Can Work Together</label>
          <textarea className={`${inputClass} min-h-[140px] resize-y`} id="partnerMessage" rows={5} value={form.message} onChange={(event) => update('message', event.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary w-full sm:w-fit" type="button" onClick={submit}>Start the Conversation →</button>
      {status === 'success' && <p className="success-message rounded-xl bg-emerald-50 px-4 py-3 font-semibold text-emerald-900">Thanks — we'll be in touch within 1 business day.</p>}
    </div>
  );
}

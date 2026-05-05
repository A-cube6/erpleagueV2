'use client';

import Link from 'next/link';
import { useState } from 'react';

export function LoginPanel() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  const handleLogin = () => {
    setSignedIn(true);
  };

  return (
    <div className="login-card glass-panel rounded-[26px] border border-white/30 bg-white/95 p-6 shadow-premium backdrop-blur-xl md:p-8">
      <div className="login-card-heading">
        <span className="login-lock" aria-hidden="true">⌁</span>
        <div>
          <h2>Client Login</h2>
          <p>Use your ERPLeague User ID and password.</p>
        </div>
      </div>

      <div className="field grid gap-2">
        <label className="text-[13px] font-bold text-navy" htmlFor="userId">User ID</label>
        <input className="w-full !rounded-xl !border !border-slate-200 !bg-white !px-4 !py-3 text-[15px] text-slate-900 outline-none transition focus:!border-blue focus:!ring-4 focus:!ring-blue/10" id="userId" value={userId} onChange={(event) => { setUserId(event.target.value); setSignedIn(false); }} autoComplete="username" />
      </div>
      <div className="field grid gap-2">
        <label className="text-[13px] font-bold text-navy" htmlFor="password">Password</label>
        <input className="w-full !rounded-xl !border !border-slate-200 !bg-white !px-4 !py-3 text-[15px] text-slate-900 outline-none transition focus:!border-blue focus:!ring-4 focus:!ring-blue/10" id="password" type="password" value={password} onChange={(event) => { setPassword(event.target.value); setSignedIn(false); }} autoComplete="current-password" />
      </div>

      <button className="btn btn-primary login-button w-full" type="button" onClick={handleLogin}>Sign In →</button>

      {signedIn && (
        <div className="login-success">
          <strong>Welcome to ERPLeague Client Portal.</strong>
          <span>Workspace access confirmed.</span>
        </div>
      )}

      <div className="login-card-footer">
        <Link href="/portal">Back to Client Portal</Link>
        <Link href="/#contact">Request Access</Link>
      </div>
    </div>
  );
}

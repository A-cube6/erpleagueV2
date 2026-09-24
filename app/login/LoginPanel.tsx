'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

// Demo-only gate. These values are shipped to the browser and must never protect real data.
const DEMO_USER = 'iagcust';
const DEMO_PASSWORD = 'iloveerp';
export const DEMO_SESSION_KEY = 'erpleague:demo-client';

export function LoginPanel() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem(DEMO_SESSION_KEY) === DEMO_USER) router.replace('/workspace');
  }, [router]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userId.trim().toLowerCase() !== DEMO_USER || password !== DEMO_PASSWORD) {
      setError('The demo User ID or password is incorrect. Please try again.');
      return;
    }

    sessionStorage.setItem(DEMO_SESSION_KEY, DEMO_USER);
    setPassword('');
    router.push('/workspace');
  };

  return (
    <form className="login-card glass-panel rounded-[26px] border border-white/30 bg-white/95 p-6 shadow-premium backdrop-blur-xl md:p-8" onSubmit={handleLogin}>
      <div className="login-card-heading">
        <span className="login-lock" aria-hidden="true">⌁</span>
        <div>
          <h2>Client Login</h2>
          <p>Use your ERPLeague demo User ID and password.</p>
        </div>
      </div>

      <div className="field grid gap-2">
        <label className="text-[13px] font-bold text-navy" htmlFor="userId">User ID</label>
        <input className="w-full !rounded-xl !border !border-slate-200 !bg-white !px-4 !py-3 text-[15px] text-slate-900 outline-none transition focus:!border-blue focus:!ring-4 focus:!ring-blue/10" id="userId" value={userId} onChange={(event) => { setUserId(event.target.value); setError(''); }} autoComplete="username" required />
      </div>
      <div className="field grid gap-2">
        <label className="text-[13px] font-bold text-navy" htmlFor="password">Password</label>
        <input className="w-full !rounded-xl !border !border-slate-200 !bg-white !px-4 !py-3 text-[15px] text-slate-900 outline-none transition focus:!border-blue focus:!ring-4 focus:!ring-blue/10" id="password" type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} autoComplete="current-password" required />
      </div>

      {error && <p className="login-error" role="alert">{error}</p>}
      <button className="btn btn-primary login-button w-full" type="submit">Sign In →</button>
      <p className="login-demo-note">Demo preview only. No live client systems or data are connected.</p>

      <div className="login-card-footer">
        <Link href="/portal">Back to Client Portal</Link>
        <Link href="/#contact">Request Access</Link>
      </div>
    </form>
  );
}

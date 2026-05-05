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
    <div className="login-card glass-panel">
      <div className="login-card-heading">
        <span className="login-lock" aria-hidden="true">⌁</span>
        <div>
          <h2>Client Login</h2>
          <p>Use your ERPLeague User ID and password.</p>
        </div>
      </div>

      <div className="field">
        <label htmlFor="userId">User ID</label>
        <input id="userId" value={userId} onChange={(event) => { setUserId(event.target.value); setSignedIn(false); }} autoComplete="username" />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(event) => { setPassword(event.target.value); setSignedIn(false); }} autoComplete="current-password" />
      </div>

      <button className="btn btn-primary login-button" type="button" onClick={handleLogin}>Sign In →</button>

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

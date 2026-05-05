import type { Metadata } from 'next';
import { LoginPanel } from './LoginPanel';

export const metadata: Metadata = {
  title: 'Client Login | ERPLeague Australia',
  description: 'ERPLeague client portal login.'
};

export default function LoginPage() {
  return (
    <section className="login-page">
      <div className="container login-shell">
        <div className="login-copy">
          <p className="eyebrow dark">ERPLeague Client Portal</p>
          <h1>Sign in to your ERPLeague workspace</h1>
          <p>Access support requests, health check summaries, delivery updates and ERPLeague workspace resources from one secure entry point.</p>
          <div className="login-proof-grid" aria-hidden="true">
            <span>Support</span>
            <span>Projects</span>
            <span>Reports</span>
          </div>
        </div>
        <LoginPanel />
      </div>
    </section>
  );
}

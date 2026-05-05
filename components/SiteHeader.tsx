'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { navigation, services } from '@/lib/site-data';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 26);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''} ${open ? 'open' : ''}`}>
      <div className="container header-inner">
        <Link className="logo logo-with-image" href="/" onClick={closeMenu} aria-label="ERPLeague home">
          <img className="brand-logo-img" src="/assets/erp-league-logo.png" alt="ERPLeague" />
        </Link>

        <nav className="nav-desktop" aria-label="Main navigation">
          <Link className="nav-link" href="/">Home</Link>
          <div className="nav-dropdown">
            <Link className="nav-button" href="/services">Services</Link>
            <div className="dropdown-panel" aria-label="Services submenu">
              {services.map((service) => (
                <Link className="dropdown-item" href={service.href} key={service.title}>
                  <strong>{service.title}</strong>
                  {service.badge}
                </Link>
              ))}
            </div>
          </div>
          {navigation.map((item) => (
            <Link className="nav-link" href={item.href} key={item.label}>
              {item.label}
            </Link>
          ))}
          <Link className="nav-link nav-cta" href="/#contact">Book Health Check</Link>
        </nav>

        <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? '✕' : '☰'}
        </button>
      </div>

      <nav className={`mobile-panel ${open ? 'show' : ''}`} aria-label="Mobile navigation">
        <Link href="/" onClick={closeMenu}>Home</Link>
        <Link href="/services" onClick={closeMenu}>Services</Link>
        <div className="mobile-services">
          {services.map((service) => (
            <Link href={service.href} onClick={closeMenu} key={service.title}>{service.title}</Link>
          ))}
        </div>
        {navigation.map((item) => (
          <Link href={item.href} onClick={closeMenu} key={item.label}>{item.label}</Link>
        ))}
        <Link href="/#contact" onClick={closeMenu}>Book Health Check</Link>
      </nav>
    </header>
  );
}

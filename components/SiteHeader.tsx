'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { navigation, services } from '@/lib/site-data';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [desktopServicesSuppressed, setDesktopServicesSuppressed] = useState(false);

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

  const closeMenu = () => {
    setOpen(false);
    setMobileServicesOpen(false);
    setDesktopServicesSuppressed(false);
  };

  const closeDesktopServices = () => {
    setDesktopServicesSuppressed(true);
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''} ${open ? 'open' : ''}`}>
      <div className="container header-inner">
        <Link className="logo logo-with-image" href="/" onClick={closeMenu} aria-label="ERPLeague home">
          <img className="brand-logo-img" src="/assets/erp-league-logo.png" alt="ERPLeague" />
        </Link>

        <nav className="nav-desktop" aria-label="Main navigation">
          <Link className="nav-link" href="/">Home</Link>
          <div className={`nav-dropdown ${desktopServicesSuppressed ? 'dropdown-suppressed' : ''}`} onMouseLeave={() => setDesktopServicesSuppressed(false)}>
            <Link className="nav-button" href="/services" onClick={closeDesktopServices}>Services</Link>
            <div className="dropdown-panel" aria-label="Services submenu">
              {services.map((service) => (
                <Link className="dropdown-item" href={service.href} key={service.title} onClick={closeDesktopServices}>
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

        <button
          className="menu-toggle inline-flex items-center justify-center transition-transform duration-200 hover:-translate-y-0.5"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} strokeWidth={2.2} /> : <Menu size={22} strokeWidth={2.2} />}
        </button>
      </div>

      <nav
        className={`mobile-panel ${open ? 'show' : ''} rounded-[24px] border border-slate-200/80 bg-white/95 p-3 shadow-2xl backdrop-blur-xl md:p-4`}
        aria-label="Mobile navigation"
      >
        <Link className="mobile-nav-link" href="/" onClick={closeMenu}>Home</Link>

        <button
          type="button"
          className="mobile-nav-link mobile-nav-button flex w-full items-center justify-between"
          aria-expanded={mobileServicesOpen}
          onClick={() => setMobileServicesOpen((value) => !value)}
        >
          <span>Services</span>
          <ChevronDown className={`transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} size={18} />
        </button>

        {mobileServicesOpen && (
          <div className="mobile-services rounded-2xl bg-slate-50/90 p-2 ring-1 ring-slate-200/80">
            <Link href="/services" onClick={closeMenu}>Services Overview</Link>
            {services.map((service) => (
              <Link href={service.href} onClick={closeMenu} key={service.title}>{service.title}</Link>
            ))}
          </div>
        )}

        {navigation.map((item) => (
          <Link className="mobile-nav-link" href={item.href} onClick={closeMenu} key={item.label}>{item.label}</Link>
        ))}
        <Link className="mobile-nav-link mobile-nav-cta" href="/#contact" onClick={closeMenu}>Book Health Check</Link>
      </nav>
    </header>
  );
}

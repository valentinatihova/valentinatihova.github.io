import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Menu, X, ArrowRight } from 'lucide-react';
import { profile } from '../../data/profile';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BrandMark } from '../brand/BrandMark';
import { trackEvent } from '../../lib/analytics';

export default function SiteNav() {
  const [pathname, setPathname] = useState('/');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onHashChange = () => setMobileMenuOpen(false);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Close the mobile menu on Escape and move focus into it when it opens.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const scrollToTop = () => {
    trackEvent('scroll_to_top');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isResumePage = pathname === '/resume';
  const isArticleArea = pathname === '/' || pathname.startsWith('/article/');

  const navItems = [
    { href: '/#projects', label: 'Work', active: isArticleArea },
    { href: '/resume', label: 'Resume', active: isResumePage },
  ];

  return (
    <>
      {/* ── Desktop / sticky header ── */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <a
            href="/"
            aria-label="Valentina Tihova — home"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <BrandMark size={22} />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-700 transition-colors group-hover:text-accent hidden sm:block">
              Valentina Tihova
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => trackEvent('nav_click', { label: item.label })}
                className={`rounded-sm font-mono text-[11px] uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                  item.active ? 'text-accent' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-5 pl-5 border-l border-stone-200">
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile (opens in a new tab)"
                onClick={() => trackEvent('social_click', { label: 'linkedin_header' })}
                className="rounded-sm font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                LinkedIn
              </a>
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile (opens in a new tab)"
                onClick={() => trackEvent('social_click', { label: 'github_header' })}
                className="rounded-sm font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                GitHub
              </a>
            </div>
          </nav>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden inline-flex items-center justify-center border border-stone-200 p-2 text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-900"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[70] bg-stone-900/20 md:hidden"
            />
            <motion.aside
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="fixed inset-x-3 top-3 z-[80] overflow-hidden border border-stone-200 bg-white md:hidden"
            >
              <div className="border-b border-stone-100 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BrandMark size={20} />
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500">Menu</p>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center border border-stone-200 p-2 text-stone-600 transition-colors hover:border-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Close navigation menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={shouldReduceMotion ? undefined : { opacity: 0, x: -6 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.03 * index }}
                  >
                    <a
                      href={item.href}
                      onClick={() => {
                        trackEvent('nav_click', { label: item.label });
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between border px-4 py-4 transition-colors ${
                        item.active
                          ? 'border-accent/40 bg-accent/5 text-accent'
                          : 'border-stone-200 text-stone-700 hover:border-stone-400 hover:text-stone-900'
                      }`}
                    >
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
                        {item.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </motion.div>
                ))}

                <div className="pt-4 flex gap-3">
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('social_click', { label: 'linkedin_mobile' })}
                    className="flex-1 border border-stone-200 px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 hover:border-stone-400 hover:text-stone-900 transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('social_click', { label: 'github_mobile' })}
                    className="flex-1 border border-stone-200 px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 hover:border-stone-400 hover:text-stone-900 transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Back to top ── */}
      <motion.button
        onClick={scrollToTop}
        initial={false}
        animate={showBackToTop ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.2 }}
        className={`fixed bottom-8 right-8 z-50 border border-stone-300 bg-white p-3 text-stone-500 transition-all hover:border-stone-900 hover:text-stone-900 ${
          showBackToTop ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </motion.button>
    </>
  );
}

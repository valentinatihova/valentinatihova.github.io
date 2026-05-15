import React, { useState, useEffect } from 'react';
import { FileText, ArrowUp, Menu, X, ArrowRight } from 'lucide-react';
import { profile } from '../../data/profile';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BrandLockup, BrandMark } from '../brand/BrandMark';
import { trackEvent } from '../../lib/analytics';

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.3 5.3 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.5 5 1.9 5 1.9a5.3 5.3 0 0 0-.1 3.8 5.4 5.4 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function SiteNav() {
  const [pathname, setPathname] = useState('/');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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

  // Close mobile menu on hash navigation
  useEffect(() => {
    const onHashChange = () => setMobileMenuOpen(false);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const scrollToTop = () => {
    trackEvent('scroll_to_top');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isResumePage = pathname === '/resume';
  const isArticleArea = pathname === '/' || pathname.startsWith('/article/');

  const navItems = [
    {
      href: '/#projects',
      label: 'Work',
      active: isArticleArea,
    },
    {
      href: '/resume',
      label: 'Resume / CV',
      active: isResumePage,
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-stone-50/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a
            href="/"
            aria-label="Valentina Tihova — home"
            className="group inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
          >
            <BrandLockup
              variant="full"
              size={28}
              className="hidden sm:flex"
              wordmarkClassName="transition-colors group-hover:text-accent"
            />
            <BrandMark size={28} className="sm:hidden" title="Valentina Tihova" />
          </a>

          <nav className="hidden md:flex items-center gap-3 md:gap-6 text-sm font-medium overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => trackEvent('nav_click', { label: item.label })}
                className={`transition-colors whitespace-nowrap flex items-center gap-2 ${
                  item.active ? 'text-accent' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pl-2 border-l border-stone-200">
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" onClick={() => trackEvent('social_click', { label: 'linkedin_header' })} className="text-stone-400 hover:text-accent transition-colors">
                <LinkedinIcon />
              </a>
              <a href={profile.socials.github} target="_blank" rel="noreferrer" onClick={() => trackEvent('social_click', { label: 'github_header' })} className="text-stone-400 hover:text-accent transition-colors">
                <GithubIcon />
              </a>
            </div>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white p-2.5 text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[70] bg-stone-900/30 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: -18 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="fixed inset-x-3 top-3 z-[80] overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white/95 shadow-[0_8px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl md:hidden"
            >
              <div className="border-b border-stone-100 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-serif text-lg text-stone-900">Navigation</p>
                    <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-stone-400">Menu</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={shouldReduceMotion ? undefined : { opacity: 0, x: -8 }}
                      animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.03 * index }}
                    >
                      <a
                        href={item.href}
                        onClick={() => {
                          trackEvent('nav_click', { label: item.label });
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-4 transition-colors ${
                          item.active
                            ? 'border-accent/50 bg-accent/8 text-accent'
                            : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300 hover:text-stone-900'
                        }`}
                      >
                        <span className="flex items-center gap-2 font-mono text-sm">
                          {item.icon}
                          {item.label}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('social_click', { label: 'linkedin_mobile' })}
                    className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm font-mono text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('social_click', { label: 'github_mobile' })}
                    className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm font-mono text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
                  >
                    GitHub
                  </a>
                </div>

                <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-stone-400">You are here</p>
                  <p className="mt-2 font-serif text-stone-700">
                    {isArticleArea ? 'Home or an article.' : 'Resume.'}
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Back to Top button */}
      <motion.button
        onClick={scrollToTop}
        initial={false}
        animate={showBackToTop ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className={`fixed bottom-8 right-8 z-50 rounded-full border border-stone-200 bg-white/90 p-3 text-stone-500 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:text-accent ${
          showBackToTop ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </>
  );
}

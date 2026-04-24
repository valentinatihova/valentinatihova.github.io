import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, FileText, ArrowUp, Menu, X, ArrowRight } from 'lucide-react';
import { profile } from '../../data/profile';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BrandLockup, BrandMark } from '../brand/BrandMark';

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

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isResumePage = location.pathname === '/resume';
  const isArticleArea = location.pathname === '/' || location.pathname.startsWith('/article/');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down 400px
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!location.hash) return;

    const targetId = location.hash.slice(1);
    const scrollToHashTarget = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const timeoutId = window.setTimeout(scrollToHashTarget, 80);
    return () => window.clearTimeout(timeoutId);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    {
      to: '/#projects',
      label: 'Articles',
      active: isArticleArea,
    },
    {
      to: '/resume',
      label: 'Resume / CV',
      active: isResumePage,
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-900 text-stone-50 font-serif relative">
      <header className="sticky top-0 z-50 w-full border-b border-stone-700 bg-stone-900/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            aria-label="Valentina Tihova — home"
            className="group inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
          >
            <BrandLockup
              variant="full"
              size={28}
              className="hidden sm:flex"
              wordmarkClassName="transition-colors group-hover:text-accent"
            />
            <BrandMark size={28} className="sm:hidden" title="Valentina Tihova" />
          </Link>

          <nav className="hidden md:flex items-center gap-3 md:gap-6 text-sm font-medium text-stone-300 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`transition-colors whitespace-nowrap flex items-center gap-2 ${
                  item.active ? 'text-accent' : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pl-2 border-l border-stone-700">
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-accent transition-colors">
                <LinkedinIcon />
              </a>
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-accent transition-colors">
                <GithubIcon />
              </a>
            </div>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden inline-flex items-center justify-center rounded-2xl border border-stone-700 bg-stone-950/80 p-2.5 text-stone-200 transition-colors hover:border-stone-600 hover:text-stone-100"
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
              className="fixed inset-0 z-[70] bg-stone-950/70 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: -18 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="fixed inset-x-3 top-3 z-[80] overflow-hidden rounded-[1.75rem] border border-stone-700 bg-stone-900/95 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl md:hidden"
            >
              <div className="border-b border-stone-800 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-serif text-lg text-stone-50">Navigation</p>
                    <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-stone-400">
                      Menu
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-2xl border border-stone-700 bg-stone-950/80 p-2.5 text-stone-200 transition-colors hover:border-stone-600 hover:text-stone-100"
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
                      key={item.to}
                      initial={shouldReduceMotion ? undefined : { opacity: 0, x: -8 }}
                      animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.03 * index }}
                    >
                      <Link
                        to={item.to}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-4 transition-colors ${
                          item.active
                            ? 'border-accent/60 bg-stone-900 text-accent shadow-[0_0_0_1px_rgba(206,127,70,0.25)]'
                            : 'border-stone-800 bg-stone-950/50 text-stone-200 hover:border-stone-600 hover:text-stone-100'
                        }`}
                      >
                        <span className="flex items-center gap-2 font-mono text-sm">
                          {item.icon}
                          {item.label}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-stone-800 bg-stone-950/50 px-4 py-4 text-sm font-mono text-stone-300 transition-colors hover:border-stone-600 hover:text-stone-100"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-stone-800 bg-stone-950/50 px-4 py-4 text-sm font-mono text-stone-300 transition-colors hover:border-stone-600 hover:text-stone-100"
                  >
                    GitHub
                  </a>
                </div>

                <div className="mt-6 rounded-2xl border border-stone-800 bg-stone-950/40 px-4 py-4">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-stone-400">You are here</p>
                  <p className="mt-2 font-serif text-stone-100">
                    {isArticleArea ? 'Home or an article.' : 'Resume.'}
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.main
        key={location.pathname}
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        className="flex-1"
      >
        {children}
      </motion.main>

      <footer className="mt-32 border-t border-stone-800/80 bg-stone-900">
        <div className="container mx-auto flex flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-6">
          <p className="font-mono text-[12px] tracking-[0.18em] text-stone-300">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <div className="flex items-center gap-4 text-stone-300 sm:shrink-0">
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 rounded"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 rounded"
            >
              <LinkedinIcon />
            </a>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 rounded"
            >
              <GithubIcon />
            </a>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        initial={false}
        animate={showBackToTop ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className={`fixed bottom-8 right-8 z-50 rounded-full border border-stone-700 bg-stone-950/85 p-3 text-stone-200 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:text-accent ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

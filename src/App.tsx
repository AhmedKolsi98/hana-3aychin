import { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { useHashRoute } from './lib/router';
import { useTheme } from './lib/theme';
import { syncContent } from './lib/content';
import EmergencyStrip from './components/EmergencyStrip';
import Sidebar from './components/Sidebar';
import UpdateToast from './components/UpdateToast';
import Home from './pages/Home';
import SectionPage from './pages/Section';
import Contribute from './pages/Contribute';

export default function App() {
  const route = useHashRoute();
  const [theme, toggleTheme] = useTheme();
  const [navOpen, setNavOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // First-visit offline bootstrap: sync all guides into IndexedDB.
  useEffect(() => {
    syncContent();
  }, []);

  // Escape closes the mobile drawer and returns focus to its trigger.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNavOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  const firstSeg = '/' + (route.split('/')[1] ?? '');

  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          // Move focus to the content without touching the hash route.
          e.preventDefault();
          mainRef.current?.focus();
          mainRef.current?.scrollIntoView();
        }}
      >
        تخطَّ إلى المحتوى
      </a>
      <EmergencyStrip />

      <div className="top-bar">
        <button
          ref={menuBtnRef}
          className="icon-btn"
          onClick={() => setNavOpen(true)}
          aria-label="فتح الفهرس"
          aria-expanded={navOpen}
          aria-controls="site-nav"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <a href="#/" style={{ textDecoration: 'none', color: 'var(--ink)', fontWeight: 800, fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
          هنا عايشين
        </a>
      </div>

      <div className="app-body">
        <Sidebar route={route} open={navOpen} onClose={() => setNavOpen(false)} theme={theme} onToggleTheme={toggleTheme} />
        <main className="main-col" id="main" ref={mainRef} tabIndex={-1} aria-label="المحتوى الرئيسي">
          <div className="content-wrap">
            {route === '/' ? <Home /> : firstSeg === '/contribute' ? <Contribute /> : <SectionPage route={route} />}
          </div>
        </main>
      </div>

      <UpdateToast />
    </div>
  );
}

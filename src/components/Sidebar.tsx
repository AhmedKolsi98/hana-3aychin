import { useMemo, useState } from 'react';
import { Moon, Sun, Home, ChevronDown, HeartHandshake } from 'lucide-react';
import { ICONS, FALLBACK_ICON } from '../data/sections';
import { useAllArticles, useSiteMeta } from '../lib/content';

interface Props {
  route: string;
  open: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Sidebar({ route, open, onClose, theme, onToggleTheme }: Props) {
  const articles = useAllArticles();
  const { sections } = useSiteMeta();

  // route shapes: '/' | '/health' | '/health/sun-uv-animals'
  const currentSection = '/' + (route.split('/')[1] ?? '');
  const currentSlug = route.split('/')[2] ?? '';

  const bySection = useMemo(() => {
    const map = new Map<string, typeof articles>();
    for (const a of articles) {
      const list = map.get(a.sectionId) ?? [];
      list.push(a);
      map.set(a.sectionId, list);
    }
    return map;
  }, [articles]);

  // Collapsed by default: only main titles show. The section being read
  // stays expanded so its subtitles remain visible. Manual toggles win.
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const isExpanded = (sectionId: string, path: string) =>
    toggled[sectionId] ?? (currentSection === path);

  return (
    <>
      {open && <button className="nav-scrim" onClick={onClose} aria-label="إغلاق القائمة" />}
      <nav id="site-nav" className={`side-nav${open ? ' open' : ''}`} aria-label="فهرس الموقع">
        <a className="brand" href="#/" onClick={onClose}>
          <img src="./icons/icon-192.png" alt="شعار هانا عايشين" width="44" height="44" />
          <span>
            <span className="brand-name">هانا عايشين</span>
            <span className="brand-sub" style={{ display: 'block' }}>دليل الصمود — تونس 2026</span>
          </span>
        </a>

        <div className="nav-list">
          <a
            href="#/"
            onClick={onClose}
            className={`nav-item${route === '/' ? ' active' : ''}`}
            aria-current={route === '/' ? 'page' : undefined}
          >
            <span className="nav-ico" aria-hidden="true"><Home size={19} strokeWidth={2.2} /></span>
            الرئيسية
          </a>

          {sections.map((s, i) => {
            const Icon = ICONS[s.icon] ?? FALLBACK_ICON;
            const path = `/${s.id}`;
            const title = s.title.ar;
            const active = currentSection === path;
            const subs = bySection.get(s.id) ?? [];
            const expanded = isExpanded(s.id, path) && subs.length > 0;
            return (
              <div className="nav-group" key={s.id}>
                <div className="nav-row">
                  <a
                    href={`#${path}`}
                    onClick={onClose}
                    className={`nav-item${active && !currentSlug ? ' active' : ''}${active ? ' in-section' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className="nav-ico" aria-hidden="true"><Icon size={19} strokeWidth={2.2} /></span>
                    {title}
                    <span className="nav-num num" dir="ltr">{String(i + 1).padStart(2, '0')}</span>
                  </a>
                  {subs.length > 0 && (
                    <button
                      type="button"
                      className="nav-chev"
                      aria-expanded={expanded}
                      aria-controls={`nav-sub-${s.id}`}
                      aria-label={expanded ? `طيّ قائمة ${title}` : `فرد قائمة ${title}`}
                      onClick={() => setToggled((t) => ({ ...t, [s.id]: !expanded }))}
                    >
                      <ChevronDown size={16} strokeWidth={2.4} aria-hidden="true" />
                    </button>
                  )}
                </div>
                {expanded && (
                  <ul className="nav-sub" id={`nav-sub-${s.id}`}>
                    {subs.map((a) => {
                      const subActive = active && currentSlug === a.slug;
                      return (
                        <li key={a.slug}>
                          <a
                            href={`#${path}/${a.slug}`}
                            onClick={onClose}
                            className={subActive ? 'active' : ''}
                            aria-current={subActive ? 'location' : undefined}
                          >
                            {a.title}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}

          <a
            href="#/contribute"
            onClick={onClose}
            className={`nav-item${currentSection === '/contribute' ? ' active' : ''}`}
            aria-current={currentSection === '/contribute' ? 'page' : undefined}
          >
            <span className="nav-ico" aria-hidden="true"><HeartHandshake size={19} strokeWidth={2.2} /></span>
            كيف تساهم؟
          </a>
        </div>

        <div className="nav-foot">
          <button className="btn" style={{ width: '100%', justifyContent: 'center' }} onClick={onToggleTheme}>
            {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            {theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
          </button>
        </div>
      </nav>
    </>
  );
}

import { useEffect } from 'react';
import { SECTIONS, type SectionDef } from '../data/sections';
import { useSectionArticles } from '../lib/content';
import Markdown from '../components/Markdown';
import JavelCalculator from '../components/tools/JavelCalculator';
import FridgeChecker from '../components/tools/FridgeChecker';
import HeatTriage from '../components/tools/HeatTriage';
import OfflineCard from '../components/OfflineCard';

/** Interactive tools embedded per section. */
function SectionTools({ section }: { section: SectionDef }) {
  if (section.id === 'water') return <JavelCalculator />;
  if (section.id === 'food') return <FridgeChecker />;
  if (section.id === 'health') return <HeatTriage />;
  if (section.id === 'about') return <OfflineCard />;
  return null;
}

export default function SectionPage({ route }: { route: string }) {
  // route: '/health' or '/health/sun-uv-animals'
  const sectionPath = '/' + (route.split('/')[1] ?? '');
  const articleSlug = route.split('/')[2] ?? '';
  const section = SECTIONS.find((s) => s.path === sectionPath);
  const articles = useSectionArticles(section?.id ?? '');

  // Sidebar subtitle navigation: scroll the targeted guide into view.
  useEffect(() => {
    if (!articleSlug || articles.length === 0) return;
    const el = document.getElementById(articleSlug);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [articleSlug, articles.length]);

  if (!section) {
    return (
      <div className="section-head">
        <h1>الصفحة غير موجودة</h1>
        <p className="sub"><a href="#/">عُد إلى الرئيسية</a></p>
      </div>
    );
  }

  const Icon = section.icon;

  return (
    <>
      <header className="section-head">
        <div className="crumb"><a href="#/">الرئيسية</a> / {section.title}</div>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--accent)', display: 'inline-flex' }}><Icon size={30} strokeWidth={2.2} /></span>
          {section.title}
        </h1>
        <p className="sub">{section.sub}</p>
      </header>

      <SectionTools section={section} />

      {articles.length === 0 && (
        <p style={{ color: 'var(--ink-2)', padding: '20px 0' }}>
          جارٍ تحميل الأدلة… إن كنت دون اتصال في أول زيارة، اتصل بالشبكة مرة واحدة لتحميل المحتوى.
        </p>
      )}

      {articles.map((a) => (
        <article key={a.slug} className="article-block" id={a.slug}>
          <header className="art-head">
            <h2 className="art-title" style={{ border: 0, padding: 0, margin: 0 }}>{a.title}</h2>
            <div className="art-meta">
              <span>{a.summary}</span>
              <span>رُاجع في <span className="num" dir="ltr">{a.updatedAt}</span></span>
            </div>
          </header>
          <Markdown>{a.bodyMarkdown}</Markdown>
        </article>
      ))}

      <div className="foot-note">
        <span>المحتوى إرشادي ولا يعوّض الطبيب أو أعوان الإنقاذ — في الحالات الحرجة <bdi dir="ltr" className="num">190</bdi> / <bdi dir="ltr" className="num">198</bdi></span>
        <button className="btn" onClick={() => window.print()} style={{ minHeight: 40, padding: '6px 16px', fontSize: 13.5 }}>
          اطبع هذا القسم كقائمة ورقية
        </button>
      </div>
    </>
  );
}

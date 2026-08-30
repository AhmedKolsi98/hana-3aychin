import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Wifi } from 'lucide-react';
import type { ReactNode } from 'react';

/** Flatten react-markdown children to plain text (for callout detection). */
function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (typeof node === 'object' && 'props' in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

function calloutClass(children: ReactNode): string {
  const t = textOf(children);
  if (/^(🚨|❗|❌)/.test(t)) return 'c-danger';
  if (/^⚠️/.test(t)) return 'c-warn';
  if (/^(💡|📵)/.test(t)) return 'c-tip';
  return '';
}

/** Online badge appended to external links. */
function ExternalMark() {
  return (
    <span className="badge b-warn" style={{ marginInlineStart: 8, verticalAlign: 'middle' }}>
      <Wifi size={11} style={{ display: 'inline' }} />
      يحتاج اتصالاً
    </span>
  );
}

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children: c }) => (
            <div className="table-scroll" role="region" aria-label="جدول" tabIndex={0}>
              <table>{c}</table>
            </div>
          ),
          blockquote: ({ children: c }) => (
            <blockquote className={calloutClass(c)}>{c}</blockquote>
          ),
          img: ({ src, alt }) => (
            // Lazy + async decoding: infographics are online-only enhancements,
            // so they must never block first render.
            <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" />
          ),
          a: ({ href, children: c }) => {
            const external = !!href && /^https?:\/\//.test(href);
            return external ? (
              <>
                <a href={href} target="_blank" rel="noreferrer noopener">{c}</a>
                <ExternalMark />
              </>
            ) : (
              <a href={href}>{c}</a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

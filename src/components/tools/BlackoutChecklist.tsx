import { useEffect, useState } from 'react';
import { ListChecks, RotateCcw } from 'lucide-react';
import { db } from '../../lib/db';

const ITEMS: { id: string; text: string }[] = [
  { id: 'charge', text: 'اشحن كل الأجهزة والبطاريات المحمولة بالكامل' },
  { id: 'water', text: 'املأ الماجل والقوارير والأواني بماء الشرب' },
  { id: 'freeze', text: 'جمّد قوارير ماء لدعم برودة المجمّد والثلاجة' },
  { id: 'compressors', text: 'افصل المكيفات والثلاجات لحظة عودة التيار (أو تأكد من ريليه الحماية)' },
  { id: 'offline', text: 'حمّل كل محتوى «هنا عايشين» للاستعمال دون اتصال' },
  { id: 'lamp', text: 'جهّز مصباح الزيت والفتائل القطنية والولاعات' },
  { id: 'elderly', text: 'تفقّد المسنّين والمرضى — وجدول شرب الماء لهم' },
  { id: 'insulin', text: 'فعّل محفظة FRÍO لدواء الأنسولين (نقع 5–15 دقيقة)' },
  { id: 'food', text: 'استهلك الأطعمة القابلة للتلف أولاً وأغلق باب الثلاجة' },
  { id: 'numbers', text: 'احفظ أرقام الطوارئ في الهاتف وعلى ورقة ظاهرة' },
];

/** Persistent blackout-prep checklist — stored on-device in IndexedDB. */
export default function BlackoutChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    db.checklist.toArray().then((rows) => {
      const map: Record<string, boolean> = {};
      rows.forEach((r) => { map[r.id] = r.done; });
      setDone(map);
    });
  }, []);

  const toggle = async (id: string) => {
    const next = !done[id];
    setDone((d) => ({ ...d, [id]: next }));
    await db.checklist.put({ id, done: next });
  };

  const reset = async () => {
    setDone({});
    await db.checklist.clear();
  };

  const count = ITEMS.filter((i) => done[i.id]).length;
  const pct = Math.round((count / ITEMS.length) * 100);

  return (
    <div className="tool" id="blackout-checklist">
      <h3><span className="t-ico"><ListChecks size={19} /></span> قائمة التجهيز للانقطاع</h3>
      <p className="t-desc">
        عشر خطوات قبل موجة القطع القادمة. تُحفظ علاماتك في جهازك فقط.
        <span className="badge b-ok" style={{ marginInlineStart: 8 }}>
          <span className="num" dir="ltr">{count}/{ITEMS.length}</span> — {pct}%
        </span>
      </p>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ height: 6, background: 'var(--surface-2)', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}
      >
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', transition: 'width 0.3s var(--ease)' }} />
      </div>
      {ITEMS.map((item) => (
        <label key={item.id} className={`check-item${done[item.id] ? ' done' : ''}`}>
          <input type="checkbox" checked={!!done[item.id]} onChange={() => toggle(item.id)} />
          <span className="ck-text">{item.text}</span>
        </label>
      ))}
      {count > 0 && (
        <button className="btn" onClick={reset} style={{ marginTop: 10 }}>
          <RotateCcw size={15} /> تصفير القائمة
        </button>
      )}
    </div>
  );
}

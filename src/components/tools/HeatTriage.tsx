import { useMemo, useState } from 'react';
import { Siren, ThermometerSun } from 'lucide-react';
import { useSiteMeta } from '../../lib/content';

const STROKE_SIGNS = [
  'حرارة الجسم تتجاوز 39.5 – 40°C',
  'جلد حارّ، جافّ، أحمر بوضوح',
  'غياب تام للتعرّق',
  'تشوّش، هذيان، هلوسة أو فقدان وعي',
  'تشنّجات',
];

const EXHAUSTION_SIGNS = [
  'تعرّق غزير',
  'جلد بارد وشاحب ورطب',
  'إرهاق ودوخة وانزعاج',
  'غثيان أو تقيؤ خفيف',
  'نبض سريع وضعيف',
];

/**
 * Heat illness triage: exhaustion (cool & monitor) vs stroke (call 190/198 now).
 * Offline. Any stroke sign → emergency state.
 */
export default function HeatTriage() {
  const { contacts } = useSiteMeta();
  const samu = contacts.find((c) => c.id === 'samu');
  const civilProtection = contacts.find((c) => c.id === 'civil-protection');
  const [stroke, setStroke] = useState<string[]>([]);
  const [exhaustion, setExhaustion] = useState<string[]>([]);

  const toggle = (list: string[], set: (v: string[]) => void, item: string) => {
    set(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const verdict = useMemo(() => {
    if (stroke.length > 0) return 'stroke' as const;
    if (exhaustion.length > 0) return 'exhaustion' as const;
    return null;
  }, [stroke, exhaustion]);

  return (
    <div className="tool" id="heat-triage">
      <h3><span className="t-ico"><ThermometerSun size={19} /></span> فرز الحرّ: إنهاك أم ضربة شمس؟</h3>
      <p className="t-desc">علّم الأعراض الظاهرة على المصاب. جلد حار وجاف + اضطراب في الوعي = طوارئ طبية.</p>

      <div className="field-row">
        <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
          <legend style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 6, color: 'var(--danger)' }}>علامات الخطر (ضربة شمس)</legend>
          {STROKE_SIGNS.map((s) => (
            <label key={s} className="check-item">
              <input type="checkbox" checked={stroke.includes(s)} onChange={() => toggle(stroke, setStroke, s)} />
              <span className="ck-text">{s}</span>
            </label>
          ))}
        </fieldset>
        <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
          <legend style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 6, color: 'var(--warn)' }}>علامات الإنهاك الحراري</legend>
          {EXHAUSTION_SIGNS.map((s) => (
            <label key={s} className="check-item">
              <input type="checkbox" checked={exhaustion.includes(s)} onChange={() => toggle(exhaustion, setExhaustion, s)} />
              <span className="ck-text">{s}</span>
            </label>
          ))}
        </fieldset>
      </div>

      {verdict === 'stroke' && (
        <div className="result-box r-danger" role="alert">
          <div className="big" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Siren size={24} /> ضربة شمس — اتصل الآن
          </div>
          <div style={{ marginTop: 6, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {samu && (
              <a className="btn danger" href={samu.tel}><bdi dir="ltr" className="num">{samu.number}</bdi> الإسعاف الطبي</a>
            )}
            {civilProtection && (
              <a className="btn danger" href={civilProtection.tel}><bdi dir="ltr" className="num">{civilProtection.number}</bdi> الحماية المدنية</a>
            )}
          </div>
          <ol style={{ margin: '10px 0 0', paddingInlineStart: 22 }}>
            <li>انقل المصاب إلى أبرد مكان متاح واخلع الملابس الزائدة.</li>
            <li>تبريد تبخيري: قماش مبلل على الجلد + تهوية قوية.</li>
            <li>أكياس ثلج على الفخذين والإبطين والرقبة إن توفرت.</li>
          </ol>
        </div>
      )}
      {verdict === 'exhaustion' && (
        <div className="result-box" role="status" style={{ background: 'var(--warn-soft)', borderColor: 'var(--warn)' }}>
          <div className="big" style={{ color: 'var(--warn)' }}>إنهاك حراري — برّد، رطّب، راقب</div>
          <div style={{ marginTop: 6 }}>
            انقل المصاب إلى الظل، برّده بكمادات ومروحة، واسقه ماءً أو محلول إمهاء بشربات صغيرة.
            راقبه عن قرب: أي علامة من علامات الخطر أعلاه تعني الاتصال فورًا بـ <bdi dir="ltr" className="num">{samu?.number ?? '190'}</bdi>.
          </div>
        </div>
      )}
    </div>
  );
}

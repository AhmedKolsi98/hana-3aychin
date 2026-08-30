import { useMemo, useState } from 'react';
import { Trash2, CheckCircle2, Refrigerator } from 'lucide-react';

interface Category {
  id: string;
  label: string;
  keep: boolean;
}

const CATEGORIES: Category[] = [
  { id: 'meat', label: 'لحوم، دواجن، أسماك (نيئة أو مطبوخة)', keep: false },
  { id: 'dairy', label: 'حليب، أجبان طرية، ياغورت، قشدة', keep: false },
  { id: 'eggs', label: 'بيض (طازج أو مطبوخ) ومنتجاته', keep: false },
  { id: 'hardcheese', label: 'أجبان صلبة (بارميزان، غودا، شيدر)', keep: true },
  { id: 'whole-produce', label: 'فواكه وخضروات كاملة غير مقطعة', keep: true },
  { id: 'cut-produce', label: 'فواكه وخضروات مقطعة', keep: false },
  { id: 'condiments', label: 'توابل معلبة حامضية (خردل، كاتشاب، خل)', keep: true },
];

/**
 * Keep-or-discard checker per the 4-hour / >4 °C rules.
 * Offline. Rule: under 4 h with door closed → generally safe;
 * beyond that, category decides.
 */
export default function FridgeChecker() {
  const [hours, setHours] = useState('5');
  const [cat, setCat] = useState<string>('meat');

  const verdict = useMemo(() => {
    const h = parseFloat(hours.replace(',', '.'));
    const c = CATEGORIES.find((x) => x.id === cat);
    if (!c) return null;
    if (isNaN(h) || h < 0) return null;
    if (h <= 4) {
      return {
        safe: true,
        title: 'على الأرجح آمن',
        note: 'أقل من 4 ساعات بابًا مغلقًا: الثلاجة المعزولة تبقى دون 4°C. لا تفتح الباب إلا للضرورة — كل فتحة تقصّر المهلة بشدة.',
      };
    }
    return c.keep
      ? { safe: true, title: 'آمن — احتفظ به', note: 'هذه الفئة تتحمل. افحصها وتفقّد برودة الثلاجة عند عودة التيار.' }
      : { safe: false, title: 'ارمِ فورًا', note: 'تجاوزت المدة 4 ساعات فوق 4°C: البكتيريا (ومنها السالمونيلا) تتضاعف بوتيرة أسّية. الرائحة والمذاق مؤشران غير موثوقين — عند الشك، ارمِ.' };
  }, [hours, cat]);

  return (
    <div className="tool" id="fridge-checker">
      <h3><span className="t-ico"><Refrigerator size={19} /></span> أرمِ أم أحتفظ؟ — فاحص الثلاجة</h3>
      <p className="t-desc">بعد انقطاع الكهرباء: أدخل مدة الانقطاع وصنف المادة الغذائية. القاعدة المرجعية: 4 ساعات كحد أقصى دون 4°C بابًا مغلقًا.</p>

      <div className="field-row">
        <div className="field">
          <label htmlFor="fc-hours">مدة الانقطاع (ساعات)</label>
          <input id="fc-hours" inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} dir="ltr" style={{ textAlign: 'end' }} />
        </div>
        <div className="field" style={{ gridColumn: 'span 2' }}>
          <label htmlFor="fc-cat">صنف المادة الغذائية</label>
          <select id="fc-cat" value={cat} onChange={(e) => setCat(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {verdict && (
        <div className={`result-box ${verdict.safe ? 'r-ok' : 'r-danger'}`} role="status">
          <div className="big" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {verdict.safe ? <CheckCircle2 size={24} /> : <Trash2 size={24} />}
            {verdict.title}
          </div>
          <div style={{ marginTop: 6 }}>{verdict.note}</div>
        </div>
      )}
    </div>
  );
}

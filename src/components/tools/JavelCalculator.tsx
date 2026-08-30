import { useMemo, useState } from 'react';
import { Droplet } from 'lucide-react';

type Purpose = 'shock' | 'drink';
type ConcMode = 'cl' | 'pct';

/**
 * Javel (sodium hypochlorite) dosing calculator.
 * 1 °Cl ≈ 3 g/L active chlorine (12 °Cl ≈ 36 g/L ≈ 3.6 %).
 * Targets: shock disinfection 100 mg/L — drinking water 0.5 mg/L (WHO).
 * Fully offline.
 */
export default function JavelCalculator() {
  const [volume, setVolume] = useState('1000');
  const [mode, setMode] = useState<ConcMode>('cl');
  const [conc, setConc] = useState('12');
  const [purpose, setPurpose] = useState<Purpose>('shock');

  const result = useMemo(() => {
    const v = parseFloat(volume.replace(',', '.'));
    const c = parseFloat(conc.replace(',', '.'));
    if (!v || v <= 0 || !c || c <= 0) return null;
    const gPerL = mode === 'cl' ? c * 3 : c * 10; // °Cl→g/L , %→g/L
    const targetMgL = purpose === 'shock' ? 100 : 0.5;
    const neededG = (v * targetMgL) / 1000;
    const javelL = neededG / gPerL;
    // Practical drops reference for drinking water (≈2.6 % javel, 4 drops/L)
    const drops = purpose === 'drink' ? Math.round(v * 4 * (26 / gPerL)) : null;
    return { javelL, javelMl: javelL * 1000, drops, gPerL, targetMgL };
  }, [volume, conc, mode, purpose]);

  return (
    <div className="tool" id="javel-calc">
      <h3><span className="t-ico"><Droplet size={19} /></span> حاسبة جرعة الجافيل</h3>
      <p className="t-desc">احسب كمية ماء الجافيل بدقة — تعمل دون اتصال. الجافيل العادي في تونس: 12° كلورومتري ≈ 3.6% كلور فعّال.</p>

      <div className="field">
        <label>الغاية من التطهير</label>
        <div className="seg" role="group" aria-label="الغاية">
          <button className={purpose === 'shock' ? 'on' : ''} onClick={() => setPurpose('shock')}>
            تطهير صادم للماجل (100 ملغ/ل)
          </button>
          <button className={purpose === 'drink' ? 'on' : ''} onClick={() => setPurpose('drink')}>
            ماء شرب يومي (0.5 ملغ/ل)
          </button>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="jv-vol">حجم الماء (لتر)</label>
          <input id="jv-vol" inputMode="decimal" value={volume} onChange={(e) => setVolume(e.target.value)} dir="ltr" style={{ textAlign: 'end' }} />
        </div>
        <div className="field">
          <label htmlFor="jv-conc">تركيز الجافيل</label>
          <input id="jv-conc" inputMode="decimal" value={conc} onChange={(e) => setConc(e.target.value)} dir="ltr" style={{ textAlign: 'end' }} />
        </div>
        <div className="field">
          <label>وحدة التركيز</label>
          <div className="seg" role="group" aria-label="وحدة التركيز">
            <button className={mode === 'cl' ? 'on' : ''} onClick={() => setMode('cl')}>درجة كلورومترية °Cl</button>
            <button className={mode === 'pct' ? 'on' : ''} onClick={() => setMode('pct')}>نسبة % كلور فعّال</button>
          </div>
        </div>
      </div>

      {result && (
        <div className="result-box" role="status">
          <div>الكمية المطلوبة من الجافيل <b>(غير معطّر وغير موسّل)</b>:</div>
          <div className="big num" dir="ltr">
            {result.javelL >= 1
              ? `${result.javelL.toFixed(2)} لتر`
              : `${Math.round(result.javelMl)} مل`}
          </div>
          {result.drops != null && (
            <div style={{ marginTop: 4 }}>
              أي ما يعادل نحو <b className="num" dir="ltr">{result.drops}</b> قطرة (على أساس 4 قطرات/لتر بجافيل 2.6%).
            </div>
          )}
          <div style={{ marginTop: 8, fontSize: 14 }}>
            {purpose === 'shock'
              ? '⏳ حرّك جيدًا واترك الماء 24 ساعة على الأقل قبل الاستعمال، مع تهوية الخزان.'
              : '⏳ حرّك واتركه 30 دقيقة على الأقل في مكان مظلم — هذه المدة غير قابلة للتفاوض (توصية منظمة الصحة العالمية).'}
          </div>
        </div>
      )}
    </div>
  );
}

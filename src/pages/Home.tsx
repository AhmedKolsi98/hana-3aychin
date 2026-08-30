import { ArrowLeft } from 'lucide-react';
import { SECTIONS } from '../data/sections';
import BlackoutChecklist from '../components/tools/BlackoutChecklist';
import OfflineCard from '../components/OfflineCard';

/** Home: crisis context, then a dense field-manual index — utility first, no marketing hero. */
export default function Home() {
  return (
    <>
      <header className="hero">
        <h1>
          هانا عايشين — <span className="tone-2">دليلك للصمود أمام أزمة الكهرباء والماء والحرّ في تونس</span>
        </h1>
        <p className="lede">
          في صائفة 2026 تعرّضت البنية التحتية التونسية لضغط غير مسبوق: حرارة قياسية، وذروة طلب كهربائي
          تاريخية دفعت STEG إلى <b>التخفيف الدوراني للأحمال</b>، فانقطع معه ماء SONEDE عن مناطق واسعة.
          هذا الموقع ليس موقعًا إخباريًا — هو <b>مخزن نجاة عملي</b>: يعمل دون اتصال بعد أول زيارة،
          ويعطيك بروتوكولات واضحة ومجرّبة لحماية أجهزتك ومائك وصحة عائلتك وغذائك.
        </p>
        <div className="stat-row" role="list">
          <div className="stat" role="listitem"><div className="v">48°C+</div><div className="k">حرارة قياسية لامست 50°C في بعض الجهات</div></div>
          <div className="stat" role="listitem"><div className="v">+30%</div><div className="k">زيادة الطلب على الكهرباء عن المعدل العادي</div></div>
          <div className="stat" role="listitem"><div className="v">~6 GW</div><div className="k">ذروة تاريخية للشبكة الوطنية</div></div>
          <div className="stat" role="listitem"><div className="v">150</div><div className="k">وفاة مرتبطة بالحرّ حسب جمعية الأطباء الشبان</div></div>
        </div>
      </header>

      <div className="section-index">
        <h2>الأدلة — ثمانية أقسام + المرجع</h2>
        <div className="index-grid">
          {SECTIONS.map((s, i) => {
            return (
              <a key={s.id} className="index-card" href={`#${s.path}`}>
                <span className="idx num" dir="ltr">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <h3>{s.title}</h3>
                  <p>{s.sub}</p>
                </span>
                <span className="go"><ArrowLeft size={17} /></span>
              </a>
            );
          })}
        </div>
      </div>

      <BlackoutChecklist />
      <OfflineCard />

      <div className="foot-note">
        <span>محتوى مدقّق مقابل مصادر موثوقة — 28 أوت 2026</span>
        <span>الكود MIT · المحتوى CC BY-SA 4.0</span>
        <span>لا تتبّع، لا إعلانات، لا حسابات</span>
      </div>
    </>
  );
}

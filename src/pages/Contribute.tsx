import { Mail, Github, HeartHandshake, Bug, FileText, Languages, Code2 } from 'lucide-react';

const EMAIL = 'ahmedkolsi98@gmail.com';
const GITHUB = 'https://github.com/AhmedKolsi98/hana-3aychin';

const WAYS = [
  {
    icon: Bug,
    title: 'صحّح خطأً',
    text: 'وجدت معلومة غير دقيقة أو رقمًا قديمًا؟ في أزمة كهذه، الدقة تنقذ أرواحًا — أبلغ عنه فورًا.',
  },
  {
    icon: FileText,
    title: 'اقترح دليلاً جديدًا',
    text: 'تعرف تقنية تبريد، حفظ، أو طوارئ غير مغطاة؟ اقترحها وسنراجعها ونوثّقها بمصادرها.',
  },
  {
    icon: Languages,
    title: 'ساهم في الترجمة',
    text: 'الموقع بالعربية حاليًا — مساعدتك في الترجمة إلى الفرنسية أو الأمازيغية توسّع دائرة النجاة.',
  },
  {
    icon: Code2,
    title: 'ساهم في الكود',
    text: 'المشروع مفتوح المصدر بالكامل (MIT). اسحب المستودع، افتح Issue أو Pull Request.',
  },
];

export default function Contribute() {
  return (
    <>
      <header className="section-head">
        <div className="crumb"><a href="#/">الرئيسية</a> / كيف تساهم؟</div>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--accent)', display: 'inline-flex' }} aria-hidden="true">
            <HeartHandshake size={30} strokeWidth={2.2} />
          </span>
          كيف تساهم في «هنا عايشين»؟
        </h1>
        <p className="sub">
          هذا الدليل مجهود مواطني تطوّعي — كل تصحيح أو اقتراح منك قد يصل إلى عائلة تحتاجه في ذروة الانقطاع.
        </p>
      </header>

      <div className="contrib-grid">
        <a className="contrib-card" href={`mailto:${EMAIL}?subject=${encodeURIComponent('اقتراح — هنا عايشين')}`}>
          <span className="contrib-ico" aria-hidden="true"><Mail size={26} strokeWidth={2} /></span>
          <span className="contrib-title">راسلني مباشرة</span>
          <span className="contrib-text">لأي اقتراح، تصحيح، أو ملاحظة — أقرأ كل الرسائل.</span>
          <span className="contrib-link num" dir="ltr">{EMAIL}</span>
        </a>

        <a className="contrib-card" href={GITHUB} target="_blank" rel="noreferrer noopener">
          <span className="contrib-ico" aria-hidden="true"><Github size={26} strokeWidth={2} /></span>
          <span className="contrib-title">ساهم عبر GitHub</span>
          <span className="contrib-text">الكود والمحتوى مفتوحان بالكامل — عدّل، راجع، أو انسخ المشروع لمدينتك.</span>
          <span className="contrib-link num" dir="ltr">github.com/AhmedKolsi98/hana-3aychin</span>
        </a>
      </div>

      <h2 className="contrib-h">طرق المساهمة</h2>
      <ul className="contrib-ways">
        {WAYS.map((w) => {
          const Icon = w.icon;
          return (
            <li key={w.title}>
              <span className="contrib-ico small" aria-hidden="true"><Icon size={21} strokeWidth={2.1} /></span>
              <div>
                <strong>{w.title}</strong>
                <p>{w.text}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="foot-note">
        <span>الكود تحت رخصة MIT والمحتوى تحت CC BY-SA — انسخ، عدّل، وانشر بحرية مع ذكر المصدر.</span>
      </div>
    </>
  );
}

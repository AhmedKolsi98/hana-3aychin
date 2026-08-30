import { Download, CloudOff, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { syncContent, useSyncReport, clearAllData } from '../lib/content';
import { useOnline } from '../lib/theme';

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} بايت`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} ك.بايت`;
  return `${(n / (1024 * 1024)).toFixed(2)} م.بايت`;
}

/** Offline status card: download-all button, sync state, clear-my-data. */
export default function OfflineCard() {
  const report = useSyncReport();
  const online = useOnline();
  const [cleared, setCleared] = useState(false);

  const allSynced = report.total > 0 && report.synced >= report.total;

  return (
    <div className="tool" id="offline-card">
      <h3><span className="t-ico"><Download size={19} /></span> الوضع دون اتصال</h3>
      <p className="t-desc">
        كل أدلة النجاة تُخزَّن داخل جهازك (وليس على خادم بعيد). حمّلها مرة واحدة وأنت متصل، وستبقى معك في الظلام وفي الانقطاع.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <span className={`badge ${online ? 'b-ok' : 'b-warn'}`}>
          {online ? 'متصل الآن' : 'دون اتصال — المحتوى المخزّن يعمل'}
        </span>
        {report.total > 0 && (
          <span className={`badge ${allSynced ? 'b-ok' : 'b-warn'}`}>
            <span className="num" dir="ltr">{report.synced}/{report.total}</span> دليلًا مخزّنًا
          </span>
        )}
        {report.totalBytes > 0 && (
          <span className="badge">الحجم الكلي ≈ <span className="num" dir="ltr">{fmtBytes(report.totalBytes)}</span></span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn primary" onClick={() => syncContent(true)} disabled={report.state === 'syncing'}>
          {report.state === 'syncing' ? <RefreshCw size={16} className="spin" /> : <Download size={16} />}
          {report.state === 'syncing' ? 'جارٍ التحميل…' : 'حمّل كل المحتوى للاستعمال دون اتصال'}
        </button>
        <button
          className="btn danger"
          onClick={async () => {
            await clearAllData();
            setCleared(true);
            setTimeout(() => window.location.reload(), 600);
          }}
        >
          {cleared ? <CloudOff size={16} /> : <Trash2 size={16} />}
          {cleared ? 'تم المسح…' : 'امسح بياناتي من هذا الجهاز'}
        </button>
      </div>

      {report.lastSync && (
        <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: '10px 0 0' }}>
          آخر مزامنة: <span className="num" dir="ltr">{new Date(report.lastSync).toLocaleString('ar-TN')}</span>
          {report.version && <> — إصدار المحتوى <span className="num" dir="ltr">{report.version}</span></>}
        </p>
      )}
    </div>
  );
}

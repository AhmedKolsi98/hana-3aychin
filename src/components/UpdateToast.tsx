import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * Service-worker update toast: new app shell available → one tap to refresh.
 * Registered through vite-plugin-pwa (virtual module), guarded for dev.
 */
export default function UpdateToast() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [update, setUpdate] = useState<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { registerSW } = await import('virtual:pwa-register');
        if (!mounted) return;
        const updateSW = registerSW({
          onNeedRefresh() { if (mounted) setNeedRefresh(true); },
          onOfflineReady() { if (mounted) setOfflineReady(true); },
        });
        setUpdate(() => () => updateSW(true));
      } catch {
        /* SW registration unavailable (dev / unsupported) — app still works */
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!offlineReady) return;
    const t = setTimeout(() => setOfflineReady(false), 6000);
    return () => clearTimeout(t);
  }, [offlineReady]);

  if (needRefresh) {
    return (
      <div className="toast" role="status">
        <span style={{ flex: 1 }}>تتوفر نسخة محدّثة من الموقع.</span>
        <button className="btn primary" onClick={() => update?.()}>
          <RefreshCw size={14} /> حدّث الآن
        </button>
      </div>
    );
  }
  if (offlineReady) {
    return (
      <div className="toast" role="status">
        <span style={{ flex: 1 }}>الموقع جاهز للعمل دون اتصال بالكامل.</span>
      </div>
    );
  }
  return null;
}

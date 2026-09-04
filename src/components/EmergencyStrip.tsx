import { useSiteMeta } from '../lib/content';

/** Sticky emergency dial strip — visible on every page, one-tap tel: links. */
export default function EmergencyStrip() {
  const { contacts } = useSiteMeta();

  return (
    <div className="emergency-strip" role="region" aria-label="أرقام الطوارئ">
      <div className="strip-inner">
        <span className="strip-label">طوارئ</span>
        {contacts.map((c) => (
          <a key={c.id} className="strip-call" href={c.tel} aria-label={`${c.name.ar} ${c.number}`}>
            <bdi className="n" dir="ltr">{c.number}</bdi>
            <span>{c.name.ar}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

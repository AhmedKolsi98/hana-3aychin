import { EMERGENCY_CONTACTS } from '../data/sections';

/** Sticky emergency dial strip — visible on every page, one-tap tel: links. */
export default function EmergencyStrip() {
  return (
    <div className="emergency-strip" role="region" aria-label="أرقام الطوارئ">
      <div className="strip-inner">
        <span className="strip-label">طوارئ</span>
        {EMERGENCY_CONTACTS.map((c) => (
          <a key={c.number} className="strip-call" href={c.tel} aria-label={`${c.name} ${c.number}`}>
            <bdi className="n" dir="ltr">{c.number}</bdi>
            <span>{c.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

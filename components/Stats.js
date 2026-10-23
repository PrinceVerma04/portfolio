import { stats } from '@/data/site';

// Headline numbers under the hero (edit them in data/site.js).
export default function Stats() {
  return (
    <section className="container stats" aria-label="Highlights">
      {stats.map((s, i) => (
        <div key={s.label} className="stat fu" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
          <span className="stat-note">{s.note}</span>
        </div>
      ))}
    </section>
  );
}

import Image from 'next/image';
import { site, about, approach, education, achievements } from '@/data/site';

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="about-text">
        <span className="eyebrow">ABOUT</span>
        <h2 className="h2">AI that knows<br /><strong>what’s real.</strong></h2>
        {about.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
      </div>
      <div className="about-grid">
        <div className="card lift placeholder about-photo">
          <Image src={site.portrait} alt={site.name} fill sizes="(max-width: 900px) 50vw, 25vw" style={{ objectFit: 'cover', objectPosition: 'center 30%' }} />
        </div>
        <div className="card lift fact"><div className="fact-label">Based in</div><div className="fact-value">{site.location}</div></div>
        <div className="card lift fact fact--value">
          <div className="fact-label">Studied at</div>
          <div className="fact-value">IIT Hyderabad</div>
          <div className="fact-note">M.Tech, Smart Mobility · thesis on audio deepfake detection</div>
        </div>
        <div className="card lift achievements">
          <div className="fact-label">Achievements & leadership</div>
          <ul>
            {achievements.map((a) => (
              <li key={a.title}><strong>{a.title}</strong><span>{a.text}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="approach">
        <h3 className="approach-heading">How I <strong>work</strong></h3>
        <div className="approach-grid">
          {approach.map((a) => (
            <div key={a.num} className="card lift approach-card">
              <span className="skill-num mono">{a.num}</span>
              <h4>{a.title}</h4>
              <p>{a.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="approach">
        <h3 className="approach-heading">My <strong>Education</strong></h3>
        <div className="approach-grid">
          {education.map((e) => (
            <div key={e.degree} className="card lift approach-card edu-card">
              {e.logo && <span className="edu-logo"><Image src={e.logo} alt={`${e.school} logo`} width={56} height={56} /></span>}
              <div className="edu-body">
                <span className="edu-years mono">{e.years}</span>
                <h4>{e.degree}</h4>
                <p>{e.school}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

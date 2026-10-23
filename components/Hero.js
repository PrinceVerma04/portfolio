import Image from 'next/image';
import { site, heroWords, heroCopy, award } from '@/data/site';
import { ArrowIcon, Laurel } from './Icons';
import WordRotator from './WordRotator';

// A waveform drawn behind the title: a nod to the speech and deepfake research.
const BARS = [6, 14, 22, 12, 30, 44, 26, 52, 38, 20, 34, 58, 42, 24, 16, 36, 48, 28, 18, 10, 26, 40, 22, 12, 8];

export default function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-orb hero-orb--a" />
        <div className="hero-orb hero-orb--b" />
      </div>

      <div className="container hero-inner">
        <div className="hero-content">
          <span className="hero-eyebrow fu mono">
            <span className="hero-dot" aria-hidden="true" />
            {site.role} · {site.locality}
          </span>

          <h1 className="hero-title">
            <span className="hero-l1 fu d1">Hi, I’m {site.firstName}.</span>
            <span className="hero-l2 fu d2">
              <span className="hero-build">I build</span>
              <WordRotator words={heroWords} />
              <span className="sr-only">{heroWords.join(', ').replace(/\./g, '')}.</span>
            </span>
          </h1>

          <p className="hero-copy fu d3">
            {heroCopy.lead} <strong>{heroCopy.strong}</strong>
          </p>

          <div className="hero-ctas fu d4">
            <a href="/#projects" className="pill pill--glow cta-main" data-track="cta_click" data-track-label="view_my_work">
              View my work
              <span className="arrow"><ArrowIcon /></span>
            </a>
            <a href={site.resume} className="pill pill--outline cta-alt" data-track="resume_click" data-track-label="hero">Resume</a>
          </div>

          <p className="hero-tagline fu d5 mono">{heroCopy.tagline}</p>
        </div>

        <div className="hero-visual fu d2">
          <div className="hero-wave" aria-hidden="true">
            {BARS.map((h, i) => <span key={i} style={{ '--h': `${h}%`, '--i': i }} />)}
          </div>
          <div className="hero-frame">
            <span className="hero-frame-ring" aria-hidden="true" />
            <div className="hero-photo">
              <Image src={site.heroPortrait} alt={site.name} width={720} height={880} sizes="(max-width: 900px) 70vw, 34vw" priority />
            </div>
            <span className="hero-scan" aria-hidden="true" />
            <span className="hero-tag hero-tag--live mono"><span className="hero-dot" aria-hidden="true" />deepfake check: real</span>
          </div>

          <div className="award">
            <Laurel />
            <div className="award-body">
              <span className="award-year mono">{award.year}</span>
              <span className="award-title">{award.title.join(' ')}</span>
              <span className="award-sub">{award.line1} {award.line2}</span>
            </div>
            <Laurel flip />
          </div>
        </div>
      </div>
    </section>
  );
}

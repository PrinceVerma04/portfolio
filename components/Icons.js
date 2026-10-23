export function ArrowIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM8.3 18.3H5.7V9.7h2.6zM7 8.6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11.3 9.7h-2.6v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3h-2.6V9.7h2.5v1.2a2.7 2.7 0 0 1 2.5-1.4c2.7 0 3.2 1.8 3.2 4.1z" />
    </svg>
  );
}

// "P" monogram brand mark (same artwork as /public/logo.svg and the favicon in app/icon.svg).
export function LogoMark({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="pm-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5ef2c9" /><stop offset="1" stopColor="#8b7bff" /></linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#pm-grad)" />
      <path fillRule="evenodd" d="M10 7h7.5a6.5 6.5 0 0 1 0 13h-3v5H10zm4.5 4v5h3a2.5 2.5 0 0 0 0-5z" fill="#06070c" />
    </svg>
  );
}

const LEAVES = [
  [19.1, 16.7, 55], [12.2, 23.8, 33], [8.5, 33, 11],
  [8.5, 43, -11], [12.2, 52.2, -33], [19.1, 59.3, -55],
];

export function Laurel({ flip = false }) {
  return (
    <svg width="32" height="70" viewBox="0 0 34 76" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <g fill="currentColor">
        {LEAVES.map(([x, y, r]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="3" ry="7.5" transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </g>
    </svg>
  );
}

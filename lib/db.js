import { getCloudflareContext } from '@opennextjs/cloudflare';

// Cloudflare D1 (SQLite) behind a small `sql` tagged template, so queries read like
//   const rows = await sql`SELECT * FROM posts WHERE slug = ${slug}`;
// Values are always bound as parameters (never spliced into the SQL). Conversions for SQLite:
//   booleans → 1/0, Dates → ISO strings, arrays/objects → JSON text; `tags` and `draft` columns
//   come back parsed. The D1 database is the `DB` binding from wrangler.jsonc — locally that's a
//   SQLite file Wrangler keeps in .wrangler/, in production the real D1 database.

async function getDB() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.DB ?? null;
  } catch {
    return null;
  }
}

export async function dbAvailable() {
  return Boolean(await getDB());
}

function toParam(v) {
  if (v === undefined) return null;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (v instanceof Date) return v.toISOString();
  if (v !== null && typeof v === 'object') return JSON.stringify(v);
  return v;
}

const JSON_COLUMNS = ['tags', 'draft'];
function fromRow(row) {
  for (const col of JSON_COLUMNS) {
    if (typeof row[col] === 'string') {
      try { row[col] = JSON.parse(row[col]); } catch { /* leave as text */ }
    }
  }
  return row;
}

export async function sql(strings, ...values) {
  const db = await getDB();
  if (!db) throw new Error('No database available (the D1 binding "DB" is missing — run `npm run cf:config`).');
  const query = strings.reduce((q, s, i) => q + s + (i < values.length ? '?' : ''), '');
  const { results } = await db.prepare(query).bind(...values.map(toParam)).all();
  return (results || []).map(fromRow);
}

// Timestamps are stored as ISO-8601 text, which also sorts correctly.
const NOW = "(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))";

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    content_format TEXT NOT NULL DEFAULT 'markdown',
    tag TEXT NOT NULL DEFAULT 'AI',
    cover_url TEXT,
    read_time TEXT,
    views INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 0,
    published_at TEXT,
    draft TEXT,
    created_at TEXT NOT NULL DEFAULT ${NOW},
    updated_at TEXT NOT NULL DEFAULT ${NOW}
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    content_format TEXT NOT NULL DEFAULT 'markdown',
    category TEXT NOT NULL DEFAULT '',
    filter_key TEXT NOT NULL DEFAULT 'AI',
    tags TEXT NOT NULL DEFAULT '[]',
    description TEXT NOT NULL DEFAULT '',
    href TEXT NOT NULL DEFAULT '',
    link_label TEXT NOT NULL DEFAULT 'Read more ↗',
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 1,
    draft TEXT,
    created_at TEXT NOT NULL DEFAULT ${NOW}
  )`,
  // Contact form messages and newsletter sign-ups (shown in the admin's Inbox tab).
  `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT ${NOW}
  )`,
  `CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL DEFAULT ${NOW}
  )`,
  // Filter categories you manage in the admin: kind is 'project' (homepage filter tabs) or 'post' (blog topics).
  `CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    UNIQUE (kind, name)
  )`,
  // The homepage "Journey" timeline. `since` (YYYY-MM) makes the duration count up; `live` adds the pulsing dot.
  `CREATE TABLE IF NOT EXISTS journey (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    org TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '',
    dates TEXT NOT NULL DEFAULT '',
    duration TEXT NOT NULL DEFAULT '',
    since TEXT,
    live INTEGER NOT NULL DEFAULT 0,
    description TEXT NOT NULL DEFAULT '',
    logo_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT ${NOW}
  )`,
  `CREATE TABLE IF NOT EXISTS certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL DEFAULT '',
    issued TEXT NOT NULL DEFAULT '',
    credential_id TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT '',
    image_url TEXT,
    orientation TEXT NOT NULL DEFAULT 'portrait',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT ${NOW}
  )`,
  // Comments on posts and projects (target_type 'post' | 'project'). Replies point at a top-level comment
  // (one level deep). Email is optional and never shown publicly; ip_hash is a salted hash used only for rate limiting.
  `CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_type TEXT NOT NULL,
    target_id INTEGER NOT NULL,
    parent_id INTEGER,
    name TEXT NOT NULL,
    email TEXT,
    body TEXT NOT NULL,
    is_author INTEGER NOT NULL DEFAULT 0,
    hidden INTEGER NOT NULL DEFAULT 0,
    ip_hash TEXT,
    created_at TEXT NOT NULL DEFAULT ${NOW}
  )`,
  `CREATE INDEX IF NOT EXISTS comments_target ON comments (target_type, target_id)`,
  // One-off markers (e.g. "starter categories added"), so deleted starter rows never come back.
  `CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)`,
];

// Starting content, added once to a new database (then it's yours to edit or delete in the admin):
// the categories the site launched with, plus any already used by existing posts/projects, the journey timeline
// and the launch projects.
const STARTER_CATEGORIES = {
  project: ['Research', 'Computer Vision', 'AI / LLM'],
  post: ['AI', 'Speech', 'Computer Vision', 'Career'],
};

const STARTER_JOURNEY = [
  { title: 'B.Tech, Electrical Engineering', org: 'BBDNITM, Lucknow', type: 'Education', location: 'Lucknow, India', dates: '2018 – 2022', duration: 'B.Tech', logo: '/edu/bbd.webp', description: 'Where it started: electrical engineering, and my first steps into programming and machine learning.' },
  { title: 'Project Intern, Transmission Line Fault Detection', org: 'Power Grid Corporation of India (PGCIL)', type: 'Internship', location: 'Auraiya, UP', dates: 'Jan – May 2024', duration: '5 months', logo: '/journey/pgcil.webp', description: 'Used drone-captured imagery to identify and analyse faults in power transmission lines, building a consistently labelled defect dataset.' },
  { title: 'M.Tech, Smart Mobility (CSE + AI)', org: 'IIT Hyderabad', type: 'Education', location: 'Hyderabad, India', dates: '2024 – 2026', duration: 'M.Tech', logo: '/edu/iith.svg', description: 'Thesis on audio deepfake detection (SLIM-XA), plus a spoofing-aware speaker verification system for the WildSpoof Challenge at ICASSP 2026. Cleared GATE 2024 with AIR 498.' },
  { title: 'ML Engineer, Computer Vision', org: 'Coral Innovation Pvt. Ltd.', type: 'Full Time', location: 'Hyderabad, India', dates: 'Jun 2026 – Present', since: '2026-06', live: true, description: 'Trained a YOLOv8 civic-issue detector on 17,000+ images (0.78 mAP@50) and shipped it as a ~26 MB INT8 model for real-time, offline use on edge devices. Also built a detection + OCR pipeline for automated meter reading.' },
];

// The projects the site launches with (then managed in the admin like any other project).
const STARTER_PROJECTS = [
  {
    slug: 'slim-xa-audio-deepfake-detection',
    name: 'SLIM-XA: Audio Deepfake Detection',
    category: 'Research · Speech AI',
    key: 'Research',
    tags: ['PyTorch', 'Wav2Vec2-XLSR', 'Cross-Attention', 'ASVspoof 2019', 'Python'],
    description: 'My M.Tech thesis. A deepfake detector that learns how style and content naturally match in real speech, so it can spot fakes from TTS systems it has never seen.',
    href: 'https://github.com/PrinceVerma04/SLIM-with-cross-attention',
    linkLabel: 'View on GitHub ↗',
    content: `## The problem
My first CNN deepfake detector reached about 95% accuracy on attacks it had seen during training, but only about 67% on unseen ones. It had learned the fingerprints of specific generators, not what makes speech real.

## The idea
SLIM-XA extends the SLIM framework (NeurIPS 2024). Instead of a fixed distance measure, it uses a bidirectional 4-head cross-attention module that predicts style features (emotion-tuned Wav2Vec2-XLSR) from linguistic features (ASR-tuned Wav2Vec2-XLSR) and vice versa. When the prediction error is high, the speech is likely fake.

## How it works
- **Stage 1:** trained only on ~6,890 real speech samples to learn how style and content naturally match.
- **Stage 2:** trained a real/fake classifier on a 1536-dimensional, six-stream feature set, with the encoders frozen.

## Results
On the ASVspoof 2019 LA evaluation set with 13 unseen attack types: **99.98% fake-speech recall**, 73.2% accuracy and 22.37% EER, trained on 50% of the data on a single 11 GB GPU.

## What I learned
Catching fakes is only half the job. The next challenge is reducing false alarms on genuine speech.`,
  },
  {
    slug: 'agritech-ai-analyzer',
    name: 'AgriTech AI Analyzer',
    category: 'Computer Vision · Hackathon Winner',
    key: 'Computer Vision',
    tags: ['YOLOv8', 'EfficientNet', 'Random Forest', 'Grad-CAM', 'Flask', 'Docker'],
    description: 'Winner of the AgriTech AI Hackathon 2025. An AI system that helps farmers analyse crops, soil, pests and diseases, with visual explanations for every prediction.',
    content: `## Overview
Built for the AgriTech AI Hackathon 2025 (KIT Skill Hub & Pavaman Technologies), where it won first place.

## What it does
One web app that brings together multiple ML models across six agricultural areas: crop monitoring, soil classification, pest identification, disease detection, nutrient analysis and precision farming.

## Making it trustworthy
Farmers need to know why the model made a decision. I added Grad-CAM visualisations that highlight the image regions behind each prediction, along with confidence scores.

## Result
About 94% accuracy, deployed with Docker for real-time use.`,
  },
  {
    slug: 'traffic-sign-classification',
    name: 'Traffic Sign Classification for Autonomous Vehicles',
    category: 'Computer Vision · Autonomous Driving',
    key: 'Computer Vision',
    tags: ['CNN', 'TensorFlow', 'Keras', 'GTSRB', 'Python'],
    description: 'A custom CNN that recognises 43 traffic sign categories in real time, reaching 99.5% accuracy on the German Traffic Sign Recognition Benchmark.',
    content: `## Overview
A deep learning system for traffic sign classification, built to support autonomous vehicle perception and advanced driver assistance systems (ADAS).

## What I built
- A custom CNN that recognises **43 traffic sign categories** in real time.
- Trained and evaluated on the German Traffic Sign Recognition Benchmark (GTSRB).

## Result
**99.5% accuracy** on GTSRB.`,
  },
  {
    slug: 'rag-pdf-knowledge-base',
    name: 'Searchable Knowledge Base from PDFs (RAG)',
    category: 'AI / LLM · RAG',
    key: 'AI / LLM',
    tags: ['LangChain', 'FAISS', 'Hugging Face', 'Groq', 'Python'],
    description: 'A local RAG pipeline that answers natural-language questions across many PDF documents, using LangChain, Hugging Face embeddings, FAISS and Groq LLMs.',
    content: `## Overview
A local Retrieval-Augmented Generation (RAG) pipeline that lets you ask natural-language questions across multiple PDF documents.

## How it works
1. **Load and chunk** the PDFs.
2. **Embed** each chunk with Hugging Face embeddings and store them in a FAISS index.
3. **Retrieve** the most relevant chunks with vector similarity search.
4. **Answer** with a Groq-hosted LLM, grounded in the retrieved content.

## Result
Accurate, context-aware answers across many documents, running locally.`,
  },
];

const COLUMN_UPGRADES = [
  `ALTER TABLE certifications ADD COLUMN orientation TEXT NOT NULL DEFAULT 'portrait'`,
  `ALTER TABLE posts ADD COLUMN content_format TEXT NOT NULL DEFAULT 'markdown'`,
  `ALTER TABLE projects ADD COLUMN content_format TEXT NOT NULL DEFAULT 'markdown'`,
];

const once = (key) => `NOT EXISTS (SELECT 1 FROM meta WHERE key = '${key}')`;

function starterStatements(db) {
  const stmts = [];
  for (const [kind, names] of Object.entries(STARTER_CATEGORIES)) {
    names.forEach((name, i) => stmts.push(db.prepare(
      `INSERT OR IGNORE INTO categories (kind, name, sort_order) SELECT ?, ?, ? WHERE ${once('starter_categories')}`).bind(kind, name, i)));
  }
  stmts.push(db.prepare(`INSERT OR IGNORE INTO categories (kind, name, sort_order)
    SELECT 'post', tag, 100 FROM posts WHERE tag <> '' AND ${once('starter_categories')} GROUP BY tag`));
  stmts.push(db.prepare(`INSERT OR IGNORE INTO categories (kind, name, sort_order)
    SELECT 'project', filter_key, 100 FROM projects WHERE filter_key <> '' AND ${once('starter_categories')} GROUP BY filter_key`));
  stmts.push(db.prepare(`INSERT OR IGNORE INTO meta (key, value) VALUES ('starter_categories', '1')`));

  STARTER_JOURNEY.forEach((e, i) => stmts.push(db.prepare(
    `INSERT INTO journey (title, org, type, location, dates, duration, since, live, description, logo_url, sort_order)
     SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE ${once('starter_journey')}`)
    .bind(e.title, e.org, e.type, e.location, e.dates, e.duration || '', e.since || null, e.live ? 1 : 0, e.description, e.logo || null, (i + 1) * 10)));
  stmts.push(db.prepare(`INSERT OR IGNORE INTO meta (key, value) VALUES ('starter_journey', '1')`));

  STARTER_PROJECTS.forEach((p, i) => stmts.push(db.prepare(
    `INSERT OR IGNORE INTO projects (slug, name, content, category, filter_key, tags, description, href, link_label, sort_order, published)
     SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1 WHERE ${once('starter_projects')}`)
    .bind(p.slug, p.name, p.content, p.category, p.key, JSON.stringify(p.tags), p.description, p.href || '', p.linkLabel || 'Read more ↗', (i + 1) * 10)));
  stmts.push(db.prepare(`INSERT OR IGNORE INTO meta (key, value) VALUES ('starter_projects', '1')`));
  return stmts;
}

let ready;

// Bump this whenever SCHEMA, the starter rows or COLUMN_UPGRADES change. A database already at this version
// skips the setup entirely, so a fresh Worker instance costs one quick query instead of ~30 statements.
const SCHEMA_VERSION = '8';

// Creates the tables on first use (once per Worker instance), so there's no separate migration step.
export function ensureSchema() {
  ready ??= (async () => {
    const db = await getDB();
    if (!db) return;
    try {
      const row = await db.prepare(`SELECT value FROM meta WHERE key = 'schema_version'`).first();
      if (row?.value === SCHEMA_VERSION) return;
    } catch {
      // No meta table yet (brand-new database): run the full setup below.
    }
    await db.batch(SCHEMA.map((s) => db.prepare(s)));
    await db.batch(starterStatements(db));
    // Columns added after a table was first created (SQLite has no ADD COLUMN IF NOT EXISTS).
    for (const stmt of COLUMN_UPGRADES) {
      try { await db.prepare(stmt).run(); } catch (err) { if (!/duplicate column/i.test(err.message)) throw err; }
    }
    await db.prepare(`INSERT OR REPLACE INTO meta (key, value) VALUES ('schema_version', ?)`).bind(SCHEMA_VERSION).run();
  })().catch((err) => { ready = undefined; throw err; });
  return ready;
}

// ---------- Page cache version ----------
// Public pages are cached at Cloudflare's edge (see worker.js). Every content change bumps this number, which
// changes the cache key, so visitors get fresh pages right away. Cheap: one tiny write.
export async function bumpContentVersion() {
  const db = await getDB();
  if (!db) return;
  try {
    await db.prepare(`INSERT INTO meta (key, value) VALUES ('content_version', '1')
      ON CONFLICT (key) DO UPDATE SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT)`).run();
  } catch (err) {
    console.error('bumpContentVersion failed', err);
  }
}

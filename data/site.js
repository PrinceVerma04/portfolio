// All portfolio content lives here — edit this file to update the site.

export const site = {
  name: 'Prince Verma',
  shortName: 'PRINCE',
  firstName: 'Prince',
  role: 'ML Engineer',
  location: 'Hyderabad, India',
  locality: 'Hyderabad',
  region: 'Telangana',
  email: 'tovermaprince@gmail.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description:
    'Prince Verma is an ML Engineer and IIT Hyderabad M.Tech graduate building trustworthy AI: deepfake detection, computer vision and LLM agents.',
  github: 'https://github.com/PrinceVerma04',
  linkedin: 'https://www.linkedin.com/in/princeverma0411/',
  instagram: 'https://www.instagram.com/ig.prince04',
  resume: '/resume.pdf',
  // About-section photo and the hero photo.
  portrait: '/about.webp',
  heroPortrait: '/portrait-hero.webp',
  // Search keywords (also used for the page's <meta name="keywords">).
  keywords: ['Prince Verma', 'Prince IITH', 'Princeiithvlogs', 'ML Engineer', 'Machine Learning Engineer', 'IIT Hyderabad', 'IITH', 'Audio deepfake detection', 'Computer vision', 'LLM agents', 'RAG', 'Hyderabad'],
};

// Rotating words in the hero: "I build …"
export const heroWords = ['deepfake detectors.', 'AI agents.', 'RAG pipelines.', 'vision models.', 'edge AI apps.', 'voice AI.', 'trustworthy AI.'];

// Short lines under the hero title.
export const heroCopy = {
  lead: 'Machine learning engineer building AI that can tell what’s real,',
  strong: 'and keeps working when the real world changes.',
  tagline: 'ML Engineer at Coral Innovation · M.Tech, IIT Hyderabad',
};

// Headline numbers shown under the hero.
export const stats = [
  { value: '99.98%', label: 'fake-speech recall', note: 'SLIM-XA on 13 unseen attack types' },
  { value: '17k+', label: 'images trained on', note: 'YOLOv8 civic-issue detector, ~26 MB on device' },
  { value: 'AIR 498', label: 'GATE 2024', note: 'All India Rank' },
  { value: '1st', label: 'AgriTech AI Hackathon', note: '2025 winner' },
];

// About section text (also used in /llms.txt for AI assistants).
export const about = [
  'I completed my M.Tech in Smart Mobility at IIT Hyderabad (2024–2026), working at the intersection of speech, computer vision and large language models. My core interest is trustworthy AI: building systems that can tell what is real, and that keep working when the real world looks different from the training data.',
  'My thesis focuses on audio deepfake detection. I started with a CNN detector that reached about 95% accuracy on known attacks but only about 67% on unseen ones, and that gap shaped my research. I then built SLIM-XA, a cross-attention extension of the SLIM framework that learns the natural match between speaking style and linguistic content from real speech only. I also built a spoofing-aware speaker verification system for the WildSpoof Challenge at ICASSP 2026.',
  'Outside research, I’ve shipped practical AI. At Coral Innovation I trained a YOLOv8 civic-issue detector on 17,000+ images and compressed it to a ~26 MB INT8 model for real-time, offline use on edge devices. I’ve also built RAG assistants, agentic chatbots, and an AgriTech system that won the AgriTech AI Hackathon 2025.',
];

export const award = {
  year: '2025',
  title: ['AgriTech AI', 'Hackathon', 'Winner'],
  line1: 'KIT Skill Hub &',
  line2: 'Pavaman Technologies',
};

export const marquee = ['Python', 'PyTorch', 'TensorFlow', 'Hugging Face', 'OpenCV', 'YOLOv8', 'LangChain', 'LangGraph', 'FAISS', 'FastAPI', 'Flask', 'Docker', 'Streamlit', 'TensorFlow Lite', 'Git'];

export const approach = [
  { num: '01', title: 'Test on what the model hasn’t seen.', text: 'High accuracy on familiar data can hide failure. I evaluate on unseen conditions first.' },
  { num: '02', title: 'Fix the data before the model.', text: 'Cleaning thousands of mislabeled samples often helps more than a new architecture.' },
  { num: '03', title: 'Build it to run in the real world.', text: 'I care about latency, size and offline use, not just benchmark scores.' },
];

export const education = [
  { years: '2024 – 2026', degree: 'M.Tech, Smart Mobility (CSE + AI)', school: 'Indian Institute of Technology Hyderabad', logo: '/edu/iith.svg' },
  { years: '2018 – 2022', degree: 'B.Tech, Electrical Engineering', school: 'BBDNITM, Lucknow', logo: '/edu/bbd.webp' },
];

export const achievements = [
  { title: 'GATE 2024', text: 'All India Rank 498' },
  { title: 'Winner, AgriTech AI Hackathon 2025', text: 'KIT Skill Hub & Pavaman Technologies' },
  { title: 'Head, Volunteer Coordinating Unit', text: 'Prayas Club, IIT Hyderabad' },
  { title: 'Coordinator, Alumni Relation Cell', text: 'Ideation and Operations, IIT Hyderabad' },
];

export const skillGroups = [
  { num: '01', title: 'AI / LLM', items: ['LLM APIs', 'Prompt Engineering', 'RAG Pipelines', 'LangChain', 'LangGraph', 'AI Agents & Agentic Workflows', 'Hallucination Mitigation', 'Groq', 'NVIDIA NIM'] },
  { num: '02', title: 'Speech & Audio', items: ['Audio Deepfake Detection', 'Spoofing-Aware Speaker Verification', 'Wav2Vec2-XLSR', 'x-vectors', 'MFCC & Spectral Features', 'ASVspoof Evaluation (EER, a-DCF)'] },
  { num: '03', title: 'Deep Learning & Computer Vision', items: ['PyTorch', 'TensorFlow', 'Keras', 'Transformers', 'CNN', 'YOLOv8', 'EfficientNet', 'ResNet', 'Grad-CAM', 'OCR', 'Transfer Learning'] },
  { num: '04', title: 'Deployment & Tools', items: ['FastAPI', 'Flask', 'Streamlit', 'Docker', 'REST APIs', 'TFLite (INT8)', 'Git/GitHub', 'Linux'] },
  { num: '05', title: 'Data & Analytics', items: ['Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Seaborn', 'Feature Engineering', 'Statistical Modeling', 'Metrics Definition'] },
  { num: '06', title: 'Languages', items: ['Python', 'SQL', 'C', 'C++', 'MATLAB', 'Bash'] },
];

export function slugify(s) {
  return s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

export function formatViews(n) {
  return `${n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : n} views`;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'content-production' | 'creative-design' | 'digital-build' | 'creator-tech';
  categoryLabel: string;
  service: string;
  serviceSlug: string;
  description: string;
  thumbnail: string;
  aspectRatio?: '16/9' | '9/16' | '1/1' | '4/3';
  clientName?: string;
  projectUrl?: string;
  date: string;
  isPlaceholder: boolean; // Explicitly labelled
  tags: string[];
  specs?: { label: string; value: string }[];
}

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-01',
    title: 'Surreal Liquid Kinetic Ad [Spec Concept]',
    category: 'content-production',
    categoryLabel: 'Content Production',
    service: 'CGI Ads',
    serviceSlug: 'cgi-ads',
    description: '3D simulation study exploring fluid dynamics and subsurface scattering under neon lighting for a beverage concept.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16/9',
    clientName: '[Studio Portfolio Concept — Concept Work]',
    date: '2026',
    isPlaceholder: true,
    tags: ['3D CGI', 'Cinema 4D', 'Octane Render', 'Fluid Sim'],
    specs: [
      { label: 'Render Engine', value: 'Octane / Blender Cycles' },
      { label: 'Resolution', value: '4K Ultra HD (3840×2160)' },
      { label: 'Format', value: '16:9 Landscape & 9:16 Reel' },
    ],
  },
  {
    id: 'port-02',
    title: 'Minimalist Creator Studio Portfolio [Concept Preview]',
    category: 'digital-build',
    categoryLabel: 'Digital Build',
    service: 'Web Development',
    serviceSlug: 'web-development',
    description: 'Editorial single-page web experience showcasing responsive typography, dark/light contrast, and instant loading times.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16/9',
    clientName: '[Concept Prototype — Showcase Placeholder]',
    date: '2026',
    isPlaceholder: true,
    tags: ['TypeScript', 'Tailwind CSS', 'Responsive UI', 'Next.js'],
    specs: [
      { label: 'Performance', value: '100 / 100 Lighthouse' },
      { label: 'Stack', value: 'React / Vite / Tailwind' },
      { label: 'Deployment', value: 'Edge CDN' },
    ],
  },
  {
    id: 'port-03',
    title: 'Historical Archive Documentary Cut [Editorial Study]',
    category: 'content-production',
    categoryLabel: 'Content Production',
    service: 'Documentary / YouTube Video',
    serviceSlug: 'documentary',
    description: 'Paper-edit pacing, archival sound restoration, and multi-layered chapter transitions designed for 45-minute viewer retention.',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16/9',
    clientName: '[Narrative Edit Demo — Internal Case Study]',
    date: '2026',
    isPlaceholder: true,
    tags: ['Documentary', 'Sound Design', 'DaVinci Resolve', 'Pacing'],
    specs: [
      { label: 'Audio Mix', value: 'Stereo -14 LUFS Normalized' },
      { label: 'Color Grade', value: 'Kodak 2383 Print Film Emulation' },
      { label: 'Length', value: '12 min demonstration reel' },
    ],
  },
  {
    id: 'port-04',
    title: 'High-Contrast Optical Thumbnails [CTR Experiment]',
    category: 'creative-design',
    categoryLabel: 'Creative Design',
    service: 'Graphic Design',
    serviceSlug: 'graphic-design',
    description: 'Visual hierarchy testing emphasizing human facial expression, rim lighting, and instant 10% mobile view legibility.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16/9',
    clientName: '[CTR Benchmark Grid — Demonstration Asset]',
    date: '2026',
    isPlaceholder: true,
    tags: ['Thumbnail', 'Visual Hierarchy', 'Photoshop', 'CTR Testing'],
    specs: [
      { label: 'Mobile Test', value: 'Readable at 80px width' },
      { label: 'Color Space', value: 'sRGB High Gamut' },
      { label: 'File Size', value: '< 2MB Optimized' },
    ],
  },
  {
    id: 'port-05',
    title: 'Architectural Generative Stills [Style Consistency Run]',
    category: 'creative-design',
    categoryLabel: 'Creative Design',
    service: 'AI Image Creation',
    serviceSlug: 'ai-images',
    description: 'Generative diffusion batch tuned for warm concrete textures, dramatic natural skylights, and zero warped geometry.',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16/9',
    clientName: '[Visual Research Series — Generative Showcase]',
    date: '2026',
    isPlaceholder: true,
    tags: ['AI Imagery', 'Midjourney v6', 'Upscaling', 'Editorial'],
    specs: [
      { label: 'Native Output', value: '8192 × 4608 px' },
      { label: 'Correction', value: 'Digital inpainting pass completed' },
      { label: 'Tone', value: 'Brutalist Warm Minimal' },
    ],
  },
  {
    id: 'port-06',
    title: 'Workstation Low-Latency Optimization [Rig Profile]',
    category: 'creator-tech',
    categoryLabel: 'Creator Tech',
    service: 'PC Optimization',
    serviceSlug: 'pc-optimization',
    description: 'Kernel latency reduction, OBS hardware NVENC dual-pass profiling, and memory timing calibration for live streaming.',
    thumbnail: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16/9',
    clientName: '[Benchmark Spec — Lab Test Rig]',
    date: '2026',
    isPlaceholder: true,
    tags: ['PC Tuning', 'Latency Benchmark', 'OBS Studio', 'Premiere Pro'],
    specs: [
      { label: 'DPC Latency', value: 'Reduced from 850µs to 42µs' },
      { label: 'Render Time', value: '28% decrease on 4K ProRes export' },
      { label: 'Dropped Frames', value: '0.00% across 6-hr test run' },
    ],
  },
];

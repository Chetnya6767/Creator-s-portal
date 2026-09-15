export interface ServicePackage {
  id: string;
  name: string;
  price: number | null; // null means "Contact Us" or custom quote
  priceDisplay: string;
  unit?: string; // e.g., "/minute", "/image", "/month", "/video"
  description?: string;
  popular?: boolean;
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  categoryId: 'content-production' | 'creative-design' | 'digital-build' | 'creator-tech';
  categoryName: string;
  shortDesc: string;
  heroHeadline: string;
  heroSubtext: string;
  startingPriceDisplay: string;
  packages: ServicePackage[];
  whatWeDo: string[];
  deliverables: string[];
  processSteps: { step: string; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

export interface ServiceCategory {
  id: 'content-production' | 'creative-design' | 'digital-build' | 'creator-tech';
  number: string;
  name: string;
  tagline: string;
  description: string;
  services: ServiceItem[];
}

export const INITIAL_SERVICES: ServiceItem[] = [
  // CATEGORY 01: CONTENT PRODUCTION
  {
    id: 'cgi-ads',
    slug: 'cgi-ads',
    name: 'CGI Ads',
    categoryId: 'content-production',
    categoryName: 'Content Production',
    shortDesc: 'Hyper-realistic 3D product visuals and surreal brand spots engineered for social feed engagement.',
    heroHeadline: 'Surreal 3D and CGI Commercials That Stop the Feed.',
    heroSubtext: 'From impossible physics to flawless product visualization, we construct CGI commercials that elevate brand perception.',
    startingPriceDisplay: 'From ₹1,499',
    packages: [
      {
        id: 'cgi-1-ad',
        name: '1 CGI Ad',
        price: 1499,
        priceDisplay: '₹1,499',
        description: 'Single high-impact 3D commercial or surreal product spot up to 15 seconds.',
      },
      {
        id: 'cgi-10-ad-combo',
        name: '10 Ad Combo',
        price: 9999,
        priceDisplay: '₹9,999',
        popular: true,
        description: 'Comprehensive suite of 10 CGI variations, colorways, and framing formats.',
      },
    ],
    whatWeDo: [
      'Concept framing and 3D storyboard drafting',
      'Realistic material texturing and cinematic lighting',
      'Fluid physics, dynamics, and atmospheric particle effects',
      'Master grade sound design and final color delivery',
    ],
    deliverables: [
      'Final render in 9:16 (Vertical) and 16:9 (Horizontal)',
      'High-bitrate ProRes and optimized MP4 masters',
      'Clean audio mix and separated sound stems',
    ],
    processSteps: [
      { step: '01', title: 'Asset & Concept Brief', desc: 'You provide product photos, 3D CAD files, or reference links.' },
      { step: '02', title: 'Styleframe & Motion Test', desc: 'We deliver camera angles and lighting preview for approval.' },
      { step: '03', title: 'High-Res Rendering', desc: 'We run full ray-traced rendering and physics simulations.' },
      { step: '04', title: 'Final Delivery', desc: 'Sound design added and final multi-format packages delivered.' },
    ],
    faqs: [
      {
        question: 'What do I need to supply to begin a CGI ad?',
        answer: 'High-resolution photos of your product from multiple angles or an existing 3D model if available. If you only have sketches or a physical product, we can model it from scratch.',
      },
      {
        question: 'What is the standard turnaround time?',
        answer: 'Standard 1-Ad packages typically take 3 to 5 business days. The 10-Ad bundle is staggered over 10 to 14 days.',
      },
    ],
  },
  {
    id: 'documentary',
    slug: 'documentary',
    name: 'Documentary / YouTube Video',
    categoryId: 'content-production',
    categoryName: 'Content Production',
    shortDesc: 'Narrative-driven story editing, pacing, research cuts, and immersive documentary style videos.',
    heroHeadline: 'Immersive Storytelling for Long-Form Creators.',
    heroSubtext: 'Transform raw footage and scripts into captivating documentary pieces with cinematic pacing and narrative depth.',
    startingPriceDisplay: 'From ₹149/min',
    packages: [
      {
        id: 'doc-longform',
        name: 'Long-form',
        price: 149,
        priceDisplay: '₹149',
        unit: '/minute',
        description: 'In-depth documentary pacing, archival integration, soundscaping, and chapter scoring.',
      },
      {
        id: 'doc-shortform',
        name: 'Short-form',
        price: 199,
        priceDisplay: '₹199',
        unit: '/video',
        description: 'Paced for high-retention 0–60 second vertical storytelling.',
      },
      {
        id: 'doc-10x10',
        name: '10 × 10-minute Videos',
        price: 7999,
        priceDisplay: '₹7,999',
        popular: true,
        description: 'Complete production suite of ten full 10-minute episodes.',
      },
      {
        id: 'doc-monthly-combo',
        name: 'Monthly Combo',
        price: 1999,
        priceDisplay: 'Starting at ₹1,999/month',
        description: 'Starting at ₹1,999/month recurring partnership for consistent documentary releases.',
      },
    ],
    whatWeDo: [
      'Storyline structure, paper edit, and beat mapping',
      'Archival footage sourcing, historical asset restoration',
      'Dynamic typography, maps, and paper-cut animations',
      'Original sound design and multi-layered scoring',
    ],
    deliverables: [
      'Full 4K/1080p master render',
      'Subtitles (.SRT) and chapter marker lists',
      'Thumbnail-ready hero frame stills',
    ],
    processSteps: [
      { step: '01', title: 'Script & Raw Footage Sync', desc: 'Upload your A-roll, voiceover, and script notes.' },
      { step: '02', title: 'Radio Cut & Assembly', desc: 'We lock the narrative structure and pace first.' },
      { step: '03', title: 'B-Roll & Animation Layering', desc: 'Documentary animations, sound effects, and motion graphics are applied.' },
      { step: '04', title: 'Sound Mix & Master', desc: 'Loudness normalization for YouTube and master export.' },
    ],
    faqs: [
      {
        question: 'How is the per-minute rate calculated?',
        answer: 'The rate is calculated based on the final runtime of the approved video cut.',
      },
      {
        question: 'Do you source archival material and licensing?',
        answer: 'Yes, we handle sourcing of public domain and licensed stock footage fitting your documentary topic.',
      },
    ],
  },
  {
    id: 'video-editing',
    slug: 'video-editing',
    name: 'Video Editing',
    categoryId: 'content-production',
    categoryName: 'Content Production',
    shortDesc: 'High-retention editing for modern digital creators, YouTube episodes, podcasts, and shorts.',
    heroHeadline: 'Sharp, High-Retention Edits Built for Growth.',
    heroSubtext: 'From fast-paced vlogs to podcasts and social reels, we eliminate friction and keep viewers locked in.',
    startingPriceDisplay: 'From ₹89',
    packages: [
      {
        id: 'video-shortform',
        name: 'Short-form',
        price: 89,
        priceDisplay: '₹89',
        unit: '/video',
        description: 'Fast-paced Reels, Shorts, and TikTok cuts with animated captions and kinetic graphics.',
      },
      {
        id: 'video-longform',
        name: 'Long-form',
        price: 99,
        priceDisplay: '₹99',
        unit: '/minute',
        description: 'Comprehensive YouTube episode assembly, multicam cutting, and color pass.',
      },
    ],
    whatWeDo: [
      'Dead air removal and pacing optimization',
      'Engaging zoom-ins, callouts, and motion text',
      'Audio leveling, compression, and vocal cleaning',
      'Color correction and custom look application',
    ],
    deliverables: [
      'Ready-to-publish vertical (9:16) or horizontal (16:9) files',
      'Exported burned-in or standalone subtitle files',
    ],
    processSteps: [
      { step: '01', title: 'Upload Raw Files', desc: 'Send your footage, brief, and pacing preferences.' },
      { step: '02', title: 'First Cut Review', desc: 'Review the draft directly inside our client portal.' },
      { step: '03', title: 'Refinement Pass', desc: 'Any required tweaks applied within 24 hours.' },
      { step: '04', title: 'Master Delivery', desc: 'Instant high-speed download ready to schedule.' },
    ],
    faqs: [
      {
        question: 'How many revisions are included?',
        answer: 'Every order includes two rounds of focused revisions through your client portal.',
      },
      {
        question: 'What software do you use?',
        answer: 'We work primarily in Adobe Premiere Pro, DaVinci Resolve Studio, and After Effects.',
      },
    ],
  },
  {
    id: 'motion-graphics',
    slug: 'motion-graphics',
    name: 'Motion Graphics',
    categoryId: 'content-production',
    categoryName: 'Content Production',
    shortDesc: 'Kinetic typography, animated lower thirds, stream overlays, UI animations, and title sequences.',
    heroHeadline: 'Kinetic Graphics That Bring Identity to Life.',
    heroSubtext: 'Custom motion kits, animated channel branding, product feature animations, and logo idents.',
    startingPriceDisplay: 'Contact Us',
    packages: [
      {
        id: 'motion-custom',
        name: 'Custom Motion Package',
        price: null,
        priceDisplay: 'Contact Us',
        description: 'Tailored motion identity, title cards, UI mockups, or modular streaming packages.',
      },
    ],
    whatWeDo: [
      'Channel package creation (intros, stingers, lower-thirds)',
      'UI/UX product interaction showcases',
      'Vector 2D animation and kinetic text layouts',
      'Transparent alpha channel overlays (ProRes 4444)',
    ],
    deliverables: [
      'MOGRT templates or ProRes 4444 video files with alpha',
      'Lottie (JSON) files for web and app integration',
    ],
    processSteps: [
      { step: '01', title: 'Style Alignment', desc: 'We assess your brand font, color palette, and vibe.' },
      { step: '02', title: 'Vector Storyboard', desc: 'Static art boards defining each transition moment.' },
      { step: '03', title: 'Motion Prototyping', desc: 'Full easing, keyframing, and motion blur integration.' },
      { step: '04', title: 'Package Packaging', desc: 'Delivered in multi-format packs with documentation.' },
    ],
    faqs: [
      {
        question: 'Can you provide editable Premiere/After Effects templates?',
        answer: 'Yes, we can package motion assets as editable .mogrt files for your in-house team.',
      },
    ],
  },

  // CATEGORY 02: CREATIVE DESIGN
  {
    id: 'ai-images',
    slug: 'ai-images',
    name: 'AI Image Creation',
    categoryId: 'creative-design',
    categoryName: 'Creative Design',
    shortDesc: 'Prompt-engineered bespoke visual art, character consistency, editorial stills, and concept mockups.',
    heroHeadline: 'Art-Directed Generative Visuals Without the Artifacts.',
    heroSubtext: 'We combine state-of-the-art diffusion models with manual digital touchups to produce publication-ready imagery.',
    startingPriceDisplay: 'From ₹100',
    packages: [
      {
        id: 'ai-simple',
        name: 'Simple',
        price: 100,
        priceDisplay: '₹100',
        unit: '/image',
        description: 'Single subject concept generation with basic background and composition.',
      },
      {
        id: 'ai-medium',
        name: 'Medium',
        price: 250,
        priceDisplay: '₹250',
        unit: '/image',
        description: 'Art-directed scene with prompt refinement, lighting control, and high-res upscaling.',
      },
      {
        id: 'ai-pro',
        name: 'Pro',
        price: 400,
        priceDisplay: '₹400',
        unit: '/image',
        description: 'Complex multi-element scene, digital retouching pass, face and hand corrections.',
      },
      {
        id: 'ai-fast-pro',
        name: 'Fast Pro',
        price: 500,
        priceDisplay: '₹500',
        unit: '/image',
        popular: true,
        description: 'Priority queue turnaround with multi-variation exploration and 8K master output.',
      },
    ],
    whatWeDo: [
      'Advanced prompt engineering and seed parameter tuning',
      'Consistent character styling and facial preservation',
      'Photoshop in-painting, cleanup, and artifact removal',
      'Lossless ultra-high resolution upscaling up to 8K',
    ],
    deliverables: [
      'High-resolution PNG/TIFF digital master files',
      'Commercial usage license clearance',
    ],
    processSteps: [
      { step: '01', title: 'Creative Prompt Brief', desc: 'Tell us the visual tone, lighting, and composition required.' },
      { step: '02', title: 'Generative Exploration', desc: 'We run multiple batches and isolate the top candidates.' },
      { step: '03', title: 'Digital Retouching', desc: 'Hand touchup removes anatomical errors and enhances clarity.' },
      { step: '04', title: 'Master Delivery', desc: 'Delivered in crystal-clear print and web dimensions.' },
    ],
    faqs: [
      {
        question: 'Do I get full commercial rights to the generated images?',
        answer: 'Yes, all delivered imagery includes full commercial rights for your brand and channels.',
      },
    ],
  },
  {
    id: 'graphic-design',
    slug: 'graphic-design',
    name: 'Graphic Design',
    categoryId: 'creative-design',
    categoryName: 'Creative Design',
    shortDesc: 'High-clickrate YouTube thumbnails, social post carousels, reel covers, and print identity.',
    heroHeadline: 'High-Converting Visuals That Demand Attention.',
    heroSubtext: 'Every pixel engineered for optical weight, contrast balance, and maximum click-through rate.',
    startingPriceDisplay: 'From ₹250',
    packages: [
      {
        id: 'design-post',
        name: 'Post Design',
        price: 250,
        priceDisplay: '₹250',
        description: 'Single high-impact Instagram, LinkedIn, or Twitter graphic.',
      },
      {
        id: 'design-reel-cover',
        name: 'Reel Cover',
        price: 400,
        priceDisplay: '₹400',
        description: 'Clean, scroll-stopping cover graphic optimized for profile grids.',
      },
      {
        id: 'design-thumbnail',
        name: 'Thumbnail',
        price: 500,
        priceDisplay: '₹500',
        popular: true,
        description: 'High CTR YouTube thumbnail with optical emphasis and emotion framing.',
      },
      {
        id: 'design-biz-card',
        name: 'Business Card',
        price: 500,
        priceDisplay: '₹500',
        description: 'Minimalist double-sided business card layout with print-ready bleeds.',
      },
      {
        id: 'design-visiting-card',
        name: 'Visiting Card',
        price: null,
        priceDisplay: 'Contact Us',
        description: 'Bespoke executive card design, specialty finishes (emboss, foil, letterpress).',
      },
    ],
    whatWeDo: [
      'Visual hierarchy and focal point engineering',
      'Subject cutouts, edge smoothing, and rim-lighting',
      'Custom typographic styling tailored to your genre',
      'Color psychology calibration for feed contrast',
    ],
    deliverables: [
      'Optimized WebP / PNG / JPG formats',
      'Vector PDF and source PSD files upon request',
    ],
    processSteps: [
      { step: '01', title: 'Content Context', desc: 'Share your video title, hook, or design objective.' },
      { step: '02', title: 'Concept Sketch', desc: 'We test 2 distinct conceptual layouts for impact.' },
      { step: '03', title: 'Visual Polish', desc: 'High-fidelity lighting, typography, and contrast adjustment.' },
      { step: '04', title: 'A/B Ready Files', desc: 'Final ready-to-upload files sent straight to your dashboard.' },
    ],
    faqs: [
      {
        question: 'Do you test thumbnails for readability on mobile?',
        answer: 'Yes, every thumbnail is previewed at 10% mobile scale to verify the focal subject and title stand out instantly.',
      },
    ],
  },

  // CATEGORY 03: DIGITAL BUILD
  {
    id: 'web-development',
    slug: 'web-development',
    name: 'Web Development',
    categoryId: 'digital-build',
    categoryName: 'Digital Build',
    shortDesc: 'Fast, responsive, editorial websites for creators, studios, digital brands, and product drops.',
    heroHeadline: 'Fast, Minimal, Conversion-Focused Web Architecture.',
    heroSubtext: 'We build digital spaces that position your brand at the absolute top of your industry without generic templates.',
    startingPriceDisplay: 'From ₹3,999',
    packages: [
      {
        id: 'web-single-page',
        name: 'Single Page',
        price: 3999,
        priceDisplay: '₹3,999',
        description: 'Complete high-converting single-page landing site with responsive mobile layout.',
      },
      {
        id: 'web-2-pages',
        name: '2 Pages',
        price: 4999,
        priceDisplay: '₹4,999',
        description: 'Two structured pages (e.g., Home + Services or Case Studies).',
      },
      {
        id: 'web-3-pages',
        name: '3 Pages',
        price: 6999,
        priceDisplay: '₹6,999',
        popular: true,
        description: 'Comprehensive 3-page studio setup (Home, Services, Contact/Portfolio).',
      },
      {
        id: 'web-multi-page',
        name: 'Multi Page',
        price: 9999,
        priceDisplay: '₹9,999',
        description: 'Extensive multi-page architecture with dynamic CMS, forms, and custom routing.',
      },
    ],
    whatWeDo: [
      'Responsive mobile-first engineering across all screen widths',
      'Clean typography and performance optimization (100% Lighthouse score)',
      'Custom contact forms, analytics, and CRM webhook hookups',
      'SEO meta-tags, Open Graph previews, and semantic markup',
    ],
    deliverables: [
      'Production-ready code and live deployment setup',
      'Domain configuration and SSL certificate integration',
      'Centralized documentation for content updates',
    ],
    processSteps: [
      { step: '01', title: 'Content & Flow Mapping', desc: 'We align on navigation, messaging hierarchy, and calls to action.' },
      { step: '02', title: 'Design Prototype', desc: 'High-fidelity design reviewed for desktop and mobile.' },
      { step: '03', title: 'Full Stack Build', desc: 'Modern TypeScript, responsive CSS, and API integrations.' },
      { step: '04', title: 'Testing & Launch', desc: 'Speed audits, form verification, and domain launch.' },
    ],
    faqs: [
      {
        question: 'Will my website work smoothly on all phone screens?',
        answer: 'Yes, every project is thoroughly tested from 320px mobile screens up to 4K ultra-wide displays.',
      },
    ],
  },
  {
    id: 'app-development',
    slug: 'app-development',
    name: 'App Development',
    categoryId: 'digital-build',
    categoryName: 'Digital Build',
    shortDesc: 'Custom cross-platform web applications, creator tools, client portals, and bespoke SaaS platforms.',
    heroHeadline: 'Bespoke Digital Products and Creator Tools.',
    heroSubtext: 'Turn workflows, communities, or digital tools into reliable, production-grade applications.',
    startingPriceDisplay: 'Contact Us',
    packages: [
      {
        id: 'app-custom',
        name: 'Custom Application Build',
        price: null,
        priceDisplay: 'Contact Us',
        description: 'Full stack architecture scoped specifically around your product roadmap and user requirements.',
      },
    ],
    whatWeDo: [
      'Database schema engineering and cloud infrastructure',
      'User authentication, role-based access control, and dashboards',
      'REST/GraphQL API endpoints and third-party webhooks',
      'Intuitive user interfaces built with React and TypeScript',
    ],
    deliverables: [
      'Full source code repository with CI/CD deployment pipeline',
      'Cloud hosting configuration and production database setup',
      'Developer handoff and admin management manuals',
    ],
    processSteps: [
      { step: '01', title: 'Scope & Architecture', desc: 'Detailed user stories, database models, and API blueprints.' },
      { step: '02', title: 'Interactive Prototype', desc: 'Clickable wireframes and UX verification.' },
      { step: '03', title: 'Iterative Engineering', desc: 'Sprint-based builds with staging preview environments.' },
      { step: '04', title: 'Production Rollout', desc: 'Security audit, performance testing, and production deployment.' },
    ],
    faqs: [
      {
        question: 'Do you provide maintenance and ongoing updates?',
        answer: 'Yes, we offer ongoing maintenance and feature sprint packages after initial rollout.',
      },
    ],
  },

  // CATEGORY 04: CREATOR TECH
  {
    id: 'pc-optimization',
    slug: 'pc-optimization',
    name: 'PC Optimization',
    categoryId: 'creator-tech',
    categoryName: 'Creator Tech',
    shortDesc: 'Remote performance tuning for editing rigs, OBS streaming setups, latency reduction, and render speeds.',
    heroHeadline: 'Maximize Frame Rates, Render Speeds & Stream Stability.',
    heroSubtext: 'Eliminate render crashes, stuttering timelines, and encoding lag with specialized workstation optimization.',
    startingPriceDisplay: 'Contact Us',
    packages: [
      {
        id: 'pc-custom',
        name: 'Full Rig Optimization',
        price: null,
        priceDisplay: 'Contact Us',
        description: 'Comprehensive 1-on-1 remote tuning session covering OS, GPU drivers, BIOS, and video software.',
      },
    ],
    whatWeDo: [
      'Windows clean-up, bloatware removal, and background latency reduction',
      'GPU driver profiling, thermal calibration, and stable overclock/undervolt',
      'Premiere Pro, DaVinci Resolve, and Blender cache/scratch disk setup',
      'OBS Studio encoder tuning for 0-drop framedrops on Twitch/YouTube',
    ],
    deliverables: [
      'Benchmarking report showing before vs. after render times and latency',
      'Pre-configured OBS profiles and video editor settings backup',
      'Recovery restore points and optimization maintenance checklist',
    ],
    processSteps: [
      { step: '01', title: 'System Diagnostics', desc: 'We inspect hardware specs, temperatures, and bottleneck areas.' },
      { step: '02', title: 'Remote Session', desc: 'Direct, secure 1-on-1 tuning via AnyDesk or TeamViewer.' },
      { step: '03', title: 'Software Tuning', desc: 'Encoder configuration, cache reallocation, and service streamlining.' },
      { step: '04', title: 'Stress Testing', desc: 'Simulated 4K multi-stream stress test to verify absolute stability.' },
    ],
    faqs: [
      {
        question: 'Is remote optimization safe?',
        answer: 'Yes. You remain in front of your screen watching every step, and we create a full Windows restore point before modifying any parameters.',
      },
    ],
  },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'content-production',
    number: '01',
    name: 'Content Production',
    tagline: 'High-retention visual storytelling',
    description: 'We handle everything from 3D CGI commercial spots to narrative documentaries, YouTube episode editing, and kinetic motion suites.',
    services: INITIAL_SERVICES.filter((s) => s.categoryId === 'content-production'),
  },
  {
    id: 'creative-design',
    number: '02',
    name: 'Creative Design',
    tagline: 'Precision visual engineering',
    description: 'Bespoke art-directed AI generative imagery and click-optimized graphic design for thumbnails, covers, and brand identities.',
    services: INITIAL_SERVICES.filter((s) => s.categoryId === 'creative-design'),
  },
  {
    id: 'digital-build',
    number: '03',
    name: 'Digital Build',
    tagline: 'Modern software and web architecture',
    description: 'Minimal, conversion-driven websites and custom web applications engineered with modern TypeScript and responsive precision.',
    services: INITIAL_SERVICES.filter((s) => s.categoryId === 'digital-build'),
  },
  {
    id: 'creator-tech',
    number: '04',
    name: 'Creator Tech',
    tagline: 'High-performance workstation tuning',
    description: 'Specialized optimization for creator PC rigs, Premiere/Resolve rendering pipelines, and zero-dropped-frame streaming setups.',
    services: INITIAL_SERVICES.filter((s) => s.categoryId === 'creator-tech'),
  },
];

// Helper to look up service by slug
export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return INITIAL_SERVICES.find((s) => s.slug === slug);
}

import React, { useState } from 'react';
import { ArrowUpRight, Check, Layers, Sliders, Sparkles, Terminal, Video, Flame } from 'lucide-react';
import { SERVICE_CATEGORIES, INITIAL_SERVICES } from '../data/servicesData';
import { INITIAL_PORTFOLIO, PortfolioItem } from '../data/portfolioData';
import { trackEvent } from '../services/analytics';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [selectedPortfolioCategory, setSelectedPortfolioCategory] = useState<string>('all');
  const [activePortfolioItem, setActivePortfolioItem] = useState<PortfolioItem | null>(null);

  const filteredPortfolio = selectedPortfolioCategory === 'all'
    ? INITIAL_PORTFOLIO
    : INITIAL_PORTFOLIO.filter((item) => item.category === selectedPortfolioCategory);

  const handleStartProject = () => {
    trackEvent('start_project', { source: 'homepage_hero' });
    navigate('/start-project');
  };

  return (
    <div className="pt-24 pb-20 overflow-hidden bg-[#FAF7F2]">
      {/* SECTION 1 — HERO */}
      <section id="home-hero" className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="max-w-4xl">
          {/* Warm Contrast Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#FFF4ED] text-[#C44219] text-xs font-mono tracking-wider uppercase mb-8 border border-[#FED7AA] rounded-full shadow-[0_2px_10px_rgba(232,82,38,0.08)]">
            <span className="w-2 h-2 rounded-full bg-[#E85226] shadow-[0_0_8px_#E85226] animate-pulse"></span>
            <span className="font-semibold">A Creator's Production Partner</span>
          </div>

          {/* Lovable Typographic Pairing: Modern Display + Editorial Serif Italic Accent */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-[#14110F] leading-[1.05] mb-8">
            Everything your content needs.
            <br />
            <span className="font-serif-italic font-normal text-gradient-warm">Under one roof.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#564E47] leading-relaxed max-w-2xl font-normal mb-10">
            From high-impact CGI spots and narrative YouTube cuts to click-tested thumbnails and creator web platforms — we turn ideas into finished work.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              id="hero-cta-start"
              onClick={handleStartProject}
              className="px-8 py-4 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_18px_rgba(232,82,38,0.35)] hover:shadow-[0_8px_26px_rgba(232,82,38,0.5)] hover:-translate-y-0.5 rounded-sm"
            >
              Start a Project
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              id="hero-cta-services"
              onClick={() => navigate('/services')}
              className="px-8 py-4 bg-[#FFFFFF] border-2 border-[#14110F] text-[#14110F] text-xs uppercase tracking-widest font-semibold hover:bg-[#14110F] hover:text-[#FAF7F2] transition-all flex items-center justify-center gap-2 cursor-pointer rounded-sm hover:-translate-y-0.5 shadow-sm"
            >
              Explore Services & Pricing
            </button>
          </div>
        </div>

        {/* Visual Output Ribbon (Warm Contrast Cards) */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-[#E8E1D5]">
          <div className="text-xs font-mono uppercase tracking-wider text-[#8A8075] mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
              Production Spectrum Overview
            </span>
            <span className="hidden sm:inline font-mono text-[#786F65]">01 Content • 02 Design • 03 Build • 04 Tech</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            <div className="p-5 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-sm bg-[#FFF4ED] flex items-center justify-center border border-[#FED7AA]">
                  <Video className="w-4.5 h-4.5 text-[#E85226]" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#C44219] bg-[#FFF4ED] px-2 py-0.5 rounded">CAT 01</span>
              </div>
              <h3 className="text-sm font-bold text-[#14110F] group-hover:text-[#E85226] transition-colors mb-1 font-display">
                CGI & Video
              </h3>
              <p className="text-xs text-[#6B6158] line-clamp-2">3D ads, narrative YouTube cuts, and fast vertical short-form retention.</p>
            </div>

            <div className="p-5 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-sm bg-[#FFF4ED] flex items-center justify-center border border-[#FED7AA]">
                  <Sparkles className="w-4.5 h-4.5 text-[#E85226]" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#C44219] bg-[#FFF4ED] px-2 py-0.5 rounded">CAT 02</span>
              </div>
              <h3 className="text-sm font-bold text-[#14110F] group-hover:text-[#E85226] transition-colors mb-1 font-display">
                Creative Design
              </h3>
              <p className="text-xs text-[#6B6158] line-clamp-2">Art-directed AI imagery, click-tested thumbnails, and visual identities.</p>
            </div>

            <div className="p-5 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-sm bg-[#FFF4ED] flex items-center justify-center border border-[#FED7AA]">
                  <Layers className="w-4.5 h-4.5 text-[#E85226]" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#C44219] bg-[#FFF4ED] px-2 py-0.5 rounded">CAT 03</span>
              </div>
              <h3 className="text-sm font-bold text-[#14110F] group-hover:text-[#E85226] transition-colors mb-1 font-display">
                Digital Build
              </h3>
              <p className="text-xs text-[#6B6158] line-clamp-2">Editorial landing pages, portfolio platforms, and custom web apps.</p>
            </div>

            <div className="p-5 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-sm bg-[#FFF4ED] flex items-center justify-center border border-[#FED7AA]">
                  <Sliders className="w-4.5 h-4.5 text-[#E85226]" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#C44219] bg-[#FFF4ED] px-2 py-0.5 rounded">CAT 04</span>
              </div>
              <h3 className="text-sm font-bold text-[#14110F] group-hover:text-[#E85226] transition-colors mb-1 font-display">
                Creator Tech
              </h3>
              <p className="text-xs text-[#6B6158] line-clamp-2">OBS streaming stability, studio audio routing, and render pipelines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — POSITIONING (Warm Espresso Canvas with High Contrast) */}
      <section id="home-positioning" className="bg-[#161311] text-[#FAF7F2] py-20 sm:py-28 border-y border-[#2B2420]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E85226] block mb-3 font-semibold">
              The Agency Alternative
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight mb-6">
              You create.
              <br />
              <span className="font-serif-italic font-normal text-gradient-warm">We handle the rest.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#B5ABA1] leading-relaxed">
              As a creator, your highest leverage is having ideas, recording the core footage, and connecting with your community. You shouldn't have to spend your week coordinating six different unvetted freelancers for video cuts, thumbnails, 3D spots, and website updates.
            </p>
            <p className="text-base sm:text-lg text-[#FAF7F2] font-medium mt-4">
              We operate as your dedicated production partner. You bring the raw concept, and our cross-disciplinary team executes every stage of the pipeline with predictable turnaround and uncompromising craft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 border-t border-[#2B2420]">
            {SERVICE_CATEGORIES.map((cat) => (
              <div key={cat.id} className="p-6 bg-[#1F1B18] border border-[#2E2824] hover:border-[#E85226]/70 transition-colors rounded-sm space-y-3">
                <span className="text-xs font-mono text-[#D97706] font-bold">CATEGORY {cat.number}</span>
                <h3 className="text-lg font-bold text-white tracking-tight font-display">{cat.name}</h3>
                <p className="text-xs text-[#A69B90] leading-relaxed">{cat.description}</p>
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-[#E85226] bg-[#2E1E17] px-2 py-0.5 rounded border border-[#52291B]">
                    {cat.services.length} Dedicated Services
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — SERVICES */}
      <section id="home-services" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#A3592E] block mb-2 font-semibold">
              Capabilities Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#14110F]">
              Structured Production Capabilities
            </h2>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="text-xs font-bold uppercase tracking-wider text-[#E85226] hover:text-[#C44219] transition-colors flex items-center gap-1.5 self-start md:self-auto font-mono"
          >
            Explore Complete Pricing Index <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-12">
          {SERVICE_CATEGORIES.map((cat) => (
            <div key={cat.id} className="border border-[#E8E1D5] bg-white p-8 sm:p-10 shadow-[0_4px_24px_-10px_rgba(20,17,15,0.05)] rounded-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E1D5] gap-4 mb-6">
                <div>
                  <div className="text-xs font-mono text-[#E85226] uppercase tracking-wider mb-1 font-bold">
                    CATEGORY {cat.number}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-[#14110F]">
                    {cat.name}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#8A8075] bg-[#FAF7F2] px-3 py-1 rounded border border-[#E8E1D5]">{cat.tagline}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cat.services.map((s) => (
                  <div
                    key={s.slug}
                    className="p-5 border border-[#ECE5DA] hover:border-[#E85226] bg-[#FAF7F2] warm-card-hover rounded-sm flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm text-[#14110F] group-hover:text-[#E85226] transition-colors font-display">
                          {s.name}
                        </h4>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E85226]" />
                      </div>
                      <p className="text-xs text-[#6B6158] line-clamp-3 mb-4 leading-relaxed">{s.shortDesc}</p>
                    </div>

                    <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#E85226]">{s.startingPriceDisplay}</span>
                      <button
                        onClick={() => navigate(`/services/${s.slug}`)}
                        className="text-[11px] uppercase tracking-wider font-semibold text-[#524A43] hover:text-[#E85226] transition-colors"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — WHY US (Warm Buttermilk Foundation with Terracotta Accents) */}
      <section id="home-why-us" className="bg-[#F3EDE2] py-20 sm:py-28 border-y border-[#E8E1D5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A3592E] block mb-2 font-semibold">
              Our Operating Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#14110F] mb-4">
              Built on Principles, Not Freelancer Chaos.
            </h2>
            <p className="text-sm sm:text-base text-[#5C544D] leading-relaxed">
              We deliberately reject the unvetted gig marketplace model. When you partner with us, you work with an organized studio governed by five simple commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            <div className="p-6 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm space-y-3">
              <span className="text-sm font-mono font-extrabold text-[#E85226] block">01</span>
              <h3 className="font-bold text-sm text-[#14110F] font-display">One Place for Production</h3>
              <p className="text-xs text-[#6B6158] leading-relaxed">
                Edits, 3D graphics, website changes, and thumbnail packages are handled together without misaligned assets.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm space-y-3">
              <span className="text-sm font-mono font-extrabold text-[#E85226] block">02</span>
              <h3 className="font-bold text-sm text-[#14110F] font-display">Clear Pricing</h3>
              <p className="text-xs text-[#6B6158] leading-relaxed">
                Transparent package rates published upfront. No surprise markups, hidden fees, or awkward billing disputes.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm space-y-3">
              <span className="text-sm font-mono font-extrabold text-[#E85226] block">03</span>
              <h3 className="font-bold text-sm text-[#14110F] font-display">Simple Communication</h3>
              <p className="text-xs text-[#6B6158] leading-relaxed">
                One centralized client portal with direct messaging. No scattered Discord DMs or lost email threads.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm space-y-3">
              <span className="text-sm font-mono font-extrabold text-[#E85226] block">04</span>
              <h3 className="font-bold text-sm text-[#14110F] font-display">Built Around Creators</h3>
              <p className="text-xs text-[#6B6158] leading-relaxed">
                We understand YouTube CTR, retention drop-offs, release schedules, and creator fatigue intimately.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm space-y-3">
              <span className="text-sm font-mono font-extrabold text-[#E85226] block">05</span>
              <h3 className="font-bold text-sm text-[#14110F] font-display">Adaptive Speed</h3>
              <p className="text-xs text-[#6B6158] leading-relaxed">
                Content pivots rapidly. When your script shifts or a thumbnail needs an instant revision, we execute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — HOW IT WORKS */}
      <section id="home-how-it-works" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#A3592E] block mb-2 font-semibold">
            The Production Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#14110F] mb-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-[#5C544D]">
            A clean, friction-free journey engineered to eliminate operational burden from your schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="relative border-l-2 border-[#E85226] pl-6 py-2 space-y-3 bg-white/40 p-4 rounded-r-sm">
            <span className="font-mono text-3xl font-extrabold text-[#E85226] block">01</span>
            <h3 className="font-bold text-base text-[#14110F] font-display">Tell us what you're building.</h3>
            <p className="text-xs text-[#6B6158] leading-relaxed">
              Submit your project brief, timeline, and reference links through our clean onboarding flow.
            </p>
          </div>

          <div className="relative border-l-2 border-[#E85226] pl-6 py-2 space-y-3 bg-white/40 p-4 rounded-r-sm">
            <span className="font-mono text-3xl font-extrabold text-[#E85226] block">02</span>
            <h3 className="font-bold text-base text-[#14110F] font-display">Choose what you need.</h3>
            <p className="text-xs text-[#6B6158] leading-relaxed">
              Select clear standalone packages or request a tailored scope without any hidden licensing markups.
            </p>
          </div>

          <div className="relative border-l-2 border-[#E85226] pl-6 py-2 space-y-3 bg-white/40 p-4 rounded-r-sm">
            <span className="font-mono text-3xl font-extrabold text-[#E85226] block">03</span>
            <h3 className="font-bold text-base text-[#14110F] font-display">We produce it.</h3>
            <p className="text-xs text-[#6B6158] leading-relaxed">
              Our specialized artists and developers handle assembly, pacing, color grading, and rendering.
            </p>
          </div>

          <div className="relative border-l-2 border-[#E85226] pl-6 py-2 space-y-3 bg-white/40 p-4 rounded-r-sm">
            <span className="font-mono text-3xl font-extrabold text-[#E85226] block">04</span>
            <h3 className="font-bold text-base text-[#14110F] font-display">You receive finished work.</h3>
            <p className="text-xs text-[#6B6158] leading-relaxed">
              Download high-res masters directly from your portal, request quick adjustments, and publish.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — SELECTED WORK */}
      <section id="home-portfolio" className="bg-[#FAF7F2] py-20 sm:py-28 border-t border-[#E8E1D5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#A3592E] block mb-2 font-semibold">
                Portfolio Showcase
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#14110F]">
                Selected Work & Technical Specs
              </h2>
              <div className="mt-2 text-xs font-mono text-[#8A8075] flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-[#E85226] rounded-full"></span>
                <span>Demonstration concepts clearly marked as studio placeholders</span>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPortfolioCategory('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-all ${
                  selectedPortfolioCategory === 'all'
                    ? 'bg-[#E85226] text-white shadow-[0_3px_10px_rgba(232,82,38,0.3)]'
                    : 'bg-white border border-[#E8E1D5] text-[#60574F] hover:text-[#14110F] hover:border-[#E85226]'
                }`}
              >
                All Categories
              </button>
              <button
                onClick={() => setSelectedPortfolioCategory('content-production')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-all ${
                  selectedPortfolioCategory === 'content-production'
                    ? 'bg-[#E85226] text-white shadow-[0_3px_10px_rgba(232,82,38,0.3)]'
                    : 'bg-white border border-[#E8E1D5] text-[#60574F] hover:text-[#14110F] hover:border-[#E85226]'
                }`}
              >
                Content Production
              </button>
              <button
                onClick={() => setSelectedPortfolioCategory('creative-design')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-all ${
                  selectedPortfolioCategory === 'creative-design'
                    ? 'bg-[#E85226] text-white shadow-[0_3px_10px_rgba(232,82,38,0.3)]'
                    : 'bg-white border border-[#E8E1D5] text-[#60574F] hover:text-[#14110F] hover:border-[#E85226]'
                }`}
              >
                Creative Design
              </button>
              <button
                onClick={() => setSelectedPortfolioCategory('digital-build')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-all ${
                  selectedPortfolioCategory === 'digital-build'
                    ? 'bg-[#E85226] text-white shadow-[0_3px_10px_rgba(232,82,38,0.3)]'
                    : 'bg-white border border-[#E8E1D5] text-[#60574F] hover:text-[#14110F] hover:border-[#E85226]'
                }`}
              >
                Digital Build
              </button>
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolio.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => setActivePortfolioItem(item)}
                className="bg-white border border-[#E8E1D5] overflow-hidden group cursor-pointer warm-card-hover rounded-sm flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden bg-[#1E1A17]">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {item.isPlaceholder && (
                    <div className="absolute top-3 left-3 bg-[#161311]/90 backdrop-blur-xs text-[#FAF7F2] text-[10px] font-mono px-2 py-0.5 border border-[#E85226]/40 uppercase rounded-xs">
                      Studio Concept Spec
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-[#E85226] text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md rounded-xs">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#A3592E] mb-2 font-semibold">
                      <span>{item.categoryLabel}</span>
                      <span className="bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8E1D5] text-[#60574F]">{item.service}</span>
                    </div>
                    <h3 className="font-bold text-base text-[#14110F] group-hover:text-[#E85226] transition-colors leading-snug font-display">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#6B6158] mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8E1D5] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8A8075] uppercase tracking-wider">
                      {item.clientName}
                    </span>
                    <span className="text-xs font-semibold text-[#E85226] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Inspect Specs →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/work')}
              className="px-7 py-3.5 bg-white border-2 border-[#14110F] text-xs uppercase tracking-widest font-semibold hover:bg-[#14110F] hover:text-white transition-all rounded-sm shadow-sm"
            >
              View All Case Studies & Prototypes
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 7 — PRICING TEASER (Dark Warm Luxury Atmosphere) */}
      <section id="home-pricing-teaser" className="bg-[#161311] text-[#FAF7F2] py-20 sm:py-28 border-y border-[#2B2420]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#E85226] block mb-2 font-bold">
                Transparent Studio Rates
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                Starting Rates for Modern Creators
              </h2>
            </div>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all self-start md:self-auto rounded-sm shadow-[0_4px_16px_rgba(232,82,38,0.35)]"
            >
              View Full Price Matrix
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border border-[#2E2824] bg-[#1E1A17] hover:border-[#E85226]/80 transition-colors flex flex-col justify-between rounded-sm">
              <div>
                <span className="text-xs font-mono text-[#D97706] block mb-1">Content Production</span>
                <h3 className="text-lg font-bold text-white mb-2 font-display">Video Editing</h3>
                <p className="text-xs text-[#A69B90] mb-6">High-retention Shorts, Reels, and YouTube narrative episodes.</p>
              </div>
              <div className="pt-4 border-t border-[#2E2824]">
                <span className="text-xs text-[#8C8276] block font-mono">Starting from</span>
                <span className="text-2xl font-bold font-mono text-amber-400">₹89</span>
                <span className="text-xs text-[#8C8276] ml-1">/video</span>
              </div>
            </div>

            <div className="p-6 border border-[#2E2824] bg-[#1E1A17] hover:border-[#E85226]/80 transition-colors flex flex-col justify-between rounded-sm">
              <div>
                <span className="text-xs font-mono text-[#D97706] block mb-1">Content Production</span>
                <h3 className="text-lg font-bold text-white mb-2 font-display">CGI Ads</h3>
                <p className="text-xs text-[#A69B90] mb-6">Surreal 3D commercial spots and physics product reveals.</p>
              </div>
              <div className="pt-4 border-t border-[#2E2824]">
                <span className="text-xs text-[#8C8276] block font-mono">Starting from</span>
                <span className="text-2xl font-bold font-mono text-amber-400">₹1,499</span>
                <span className="text-xs text-[#8C8276] ml-1">/ad</span>
              </div>
            </div>

            <div className="p-6 border border-[#2E2824] bg-[#1E1A17] hover:border-[#E85226]/80 transition-colors flex flex-col justify-between rounded-sm">
              <div>
                <span className="text-xs font-mono text-[#D97706] block mb-1">Digital Build</span>
                <h3 className="text-lg font-bold text-white mb-2 font-display">Websites</h3>
                <p className="text-xs text-[#A69B90] mb-6">Fast, responsive, editorial sites engineered for creator conversions.</p>
              </div>
              <div className="pt-4 border-t border-[#2E2824]">
                <span className="text-xs text-[#8C8276] block font-mono">Starting from</span>
                <span className="text-2xl font-bold font-mono text-amber-400">₹3,999</span>
                <span className="text-xs text-[#8C8276] ml-1">single page</span>
              </div>
            </div>

            <div className="p-6 border border-[#2E2824] bg-[#1E1A17] hover:border-[#E85226]/80 transition-colors flex flex-col justify-between rounded-sm">
              <div>
                <span className="text-xs font-mono text-[#D97706] block mb-1">Creative Design</span>
                <h3 className="text-lg font-bold text-white mb-2 font-display">AI Images</h3>
                <p className="text-xs text-[#A69B90] mb-6">Art-directed generative visual stills without warped artifacts.</p>
              </div>
              <div className="pt-4 border-t border-[#2E2824]">
                <span className="text-xs text-[#8C8276] block font-mono">Starting from</span>
                <span className="text-2xl font-bold font-mono text-amber-400">₹100</span>
                <span className="text-xs text-[#8C8276] ml-1">/image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL CTA (Warm Contrast Card) */}
      <section id="home-final-cta" className="max-w-7xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
        <div className="border-2 border-[#E85226]/40 p-8 sm:p-16 bg-gradient-to-br from-[#FFF7F0] via-[#FAF7F2] to-[#FFF4EB] text-center max-w-4xl mx-auto relative overflow-hidden rounded-md shadow-[0_16px_40px_-15px_rgba(232,82,38,0.18)]">
          <div className="max-w-xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#14110F] text-[#FAF7F2] text-[11px] font-mono tracking-widest uppercase rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
              Production Slots Open
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-[#14110F] tracking-tight">
              Got something in mind?
              <br />
              <span className="font-serif-italic font-normal text-gradient-warm">Let's build it.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#5C544D] leading-relaxed">
              Tell us what you're building. We'll handle the entire production pipeline.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                id="final-cta-btn"
                onClick={handleStartProject}
                className="px-10 py-4 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all inline-flex items-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(232,82,38,0.4)] hover:shadow-[0_8px_30px_rgba(232,82,38,0.55)] hover:-translate-y-0.5 rounded-sm"
              >
                Start a Project
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Portfolio Item Details */}
      {activePortfolioItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] border border-[#E85226]/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 rounded-md shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E8E1D5] pb-4">
              <div>
                <span className="text-xs font-mono text-[#E85226] uppercase tracking-wider font-bold">
                  {activePortfolioItem.categoryLabel} • {activePortfolioItem.service}
                </span>
                <h3 className="text-xl font-bold text-[#14110F] mt-1 font-display">{activePortfolioItem.title}</h3>
                {activePortfolioItem.isPlaceholder && (
                  <span className="inline-block mt-1 text-[11px] font-mono text-[#A3592E] bg-[#FFF4ED] px-2 py-0.5 rounded border border-[#FED7AA]">
                    [Clearly Marked Studio Placeholder]
                  </span>
                )}
              </div>
              <button
                onClick={() => setActivePortfolioItem(null)}
                className="text-[#8A8075] hover:text-[#E85226] font-mono text-xl p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video bg-black overflow-hidden rounded-sm">
              <img
                src={activePortfolioItem.thumbnail}
                alt={activePortfolioItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase text-[#A3592E] mb-2 font-bold">Technical Description</h4>
              <p className="text-sm text-[#423C36] leading-relaxed">{activePortfolioItem.description}</p>
            </div>

            {activePortfolioItem.specs && activePortfolioItem.specs.length > 0 && (
              <div className="border-t border-[#E8E1D5] pt-4">
                <h4 className="text-xs font-mono uppercase text-[#A3592E] mb-3 font-bold">Specification Sheet</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePortfolioItem.specs.map((spec, idx) => (
                    <div key={idx} className="p-3 bg-white border border-[#E8E1D5] text-xs rounded-sm">
                      <span className="font-mono text-[#8A8075] block">{spec.label}</span>
                      <span className="font-semibold text-[#14110F]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#E8E1D5] flex justify-between items-center">
              <button
                onClick={() => setActivePortfolioItem(null)}
                className="text-xs font-mono uppercase text-[#8A8075] hover:text-[#14110F]"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  setActivePortfolioItem(null);
                  navigate('/start-project');
                }}
                className="px-5 py-2.5 bg-[#E85226] text-white text-xs uppercase tracking-wider font-semibold rounded-sm shadow-md hover:bg-[#D44218] transition-colors"
              >
                Start Similar Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

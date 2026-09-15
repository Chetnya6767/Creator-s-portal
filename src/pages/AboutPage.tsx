import React from 'react';
import { ArrowUpRight, Check, Compass, Eye, Shield, Target } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2]">
      {/* Manifesto Hero */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 mb-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF4ED] text-[#C44219] text-xs font-mono uppercase tracking-wider mb-4 border border-[#FED7AA] rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
            <span>Studio Philosophy & Manifesto</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-[#14110F] mb-8 leading-[1.08]">
            A Creator's{' '}
            <span className="font-serif-italic font-normal text-gradient-warm">Production Partner.</span>
          </h1>
          <div className="text-xl sm:text-2xl text-[#14110F] leading-relaxed font-serif-italic mb-8 bg-[#FFF4ED] p-6 border-l-4 border-[#E85226] rounded-r-sm shadow-xs">
            "You bring the idea. We handle the production."
          </div>
          <p className="text-base sm:text-lg text-[#564E47] leading-relaxed max-w-3xl font-normal">
            In the modern digital landscape, the most ambitious creators, founders, and personal brands don't struggle because of a lack of ideas. They struggle because production friction consumes 70% of their mental energy. Coordinating fragmented freelance editors, 3D artists, thumbnail designers, and web developers is an exhausting second job.
          </p>
          <p className="text-base sm:text-lg text-[#14110F] font-semibold leading-relaxed max-w-3xl mt-4">
            Production Partner was built to consolidate the entire creative execution pipeline under one roof with predictable rates, obsessive craft, and uncompromising accountability.
          </p>
        </div>
      </section>

      {/* The Core Shift (Warm Dark Atmosphere) */}
      <section className="bg-[#161311] text-[#FAF7F2] py-20 border-y border-[#2B2420]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#E85226] block mb-2 font-bold">
                The Structural Dilemma
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-6">
                Why Gig Platforms Fail Serious Creators
              </h2>
              <p className="text-sm sm:text-base text-[#A69B90] leading-relaxed">
                Freelancer marketplaces force you into endless bidding wars, inconsistent file deliveries, unreliable communication, and zero holistic project ownership. When an edit doesn't match a thumbnail or a website can't handle a drop, everyone points fingers.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-[#E2DAD1]">
                  <span className="w-1.5 h-1.5 bg-[#E85226] rounded-full"></span>
                  <span>Unified creative direction across all media deliverables</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#E2DAD1]">
                  <span className="w-1.5 h-1.5 bg-[#E85226] rounded-full"></span>
                  <span>Centralized client portal with direct producer communication</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#E2DAD1]">
                  <span className="w-1.5 h-1.5 bg-[#E85226] rounded-full"></span>
                  <span>Transparent upfront rates with zero hidden platform commissions</span>
                </div>
              </div>
            </div>

            <div className="p-8 border border-[#2E2824] bg-[#1E1A17] space-y-6 rounded-sm shadow-xl">
              <h3 className="text-xl font-bold font-display text-white border-b border-[#2E2824] pb-3">
                Our Operating Standard
              </h3>
              <div className="space-y-4 text-xs text-[#B5ABA1] leading-relaxed font-sans">
                <p>
                  <strong className="text-white font-mono text-[#D97706]">01. Predictable Velocity:</strong> We treat delivery schedules with the seriousness of commercial broadcast deadlines.
                </p>
                <p>
                  <strong className="text-white font-mono text-[#D97706]">02. Optical Precision:</strong> Visual contrast, typography, audio normalizations, and physics simulations are evaluated on calibrated displays.
                </p>
                <p>
                  <strong className="text-white font-mono text-[#D97706]">03. Direct Ownership:</strong> You have a single dedicated lead through your client dashboard who understands the complete picture of your project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-24">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#A3592E] block mb-2 font-bold">
            Disciplines
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#14110F]">
            Organized Production Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm space-y-3">
            <span className="text-sm font-mono font-extrabold text-[#E85226] block">01</span>
            <h3 className="font-bold text-base text-[#14110F] font-display">Content Production</h3>
            <p className="text-xs text-[#6B6158] leading-relaxed">
              CGI ads, long-form documentary cuts, high-retention YouTube editing, and kinetic motion suites designed for modern screen formats.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm space-y-3">
            <span className="text-sm font-mono font-extrabold text-[#E85226] block">02</span>
            <h3 className="font-bold text-base text-[#14110F] font-display">Creative Design</h3>
            <p className="text-xs text-[#6B6158] leading-relaxed">
              Art-directed AI imagery without warped artifacts, click-tested YouTube thumbnails, reel covers, and brand visual identities.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm space-y-3">
            <span className="text-sm font-mono font-extrabold text-[#E85226] block">03</span>
            <h3 className="font-bold text-base text-[#14110F] font-display">Digital Build</h3>
            <p className="text-xs text-[#6B6158] leading-relaxed">
              Clean, minimalist, conversion-focused websites and tailored web applications built on modern, resilient TypeScript stacks.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E8E1D5] hover:border-[#E85226] warm-card-hover rounded-sm space-y-3">
            <span className="text-sm font-mono font-extrabold text-[#E85226] block">04</span>
            <h3 className="font-bold text-base text-[#14110F] font-display">Creator Tech</h3>
            <p className="text-xs text-[#6B6158] leading-relaxed">
              Specialized hardware and software tuning for creator PC rigs, 4K rendering pipelines, and zero-drop OBS streaming setups.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="p-8 sm:p-14 bg-gradient-to-br from-[#FFF4ED] via-[#FAF7F2] to-[#FFF9F4] border-2 border-[#E85226]/40 text-center max-w-3xl mx-auto space-y-6 rounded-md shadow-lg">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#14110F]">
            Ready to partner on your next release?
          </h2>
          <p className="text-sm text-[#5C544D] max-w-md mx-auto leading-relaxed">
            Tell us what you're planning. We will assemble the pipeline and deliver the finished work.
          </p>
          <div>
            <button
              onClick={() => navigate('/start-project')}
              className="px-8 py-4 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all inline-flex items-center gap-2 cursor-pointer shadow-[0_4px_18px_rgba(232,82,38,0.35)] hover:-translate-y-0.5 rounded-sm"
            >
              Start a Project
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

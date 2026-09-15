import React, { useState } from 'react';
import { ArrowUpRight, Filter, Info, Shield, Sparkles } from 'lucide-react';
import { INITIAL_PORTFOLIO, PortfolioItem } from '../data/portfolioData';

interface WorkPageProps {
  navigate: (path: string) => void;
}

export const WorkPage: React.FC<WorkPageProps> = ({ navigate }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);

  const filteredItems = selectedFilter === 'all'
    ? INITIAL_PORTFOLIO
    : INITIAL_PORTFOLIO.filter((i) => i.category === selectedFilter);

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2]">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 mb-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF4ED] text-[#C44219] text-xs font-mono uppercase tracking-wider mb-4 border border-[#FED7AA] rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
            <span>Selected Work & Prototypes</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-[#14110F] mb-6">
            Production Quality &
            <br />
            <span className="font-serif-italic font-normal text-gradient-warm">Craft Standards.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#564E47] leading-relaxed">
            We deliver production-grade CGI, video pacing, website architecture, and visual design. Below are curated demonstration concepts and technical benchmarks produced to display exact output fidelity.
          </p>

          <div className="mt-6 p-4 bg-[#FFF4ED] border border-[#FED7AA] flex items-start gap-3 rounded-sm">
            <Info className="w-4 h-4 text-[#E85226] shrink-0 mt-0.5" />
            <p className="text-xs text-[#8C3415] leading-relaxed">
              <strong>Transparency Note:</strong> As a strict creative studio policy, demonstration concepts without public client release are clearly marked with <span className="font-mono font-bold text-[#E85226]">[Studio Concept Spec]</span>. We never display unverified reviews or invented claims.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-[#E8E1D5] pb-6">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-sm ${
              selectedFilter === 'all'
                ? 'bg-[#E85226] text-white shadow-[0_3px_12px_rgba(232,82,38,0.3)]'
                : 'bg-white border border-[#E8E1D5] text-[#60574F] hover:text-[#14110F] hover:border-[#E85226]'
            }`}
          >
            All Work ({INITIAL_PORTFOLIO.length})
          </button>
          <button
            onClick={() => setSelectedFilter('content-production')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-sm ${
              selectedFilter === 'content-production'
                ? 'bg-[#E85226] text-white shadow-[0_3px_12px_rgba(232,82,38,0.3)]'
                : 'bg-white border border-[#E8E1D5] text-[#60574F] hover:text-[#14110F] hover:border-[#E85226]'
            }`}
          >
            Content Production
          </button>
          <button
            onClick={() => setSelectedFilter('creative-design')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-sm ${
              selectedFilter === 'creative-design'
                ? 'bg-[#E85226] text-white shadow-[0_3px_12px_rgba(232,82,38,0.3)]'
                : 'bg-white border border-[#E8E1D5] text-[#60574F] hover:text-[#14110F] hover:border-[#E85226]'
            }`}
          >
            Creative Design
          </button>
          <button
            onClick={() => setSelectedFilter('digital-build')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-sm ${
              selectedFilter === 'digital-build'
                ? 'bg-[#E85226] text-white shadow-[0_3px_12px_rgba(232,82,38,0.3)]'
                : 'bg-white border border-[#E8E1D5] text-[#60574F] hover:text-[#14110F] hover:border-[#E85226]'
            }`}
          >
            Digital Build
          </button>
          <button
            onClick={() => setSelectedFilter('creator-tech')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-sm ${
              selectedFilter === 'creator-tech'
                ? 'bg-[#E85226] text-white shadow-[0_3px_12px_rgba(232,82,38,0.3)]'
                : 'bg-white border border-[#E8E1D5] text-[#60574F] hover:text-[#14110F] hover:border-[#E85226]'
            }`}
          >
            Creator Tech
          </button>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
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
                  <div className="absolute top-3 left-3 bg-[#161311]/90 backdrop-blur-xs text-[#FAF7F2] text-[10px] font-mono px-2 py-0.5 border border-[#E85226]/40 uppercase tracking-wider rounded-xs">
                    Studio Concept Spec
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-[#E85226] text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xs shadow-md">
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
                  <p className="text-xs text-[#6B6158] mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E1D5] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 bg-[#FAF7F2] text-[#7C7267] border border-[#ECE5DA] rounded-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#E85226] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Inspect Specs →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] border border-[#E85226]/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 rounded-md shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E8E1D5] pb-4">
              <div>
                <span className="text-xs font-mono text-[#E85226] uppercase tracking-wider font-bold">
                  {activeModalItem.categoryLabel} • {activeModalItem.service}
                </span>
                <h3 className="text-xl font-bold text-[#14110F] mt-1 font-display">{activeModalItem.title}</h3>
                {activeModalItem.isPlaceholder && (
                  <span className="inline-block mt-1 text-[11px] font-mono text-[#A3592E] bg-[#FFF4ED] px-2 py-0.5 rounded border border-[#FED7AA]">
                    [Clearly Marked Studio Concept Spec]
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="text-[#8A8075] hover:text-[#E85226] font-mono text-xl p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video bg-black overflow-hidden rounded-sm">
              <img
                src={activeModalItem.thumbnail}
                alt={activeModalItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase text-[#A3592E] mb-2 font-bold">Technical Description</h4>
              <p className="text-sm text-[#423C36] leading-relaxed">{activeModalItem.description}</p>
            </div>

            {activeModalItem.specs && (
              <div className="border-t border-[#E8E1D5] pt-4">
                <h4 className="text-xs font-mono uppercase text-[#A3592E] mb-3 font-bold">Specification Sheet</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeModalItem.specs.map((spec, idx) => (
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
                onClick={() => setActiveModalItem(null)}
                className="text-xs font-mono uppercase text-[#8A8075] hover:text-[#14110F]"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  setActiveModalItem(null);
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

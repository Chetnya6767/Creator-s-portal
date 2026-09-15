import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/servicesData';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const contactEmail = (import.meta as any).env?.CONTACT_EMAIL || '[Email to be configured]';

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#161311] text-[#FAF7F2] pt-16 pb-12 border-t border-[#2B2420]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#2B2420]">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-block w-2.5 h-2.5 bg-[#E85226] rounded-xs shadow-[0_0_10px_rgba(232,82,38,0.55)]"></span>
              <span className="font-display text-lg font-bold tracking-tight text-white">PRODUCTION PARTNER</span>
            </div>
            <p className="text-sm text-[#A69B90] leading-relaxed max-w-sm">
              A creator's production partner. We help creators, YouTubers, personal brands and businesses with the production work required to create content and build their digital presence.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center px-3 py-1 text-[11px] font-mono tracking-wider uppercase text-[#E85226] bg-[#2E1E17] border border-[#52291B] rounded-xs">
                You bring the idea. We handle the production.
              </span>
            </div>
          </div>

          {/* Services Columns */}
          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#D97706] mb-4 font-bold">Production</h4>
              <ul className="space-y-2.5 text-sm">
                {SERVICE_CATEGORIES[0].services.map((s) => (
                  <li key={s.slug}>
                    <button
                      onClick={() => handleNav(`/services/${s.slug}`)}
                      className="text-[#B5ABA1] hover:text-[#E85226] transition-colors text-left"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
                {SERVICE_CATEGORIES[1].services.map((s) => (
                  <li key={s.slug}>
                    <button
                      onClick={() => handleNav(`/services/${s.slug}`)}
                      className="text-[#B5ABA1] hover:text-[#E85226] transition-colors text-left"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#D97706] mb-4 font-bold">Build & Tech</h4>
              <ul className="space-y-2.5 text-sm">
                {SERVICE_CATEGORIES[2].services.map((s) => (
                  <li key={s.slug}>
                    <button
                      onClick={() => handleNav(`/services/${s.slug}`)}
                      className="text-[#B5ABA1] hover:text-[#E85226] transition-colors text-left"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
                {SERVICE_CATEGORIES[3].services.map((s) => (
                  <li key={s.slug}>
                    <button
                      onClick={() => handleNav(`/services/${s.slug}`)}
                      className="text-[#B5ABA1] hover:text-[#E85226] transition-colors text-left"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
                <li className="pt-2">
                  <button
                    onClick={() => handleNav('/services')}
                    className="text-xs font-semibold text-[#E85226] hover:underline flex items-center gap-1"
                  >
                    View All Pricing <ArrowUpRight className="w-3 h-3" />
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Links / Agency Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D97706] mb-4 font-bold">Studio</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav('/work')} className="text-[#B5ABA1] hover:text-[#E85226] transition-colors">
                  Selected Work
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/about')} className="text-[#B5ABA1] hover:text-[#E85226] transition-colors">
                  About the Studio
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/portal')} className="text-[#B5ABA1] hover:text-[#E85226] transition-colors">
                  Client Portal & Tracking
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/work-with-us')} className="text-[#B5ABA1] hover:text-[#E85226] transition-colors">
                  Work With Us (Join Roster)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/contact')} className="text-[#B5ABA1] hover:text-[#E85226] transition-colors">
                  Contact Studio
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => handleNav('/start-project')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E85226] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#D44218] transition-all rounded-xs shadow-md"
                >
                  Start a Project
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A8075]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Production Partner. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-[#A69B90] font-mono">{contactEmail}</span>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={() => handleNav('/privacy')} className="hover:text-[#FAF7F2] transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('/terms')} className="hover:text-[#FAF7F2] transition-colors">
              Terms & Conditions
            </button>
            <button onClick={() => handleNav('/refund-policy')} className="hover:text-[#FAF7F2] transition-colors">
              Refund Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

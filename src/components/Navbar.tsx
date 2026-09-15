import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown, User, ShieldCheck, Sparkles } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/servicesData';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D5] py-3.5 shadow-[0_4px_24px_-10px_rgba(20,17,15,0.06)]'
          : 'bg-[#FAF7F2] border-b border-[#E8E1D5]/70 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* LOGO */}
        <button
          id="nav-logo-btn"
          onClick={() => handleNav('/')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-2.5 h-2.5 bg-[#E85226] rounded-sm shadow-[0_0_12px_rgba(232,82,38,0.55)] group-hover:scale-110 transition-transform"></span>
            <span className="font-display tracking-tight text-base sm:text-lg font-bold text-[#14110F]">
              PRODUCTION PARTNER
            </span>
          </div>
          <span className="block text-[10px] tracking-widest text-[#7C7267] uppercase font-mono font-medium mt-0.5 pl-5">
            Creator's Production Partner
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button
              id="nav-services-trigger"
              onClick={() => handleNav('/services')}
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 py-1 ${
                currentPath.startsWith('/services') ? 'text-[#14110F] font-bold' : 'text-[#60574F] hover:text-[#E85226]'
              }`}
            >
              Services
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[#E85226]' : 'text-[#8A8075]'}`} />
            </button>

            {/* Dropdown Menu */}
            {servicesDropdownOpen && (
              <div
                id="services-mega-menu"
                className="absolute top-full left-1/2 -translate-x-1/2 w-[560px] bg-[#FAF7F2] border border-[#E2D8CA] shadow-[0_16px_40px_-10px_rgba(20,17,15,0.12)] p-6 mt-2 grid grid-cols-2 gap-5 rounded-md"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#A3592E] font-semibold border-b border-[#E8E1D5] pb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#E85226] rounded-full"></span>
                      {cat.number} • {cat.name}
                    </div>
                    <ul className="space-y-1">
                      {cat.services.map((s) => (
                        <li key={s.slug}>
                          <button
                            id={`dropdown-service-${s.slug}`}
                            onClick={() => handleNav(`/services/${s.slug}`)}
                            className="text-xs text-[#423C36] hover:text-[#E85226] hover:translate-x-1 transition-all py-1 flex items-center justify-between w-full text-left font-medium"
                          >
                            <span>{s.name}</span>
                            <span className="text-[10px] font-mono text-[#8C8276] bg-[#F0EBE2] px-1.5 py-0.5 rounded">{s.startingPriceDisplay}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="col-span-2 pt-3 border-t border-[#E8E1D5] flex justify-between items-center text-xs">
                  <button
                    onClick={() => handleNav('/services')}
                    className="text-[#E85226] font-semibold hover:underline flex items-center gap-1"
                  >
                    View All Services & Pricing <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-[#8C8276]">Fixed pricing & rapid turnaround</span>
                </div>
              </div>
            )}
          </div>

          <button
            id="nav-link-work"
            onClick={() => handleNav('/work')}
            className={`text-sm font-medium transition-colors ${
              currentPath === '/work' ? 'text-[#14110F] font-bold' : 'text-[#60574F] hover:text-[#E85226]'
            }`}
          >
            Work
          </button>

          <button
            id="nav-link-about"
            onClick={() => handleNav('/about')}
            className={`text-sm font-medium transition-colors ${
              currentPath === '/about' ? 'text-[#14110F] font-bold' : 'text-[#60574F] hover:text-[#E85226]'
            }`}
          >
            About
          </button>

          <button
            id="nav-link-portal"
            onClick={() => handleNav('/portal')}
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentPath === '/portal' ? 'text-[#14110F] font-bold' : 'text-[#60574F] hover:text-[#E85226]'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#A3592E]" />
            Client Portal
          </button>

          <button
            id="nav-link-admin"
            onClick={() => handleNav('/admin')}
            className={`text-xs font-mono tracking-wider transition-colors flex items-center gap-1 text-[#8C8276] hover:text-[#14110F]`}
            title="Studio Admin Dashboard"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C8276]" />
            Admin
          </button>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            id="nav-cta-start-project"
            onClick={() => handleNav('/start-project')}
            className="px-5 py-2.5 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all inline-flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(232,82,38,0.3)] hover:shadow-[0_6px_22px_rgba(232,82,38,0.45)] hover:-translate-y-0.5 rounded-sm"
          >
            Start a Project
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center md:hidden gap-3">
          <button
            id="mobile-start-btn"
            onClick={() => handleNav('/start-project')}
            className="px-3.5 py-1.5 bg-[#E85226] text-white text-xs font-semibold uppercase tracking-wider rounded-sm shadow-sm"
          >
            Start
          </button>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#14110F] hover:bg-[#EAE2D5] transition-colors rounded-sm"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="md:hidden bg-[#FAF7F2] border-b border-[#E2D8CA] px-6 py-6 space-y-4 max-h-[85vh] overflow-y-auto"
        >
          <div className="space-y-3 border-b border-[#E8E1D5] pb-4">
            <button
              onClick={() => handleNav('/')}
              className="block w-full text-left text-base font-medium text-[#14110F] py-1 font-display font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/services')}
              className="block w-full text-left text-base font-medium text-[#14110F] py-1 font-display font-semibold"
            >
              Services & Pricing
            </button>
            <div className="pl-3 space-y-1.5 border-l-2 border-[#E85226]/40">
              {SERVICE_CATEGORIES.map((cat) => (
                <div key={cat.id} className="py-1">
                  <div className="text-[10px] font-mono text-[#A3592E] uppercase font-semibold">{cat.name}</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
                    {cat.services.map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => handleNav(`/services/${s.slug}`)}
                        className="text-xs text-[#60574F] hover:text-[#E85226]"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleNav('/work')}
              className="block w-full text-left text-base font-medium text-[#14110F] py-1 font-display font-semibold"
            >
              Work / Portfolio
            </button>
            <button
              onClick={() => handleNav('/about')}
              className="block w-full text-left text-base font-medium text-[#14110F] py-1 font-display font-semibold"
            >
              About
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleNav('/portal')}
              className="w-full text-left text-sm font-medium text-[#14110F] flex items-center justify-between py-2 border-b border-[#E8E1D5]"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#E85226]" />
                Client Portal
              </span>
              <span className="text-[11px] font-mono text-[#8C8276]">Track Orders</span>
            </button>
            <button
              onClick={() => handleNav('/work-with-us')}
              className="w-full text-left text-sm font-medium text-[#60574F] hover:text-[#E85226] py-1"
            >
              Work With Us (Creators & Artists)
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className="w-full text-left text-sm font-medium text-[#60574F] hover:text-[#E85226] py-1"
            >
              Contact
            </button>
            <button
              onClick={() => handleNav('/admin')}
              className="w-full text-left text-xs font-mono text-[#8C8276] hover:text-[#14110F] py-1 flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
            </button>

            <button
              onClick={() => handleNav('/start-project')}
              className="w-full py-3 bg-[#E85226] text-white text-center text-xs uppercase tracking-widest font-semibold block mt-4 rounded-sm shadow-md"
            >
              Start a Project
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

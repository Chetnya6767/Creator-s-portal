import React, { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, Check, HelpCircle, Shield, Clock, Sparkles } from 'lucide-react';
import { getServiceBySlug, INITIAL_SERVICES } from '../data/servicesData';
import { trackEvent } from '../services/analytics';

interface ServiceDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug, navigate }) => {
  const service = getServiceBySlug(slug) || INITIAL_SERVICES[0];

  useEffect(() => {
    trackEvent('service_view', { service_slug: slug, service_name: service.name });
  }, [slug, service.name]);

  const handleStartProject = () => {
    trackEvent('start_project', { source: `service_page_${slug}`, service: service.name });
    navigate('/start-project');
  };

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2]">
      {/* Top Breadcrumb & Return */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-8">
        <button
          onClick={() => navigate('/services')}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#7C7267] hover:text-[#E85226] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Services
        </button>
      </div>

      {/* 1. HERO */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 mb-16 sm:mb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF4ED] text-[#C44219] text-xs font-mono tracking-wider uppercase mb-6 border border-[#FED7AA] rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
            {service.categoryName} • Standard Production
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-[#14110F] mb-6 leading-[1.1]">
            {service.heroHeadline}
          </h1>

          <p className="text-base sm:text-lg text-[#524A43] leading-relaxed mb-8">
            {service.heroSubtext}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={handleStartProject}
              className="px-8 py-4 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all flex items-center gap-2 cursor-pointer rounded-sm shadow-[0_4px_16px_rgba(232,82,38,0.35)] hover:-translate-y-0.5"
            >
              Start a Project
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <span className="text-sm font-mono text-[#7C7267] px-2">
              Published Rate: <strong className="text-[#14110F]">{service.startingPriceDisplay}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 2. WHAT WE DO & 3. DELIVERABLES (Two-column layout) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-12 border-t border-[#E8E1D5]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* What we do */}
          <div className="bg-white border border-[#E8E1D5] p-8 rounded-sm shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E85226] font-bold block mb-2">
              Scope of Work
            </span>
            <h2 className="text-2xl font-bold font-display text-[#14110F] mb-6">
              What We Do
            </h2>
            <ul className="space-y-4">
              {service.whatWeDo.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#423C36]">
                  <div className="w-5 h-5 rounded-xs bg-[#FFF4ED] border border-[#FED7AA] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#E85226]" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables */}
          <div className="bg-white border border-[#E8E1D5] p-8 rounded-sm shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7C7267] font-bold block mb-2">
              Final Output
            </span>
            <h2 className="text-2xl font-bold font-display text-[#14110F] mb-6">
              Deliverables
            </h2>
            <ul className="space-y-4">
              {service.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#423C36]">
                  <span className="w-2 h-2 rounded-full bg-[#E85226] shrink-0 mt-2"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-[#E8E1D5] flex items-center gap-3 text-xs text-[#7C7267]">
              <Shield className="w-4 h-4 text-[#E85226]" />
              <span>Full commercial rights and source assets included in your client portal.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING & 5. PACKAGES */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E85226] font-bold block mb-1">
            Flat Transparent Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#14110F]">
            Standard Packages
          </h2>
          <p className="text-sm text-[#6B6158] mt-2">
            Clear rates defined for immediate checkout or client onboarding. No hidden freelance surcharges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-6 sm:p-8 flex flex-col justify-between border rounded-sm transition-all ${
                pkg.popular
                  ? 'border-[#E85226] bg-[#14110F] text-[#FAF7F2] shadow-xl relative overflow-hidden'
                  : 'border-[#E8E1D5] bg-white text-[#14110F] shadow-sm hover:border-[#E85226]'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#E85226] to-[#F59E0B]" />
              )}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg font-display">{pkg.name}</h3>
                  {pkg.popular && (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#E85226] text-white uppercase font-bold rounded-xs">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className={`text-3xl font-bold font-mono tracking-tight ${pkg.popular ? 'text-white' : 'text-[#14110F]'}`}>
                    {pkg.priceDisplay}
                  </span>
                  {pkg.unit && (
                    <span className={`text-xs ml-1 ${pkg.popular ? 'text-[#A69B90]' : 'text-[#7C7267]'}`}>
                      {pkg.unit}
                    </span>
                  )}
                </div>

                {pkg.description && (
                  <p className={`text-xs leading-relaxed mb-6 ${pkg.popular ? 'text-[#C9BFB5]' : 'text-[#6B6158]'}`}>
                    {pkg.description}
                  </p>
                )}
              </div>

              <button
                onClick={handleStartProject}
                className={`w-full py-3.5 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer text-center rounded-xs ${
                  pkg.popular
                    ? 'bg-[#E85226] text-white hover:bg-[#D44218] shadow-md'
                    : 'bg-[#FAF7F2] text-[#14110F] border border-[#E8E1D5] hover:border-[#E85226] hover:text-[#E85226]'
                }`}
              >
                Start a Project
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PROCESS */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16 border-t border-[#E8E1D5]">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#7C7267] font-bold block mb-1">
            Turnaround Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#14110F]">
            Production Process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {service.processSteps.map((step) => (
            <div key={step.step} className="border-l-2 border-[#E85226] pl-5 space-y-2">
              <span className="font-mono text-2xl font-bold text-[#E85226]">{step.step}</span>
              <h3 className="font-bold text-sm text-[#14110F] font-display">{step.title}</h3>
              <p className="text-xs text-[#6B6158] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16 border-t border-[#E8E1D5]">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7C7267] font-bold block mb-1">
              Common Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#14110F]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4 max-w-3xl">
            {service.faqs.map((faq, idx) => (
              <div key={idx} className="p-6 bg-white border border-[#E8E1D5] space-y-2 rounded-sm shadow-xs">
                <h3 className="font-bold text-sm text-[#14110F] flex items-center gap-2 font-display">
                  <HelpCircle className="w-4 h-4 text-[#E85226] shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-xs text-[#5C544D] leading-relaxed pl-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. CTA */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-12">
        <div className="p-8 sm:p-14 bg-[#14110F] text-[#FAF7F2] text-center max-w-4xl mx-auto space-y-6 rounded-md shadow-2xl border border-[#2B2420]">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E85226] font-bold">
            Ready to Begin?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            Let's Produce Your Next{' '}
            <span className="font-serif-italic font-normal text-gradient-warm">{service.name}.</span>
          </h2>
          <p className="text-sm text-[#A69B90] max-w-lg mx-auto leading-relaxed">
            You bring the idea or raw assets. We take care of the entire execution pipeline.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartProject}
              className="px-8 py-4 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all inline-flex items-center gap-2 cursor-pointer rounded-sm shadow-lg hover:-translate-y-0.5"
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

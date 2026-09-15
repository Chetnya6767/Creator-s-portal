import React, { useState } from 'react';
import { ArrowUpRight, Check, HelpCircle, Sparkles } from 'lucide-react';
import { SERVICE_CATEGORIES, INITIAL_SERVICES } from '../data/servicesData';
import { trackEvent } from '../services/analytics';

interface ServicesPageProps {
  navigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCategories = selectedCategory === 'all'
    ? SERVICE_CATEGORIES
    : SERVICE_CATEGORIES.filter((c) => c.id === selectedCategory);

  const handleStart = (serviceName?: string) => {
    trackEvent('start_project', { service: serviceName || 'all_services' });
    navigate('/start-project');
  };

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2]">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 mb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF4ED] text-[#C44219] text-xs font-mono uppercase tracking-wider mb-4 border border-[#FED7AA] rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
            <span>Central Production Directory</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-[#14110F] mb-6">
            Four Disciplines.
            <br />
            <span className="font-serif-italic font-normal text-gradient-warm">Nine Creator Services.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#564E47] leading-relaxed">
            Every service is engineered to remove creative bottlenecks. Clear fixed pricing, strict turnaround expectations, and zero hidden freelance surcharges.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-[#E8E1D5] pb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-sm ${
              selectedCategory === 'all'
                ? 'bg-[#E85226] text-white shadow-[0_3px_12px_rgba(232,82,38,0.3)]'
                : 'bg-white border border-[#E8E1D5] text-[#60574F] hover:text-[#14110F] hover:border-[#E85226]'
            }`}
          >
            All Disciplines
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-sm ${
                selectedCategory === cat.id
                  ? 'bg-[#E85226] text-white shadow-[0_3px_12px_rgba(232,82,38,0.3)]'
                  : 'bg-white border border-[#E8E1D5] text-[#60574F] hover:text-[#14110F] hover:border-[#E85226]'
              }`}
            >
              {cat.number} {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Services List by Category */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-20">
        {filteredCategories.map((category) => (
          <div key={category.id} className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#14110F] pb-3 gap-2">
              <div>
                <span className="text-xs font-mono text-[#E85226] uppercase tracking-wider font-bold">
                  CATEGORY {category.number}
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#14110F]">
                  {category.name}
                </h2>
              </div>
              <p className="text-xs text-[#7C7267] max-w-md font-mono">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {category.services.map((service) => (
                <div
                  key={service.slug}
                  className="bg-white border border-[#E8E1D5] p-6 sm:p-8 flex flex-col justify-between warm-card-hover rounded-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-[#14110F] font-display">
                          {service.name}
                        </h3>
                        <span className="text-xs font-mono text-[#E85226] font-bold">
                          Starting {service.startingPriceDisplay}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/services/${service.slug}`)}
                        className="px-3 py-1.5 border border-[#14110F] text-xs font-semibold hover:bg-[#14110F] hover:text-white transition-colors flex items-center gap-1 rounded-sm"
                      >
                        View Guide <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-sm text-[#5C544D] leading-relaxed mb-6">{service.shortDesc}</p>

                    {/* Packages Table */}
                    <div className="space-y-2 mb-6">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#8A8075] font-semibold">
                        Standard Packages & Rates
                      </div>
                      <div className="border border-[#ECE5DA] divide-y divide-[#ECE5DA] rounded-sm overflow-hidden">
                        {service.packages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="p-3 flex items-center justify-between text-xs bg-[#FAF7F2] hover:bg-white transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#14110F]">{pkg.name}</span>
                              {pkg.popular && (
                                <span className="bg-[#FFF4ED] text-[#C44219] text-[10px] font-mono px-2 py-0.5 border border-[#FED7AA] rounded-full font-bold">
                                  Standard Choice
                                </span>
                              )}
                            </div>
                            <div className="font-mono font-bold text-[#14110F]">
                              {pkg.priceDisplay}
                              {pkg.unit && <span className="text-[11px] text-[#7C7267] font-normal ml-1">{pkg.unit}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/services/${service.slug}`)}
                      className="text-xs font-semibold text-[#5C544D] hover:text-[#E85226] underline underline-offset-4"
                    >
                      Read Deliverables & Process
                    </button>
                    <button
                      onClick={() => handleStart(service.name)}
                      className="px-4 py-2 bg-[#E85226] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#D44218] transition-all cursor-pointer rounded-sm shadow-sm"
                    >
                      Start a Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Central Pricing Guarantee Callout */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 mt-24">
        <div className="p-8 sm:p-12 bg-[#161311] border border-[#2E2824] text-white flex flex-col md:flex-row items-center justify-between gap-8 rounded-sm shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-bold">Dedicated Pods</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display">
              Need a Custom Retainer or Series Pod?
            </h3>
            <p className="text-sm text-[#A69B90] leading-relaxed">
              We structure monthly content pods for ongoing series, podcasts, and daily social publishing. We match you with dedicated producers and reliable turnaround windows.
            </p>
          </div>
          <button
            onClick={() => navigate('/start-project')}
            className="px-8 py-4 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all cursor-pointer whitespace-nowrap rounded-sm shadow-[0_4px_18px_rgba(232,82,38,0.4)]"
          >
            Start a Project
          </button>
        </div>
      </section>
    </div>
  );
};

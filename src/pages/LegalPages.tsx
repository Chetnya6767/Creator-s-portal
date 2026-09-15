import React from 'react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'refund';
  navigate: (path: string) => void;
}

export const LegalPages: React.FC<LegalPageProps> = ({ type, navigate }) => {
  const contactEmail = (import.meta as any).env?.CONTACT_EMAIL || '[Email to be configured]';

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2]">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 bg-white border border-[#E8E1D5] p-8 sm:p-12 space-y-8 rounded-sm shadow-sm">
        {type === 'privacy' && (
          <article className="space-y-6 text-sm text-[#524A43] leading-relaxed">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF4ED] text-[#C44219] text-xs font-mono uppercase tracking-wider mb-3 border border-[#FED7AA] rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
                Legal Documentation
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#14110F] mt-1">
                Privacy Policy
              </h1>
              <p className="text-xs text-[#7C7267] font-mono mt-1">Last Updated: January 2026</p>
            </div>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#14110F] font-display">1. Information We Collect</h2>
              <p>
                Production Partner collects project information you submit when initiating a creative order, including your full name, brand handle, email address, phone number, creative brief materials, reference links, and attached design files.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#14110F] font-display">2. How Your Data Is Utilized</h2>
              <p>
                We use your information exclusively to produce requested media deliverables, communicate project timelines and revisions in the client portal, generate transaction receipts, and dispatch verified delivery notifications. We never sell or license client contact lists.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#14110F] font-display">3. Asset Security & Confidentiality</h2>
              <p>
                All unreleased scripts, footage, prototype visual branding, and raw files shared with Production Partner remain your exclusive intellectual property. We maintain strict confidentiality prior to your public launch or broadcast.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#14110F] font-display">4. Contact & Inquiries</h2>
              <p>
                Questions concerning data processing may be directed to our data compliance officer at: <strong className="font-mono text-[#E85226]">{contactEmail}</strong>.
              </p>
            </section>
          </article>
        )}

        {type === 'terms' && (
          <article className="space-y-6 text-sm text-[#524A43] leading-relaxed">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF4ED] text-[#C44219] text-xs font-mono uppercase tracking-wider mb-3 border border-[#FED7AA] rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
                Legal Documentation
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#14110F] mt-1">
                Terms and Conditions
              </h1>
              <p className="text-xs text-[#7C7267] font-mono mt-1">Last Updated: January 2026</p>
            </div>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#14110F] font-display">1. Creative Scope & Deliverables</h2>
              <p>
                By commissioning a production sprint through Production Partner, you agree that final output specifications, revision cycles, and asset formats correspond strictly to the published tier or written custom proposal agreed upon during order initialization.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#14110F] font-display">2. Payment & Verification</h2>
              <p>
                Work begins once payment has reached verified status through our payment gateway webhook or manual administrative audit. In accordance with studio policy, client-side claims of payment without bank reconciliation do not obligate immediate asset delivery.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#14110F] font-display">3. Commercial Usage Rights</h2>
              <p>
                Upon final invoice settlement and delivery sign-off, full worldwide commercial publishing rights to completed renders, edited video cuts, thumbnails, and compiled codebases transfer unconditionally to the client.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#14110F] font-display">4. Revisions & Approvals</h2>
              <p>
                Standard tiers include two comprehensive revision cycles following initial rough delivery. Additional creative pivots outside the initial brief are billed transparently at published hourly or package rates.
              </p>
            </section>
          </article>
        )}

        {type === 'refund' && (
          <article className="space-y-6 text-sm text-[#524A43] leading-relaxed">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF4ED] text-[#C44219] text-xs font-mono uppercase tracking-wider mb-3 border border-[#FED7AA] rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
                Legal Documentation
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#14110F] mt-1">
                Refund & Cancellation Policy
              </h1>
              <p className="text-xs text-[#7C7267] font-mono mt-1">Last Updated: January 2026</p>
            </div>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#14110F] font-display">1. Pre-Production Cancellation</h2>
              <p>
                If an order is cancelled prior to project allocation (while in ORDER RECEIVED or PAYMENT VERIFIED stage, before production work begins), a 100% refund is processed back to the original payment source minus standard banking transaction fees.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#14110F] font-display">2. In-Production Work</h2>
              <p>
                Once an order transitions to IN PRODUCTION, dedicated artist hours, 3D render clusters, and engineering resources have been committed. Cancellations during active production are evaluated on a pro-rata basis corresponding to delivered milestones.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#14110F] font-display">3. Revision Guarantee</h2>
              <p>
                We do not abandon projects. If the initial cut or deliverable does not match your brief, our producers will collaborate closely through the included revision rounds to achieve full artistic and technical satisfaction.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#14110F] font-display">4. Refund Inquiries</h2>
              <p>
                To initiate an inquiry or file a cancellation request, submit your Project ID and bank UTR to: <strong className="font-mono text-[#E85226]">{contactEmail}</strong>.
              </p>
            </section>
          </article>
        )}

        <div className="pt-6 border-t border-[#E8E1D5] flex justify-between items-center text-xs">
          <button
            onClick={() => navigate('/')}
            className="text-[#6B6158] hover:text-[#14110F] font-mono cursor-pointer transition-colors"
          >
            ← Return to Studio Home
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="text-[#E85226] hover:underline font-mono font-semibold cursor-pointer"
          >
            Contact Legal Team →
          </button>
        </div>
      </div>
    </div>
  );
};

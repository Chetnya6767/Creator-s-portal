import React, { useState } from 'react';
import { ArrowUpRight, Check, Mail, MessageSquare, Send, Sparkles } from 'lucide-react';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Production Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactEmail = (import.meta as any).env?.CONTACT_EMAIL || '[Email to be configured]';
  // Formspree Contact Form Endpoint
  // Set VITE_FORMSPREE_CONTACT_ENDPOINT in .env file to enable direct email forwarding
  const formspreeEndpoint = (import.meta as any).env?.VITE_FORMSPREE_CONTACT_ENDPOINT || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formspreeEndpoint) {
      try {
        await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name, email, subject, message }),
        });
      } catch (err) {
        console.warn('Formspree dispatch error:', err);
      }
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left: Studio Information */}
          <div className="md:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF4ED] text-[#C44219] text-xs font-mono uppercase tracking-wider mb-4 border border-[#FED7AA] rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
                <span>Studio Communications</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-[#14110F] mb-4 leading-[1.1]">
                Direct Producer{' '}
                <span className="font-serif-italic font-normal text-gradient-warm">Dialogue.</span>
              </h1>
              <p className="text-sm sm:text-base text-[#564E47] leading-relaxed">
                Have a unique production inquiry, monthly retainer question, or technical consultation need? Reach our executive production team directly.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-[#E8E1D5]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border border-[#E8E1D5] text-[#E85226] rounded-sm shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-[#7C7267] font-semibold block">Direct Studio Email</span>
                  <span className="text-sm font-mono text-[#14110F] font-bold">{contactEmail}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border border-[#E8E1D5] text-[#E85226] rounded-sm shadow-xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-[#7C7267] font-semibold block">Client Portal & Chat</span>
                  <p className="text-xs text-[#6B6158] mt-0.5 leading-relaxed">
                    Registered clients can log into the client portal for real-time messaging with dedicated producers.
                  </p>
                  <button
                    onClick={() => navigate('/portal')}
                    className="mt-2 text-xs font-semibold text-[#E85226] hover:text-[#D44218] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Open Client Portal →
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#161311] text-white space-y-3 rounded-sm border border-[#2B2420] shadow-xl">
              <span className="text-[10px] font-mono uppercase text-[#E85226] font-bold tracking-wider block">Direct Pipeline</span>
              <h3 className="font-bold font-display text-lg text-white">
                Ready to start an active project?
              </h3>
              <p className="text-xs text-[#A69B90] leading-relaxed">
                Skip general inquiries and jump directly into the step-by-step onboarding pipeline with upfront pricing.
              </p>
              <button
                onClick={() => navigate('/start-project')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#E85226] px-5 py-2.5 hover:bg-[#D44218] transition-all rounded-sm shadow-md mt-2 cursor-pointer"
              >
                Start a Project <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="md:col-span-7 bg-white border border-[#E8E1D5] p-8 sm:p-10 rounded-sm shadow-sm">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto bg-[#E85226] text-white flex items-center justify-center rounded-full shadow-lg">
                  <Check className="w-7 h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#14110F]">
                  Message Dispatched.
                </h2>
                <p className="text-xs sm:text-sm text-[#6B6158] max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. A studio producer will review your inquiry and respond within 24 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 border border-[#E8E1D5] text-xs font-semibold uppercase tracking-wider text-[#14110F] hover:border-[#E85226] hover:text-[#E85226] transition-colors rounded-sm"
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold font-display text-[#14110F]">
                    Send a Message
                  </h2>
                  <p className="text-xs text-[#6B6158] mt-1">
                    Fill out the form below and an executive producer will respond promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-xs bg-[#FAF7F2] rounded-sm transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@channel.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-xs bg-[#FAF7F2] rounded-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-xs bg-[#FAF7F2] rounded-sm"
                  >
                    <option value="Production Inquiry">Production Inquiry</option>
                    <option value="Custom Retainer Proposal">Custom Retainer Proposal</option>
                    <option value="Enterprise / High-Volume Brand Work">Enterprise / High-Volume Brand Work</option>
                    <option value="Technical Collaboration">Technical Collaboration</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                    Message Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us what you're working on, expected milestones, or any questions about our pipeline."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-xs bg-[#FAF7F2] rounded-sm transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-sm shadow-[0_4px_16px_rgba(232,82,38,0.35)] hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      'Dispatching...'
                    ) : (
                      <>
                        Dispatch Message
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

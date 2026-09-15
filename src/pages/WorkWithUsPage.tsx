import React, { useState } from 'react';
import { ArrowUpRight, Check, Sparkles, UserCheck } from 'lucide-react';
import { submitApplication } from '../services/db';

interface WorkWithUsPageProps {
  navigate: (path: string) => void;
}

export const WorkWithUsPage: React.FC<WorkWithUsPageProps> = ({ navigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Video Editor');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [experience, setExperience] = useState('3-5 years');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formspree Integration Note:
  // To route applications to Formspree, set VITE_FORMSPREE_WORK_ENDPOINT in .env
  // Example: https://formspree.io/f/your_form_id
  const formspreeEndpoint = (import.meta as any).env?.VITE_FORMSPREE_WORK_ENDPOINT || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Always store to database for Admin Roster visibility
      await submitApplication({
        fullName,
        email,
        role,
        portfolioUrl,
        experience,
        notes,
      });

      // 2. If Formspree endpoint is configured, forward submission via HTTP POST
      if (formspreeEndpoint) {
        try {
          await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ fullName, email, role, portfolioUrl, experience, notes }),
          });
        } catch (err) {
          console.warn('Formspree webhook dispatch skipped/failed:', err);
        }
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF4ED] text-[#C44219] text-xs font-mono uppercase tracking-wider mb-4 border border-[#FED7AA] rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
            <span>Creative & Technical Roster</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-[#14110F] mb-4 leading-[1.1]">
            Build With{' '}
            <span className="font-serif-italic font-normal text-gradient-warm">Production Partner.</span>
          </h1>
          <p className="text-base text-[#564E47] leading-relaxed">
            We partner with exceptional 3D artists, video editors, thumbnail designers, frontend engineers, and technical producers. We run disciplined sprint workflows with guaranteed compensation and zero client billing hassle.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-10 bg-white border border-[#E85226]/40 text-center space-y-4 rounded-md shadow-xl">
            <div className="w-14 h-14 mx-auto bg-[#E85226] text-white flex items-center justify-center rounded-full shadow-md">
              <Check className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#14110F]">
              Application Received.
            </h2>
            <p className="text-sm text-[#6B6158] max-w-md mx-auto leading-relaxed">
              Our lead producer reviews portfolio links weekly. When an upcoming project aligns with your visual or technical style, we'll reach out directly.
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-[#E85226] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#D44218] transition-colors rounded-sm shadow-sm"
              >
                Return to Studio Home
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#E8E1D5] p-8 sm:p-10 rounded-sm shadow-sm">
            {/* Formspree Code Comment Notice */}
            {/* 
              FORMSPREE INTEGRATION:
              This form seamlessly posts to Formspree when VITE_FORMSPREE_WORK_ENDPOINT is declared in your .env file.
            */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your legal or creator name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@studio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                    Specialized Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm"
                  >
                    <option value="CGI & 3D Artist">CGI & 3D Artist (Blender / Cinema4D)</option>
                    <option value="Long-Form Video Editor">Long-Form Video Editor (Premiere / DaVinci)</option>
                    <option value="Short-Form Retention Specialist">Short-Form Retention Specialist</option>
                    <option value="Thumbnail & Graphic Designer">Thumbnail & Graphic Designer</option>
                    <option value="AI Image Artist & Art Director">AI Image Artist & Art Director</option>
                    <option value="Frontend Web Developer">Frontend Web Developer (TypeScript / React)</option>
                    <option value="Creator Hardware Specialist">Creator Hardware & OBS Specialist</option>
                    <option value="Motion Designer">Motion Designer (After Effects)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                    Years of Experience
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm"
                  >
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years senior</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                  Portfolio URL (Website, Behance, YouTube channel, Google Drive, GitHub) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] font-mono text-xs rounded-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                  Notes, Software Stack, or Creative Philosophy
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about the kinds of creators or visual projects you enjoy producing most, your rendering pipeline, or your typical turnaround."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-[#E8E1D5] flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 rounded-sm shadow-[0_4px_16px_rgba(232,82,38,0.35)] hover:-translate-y-0.5"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application to Roster'}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

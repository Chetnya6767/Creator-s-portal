import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CreditCard,
  FileText,
  HelpCircle,
  QrCode,
  Shield,
  Upload,
  User,
  AlertCircle,
} from 'lucide-react';
import { INITIAL_SERVICES } from '../data/servicesData';
import {
  FileAttachment,
  PaymentApp,
  PaymentStatus,
  ProjectOrder,
} from '../types';
import { createOrder, submitManualVerification } from '../services/db';
import { defaultPaymentProvider, PaymentIntent } from '../services/paymentProvider';
import { trackEvent } from '../services/analytics';

interface StartProjectPageProps {
  navigate: (path: string) => void;
}

export const StartProjectPage: React.FC<StartProjectPageProps> = ({ navigate }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  // Step 1: About You
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [brandName, setBrandName] = useState('');

  // Step 2: What do you need?
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState<{ [serviceId: string]: string }>({});

  // Step 3: Project Details
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);

  // Step 4 & 5 State
  const [generatedProjectId, setGeneratedProjectId] = useState<string>('');
  const [createdOrder, setCreatedOrder] = useState<ProjectOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  // Step 5: Payment
  const [selectedPaymentApp, setSelectedPaymentApp] = useState<PaymentApp>('Google Pay');
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);

  // Manual Verification Fallback Modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualNote, setManualNote] = useState('');
  const [manualSubmitted, setManualSubmitted] = useState(false);

  // Calculate pricing
  const calculateTotal = () => {
    let total = 0;
    let hasCustomQuote = false;

    if (selectedServices.length === 0) return { total: 0, hasCustomQuote: true };

    selectedServices.forEach((serviceId) => {
      const service = INITIAL_SERVICES.find((s) => s.id === serviceId);
      if (!service) return;

      const packageId = selectedPackageIds[serviceId];
      if (!packageId) {
        // default first package
        const firstPkg = service.packages[0];
        if (firstPkg && firstPkg.price !== null) {
          total += firstPkg.price;
        } else {
          hasCustomQuote = true;
        }
      } else {
        const pkg = service.packages.find((p) => p.id === packageId);
        if (pkg && pkg.price !== null) {
          total += pkg.price;
        } else {
          hasCustomQuote = true;
        }
      }
    });

    return { total, hasCustomQuote };
  };

  const { total: calculatedTotal, hasCustomQuote } = calculateTotal();

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceId));
      const nextPackages = { ...selectedPackageIds };
      delete nextPackages[serviceId];
      setSelectedPackageIds(nextPackages);
    } else {
      setSelectedServices([...selectedServices, serviceId]);
      const service = INITIAL_SERVICES.find((s) => s.id === serviceId);
      if (service && service.packages.length > 0) {
        setSelectedPackageIds({ ...selectedPackageIds, [serviceId]: service.packages[0].id });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: FileAttachment[] = [];
    Array.from(files).forEach((file: File) => {
      newAttachments.push({
        name: file.name,
        size: file.size,
        type: file.type,
      });
    });

    setAttachments([...attachments, ...newAttachments]);
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!fullName.trim()) return 'Please provide your full name.';
    if (!email.trim() || !email.includes('@')) return 'Please provide a valid email address.';
    if (!phone.trim()) return 'Please provide your contact phone number.';
    return '';
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (selectedServices.length === 0) return 'Please select at least one service.';
    return '';
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (!description.trim()) return 'Please share a brief description of what you are building.';
    return '';
  };

  // Handle Next
  const handleNext = async () => {
    setValidationError('');

    if (currentStep === 1) {
      const err = validateStep1();
      if (err) {
        setValidationError(err);
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const err = validateStep2();
      if (err) {
        setValidationError(err);
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      const err = validateStep3();
      if (err) {
        setValidationError(err);
        return;
      }

      // Generate unique Project ID
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const projectId = `PROJECT-${new Date().getFullYear()}-${randomNum}`;
      setGeneratedProjectId(projectId);
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      // Create order in database
      setIsSubmitting(true);
      try {
        const selectedServiceNames = selectedServices.map((id) => {
          const s = INITIAL_SERVICES.find((srv) => srv.id === id);
          return s ? s.name : id;
        });

        const newOrder: ProjectOrder = {
          id: generatedProjectId,
          projectId: generatedProjectId,
          clientName: fullName,
          email: email.trim().toLowerCase(),
          phone,
          brandName: brandName || fullName,
          services: selectedServiceNames,
          serviceSlugs: selectedServices,
          packageName: Object.values(selectedPackageIds).join(', ') || 'Custom Scope',
          description,
          deadline,
          budgetRange,
          referenceLinks,
          notes,
          attachments,
          expectedAmount: hasCustomQuote ? 0 : calculatedTotal,
          isCustomQuote: hasCustomQuote,
          currency: 'INR',
          status: 'ORDER RECEIVED',
          paymentStatus: 'PENDING',
          selectedPaymentApp,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deliverables: [],
        };

        const savedOrder = await createOrder(newOrder);
        setCreatedOrder(savedOrder);
        trackEvent('project_submitted', { projectId: generatedProjectId, amount: savedOrder.expectedAmount });

        // If not custom quote, generate payment QR
        if (!hasCustomQuote && calculatedTotal > 0) {
          setIsGeneratingPayment(true);
          const intent = await defaultPaymentProvider.createPayment(savedOrder, selectedPaymentApp);
          setPaymentIntent(intent);
          setIsGeneratingPayment(false);
        }

        setCurrentStep(5);
      } catch (error) {
        console.error('Error submitting order:', error);
        setValidationError('An error occurred creating your project. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleUpdatePaymentApp = async (app: PaymentApp) => {
    setSelectedPaymentApp(app);
    if (createdOrder && !hasCustomQuote && calculatedTotal > 0) {
      setIsGeneratingPayment(true);
      const updatedIntent = await defaultPaymentProvider.createPayment(createdOrder, app);
      setPaymentIntent(updatedIntent);
      setIsGeneratingPayment(false);
    }
  };

  const handleManualVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdOrder) return;

    await submitManualVerification({
      orderId: createdOrder.id,
      transactionIdUtr: utrNumber.trim() || 'MANUAL-UTR-SUBMITTED',
      paymentApp: selectedPaymentApp,
      amountPaid: parseFloat(manualAmount) || createdOrder.expectedAmount,
      dateTime: new Date().toISOString(),
      screenshotNote: manualNote,
    });

    setManualSubmitted(true);
  };

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Step Indicator Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#7C7267] mb-3">
            <span className="font-semibold text-[#A3592E]">Project Initialization Flow</span>
            <span className="text-[#E85226] font-bold">Step 0{currentStep} of 05</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 h-1.5 bg-[#E8E1D5] rounded-full overflow-hidden">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-full transition-all duration-300 ${
                  step <= currentStep ? 'bg-[#E85226]' : 'bg-transparent'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between text-[11px] font-mono text-[#8A8075] mt-2 hidden sm:flex">
            <span className={currentStep === 1 ? 'font-bold text-[#14110F]' : ''}>01 You</span>
            <span className={currentStep === 2 ? 'font-bold text-[#14110F]' : ''}>02 Services</span>
            <span className={currentStep === 3 ? 'font-bold text-[#14110F]' : ''}>03 Details</span>
            <span className={currentStep === 4 ? 'font-bold text-[#14110F]' : ''}>04 Review</span>
            <span className={currentStep === 5 ? 'font-bold text-[#14110F]' : ''}>05 Payment</span>
          </div>
        </div>

        {validationError && (
          <div className="mb-6 p-4 bg-[#FFF4ED] border border-[#FED7AA] text-[#C44219] text-xs flex items-center gap-2 rounded-sm shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 1: ABOUT YOU */}
        {currentStep === 1 && (
          <div className="bg-white border border-[#E8E1D5] p-8 sm:p-10 space-y-6 rounded-sm shadow-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#E85226] font-bold">Step 01</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#14110F] mt-1">
                About You & Your Brand
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6158] mt-1">
                Tell us who you are and where we can reach you regarding deliverables.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                  Full Name *
                </label>
                <input
                  id="start-name"
                  type="text"
                  placeholder="e.g. Alex Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                  Email Address *
                </label>
                <input
                  id="start-email"
                  type="email"
                  placeholder="e.g. alex@creatorstudio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                  Phone Number *
                </label>
                <input
                  id="start-phone"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                  Creator / Channel / Brand Name
                </label>
                <input
                  id="start-brand"
                  type="text"
                  placeholder="e.g. Vance Tech Media"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm transition-colors"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E1D5] flex justify-end">
              <button
                onClick={handleNext}
                className="px-8 py-3.5 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all flex items-center gap-2 cursor-pointer rounded-sm shadow-[0_4px_16px_rgba(232,82,38,0.35)]"
              >
                Continue to Services
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: WHAT DO YOU NEED? */}
        {currentStep === 2 && (
          <div className="bg-white border border-[#E8E1D5] p-8 sm:p-10 space-y-6 rounded-sm shadow-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#E85226] font-bold">Step 02</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#14110F] mt-1">
                What Do You Need?
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6158] mt-1">
                Select one or multiple services. You can adjust package quantities or select custom scopes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {INITIAL_SERVICES.map((s) => {
                const isSelected = selectedServices.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className={`p-4 border transition-all cursor-pointer flex flex-col justify-between rounded-sm ${
                      isSelected
                        ? 'border-[#E85226] bg-[#FFF4ED] ring-1 ring-[#E85226] shadow-xs'
                        : 'border-[#E8E1D5] hover:border-[#E85226] bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-[#A3592E] uppercase font-semibold">{s.categoryName}</span>
                        <div
                          className={`w-4 h-4 border flex items-center justify-center rounded-xs ${
                            isSelected ? 'bg-[#E85226] border-[#E85226] text-white' : 'border-[#CCC]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <h3 className="font-bold text-sm text-[#14110F] font-display">{s.name}</h3>
                      <p className="text-[11px] text-[#6B6158] mt-1 line-clamp-2">{s.shortDesc}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#E8E1D5] text-[11px] font-mono font-bold text-[#E85226]">
                      {s.startingPriceDisplay}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* If services selected, pick specific packages */}
            {selectedServices.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#E8E1D5] space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                  Select Package Tier for Selected Services:
                </h4>
                <div className="space-y-3">
                  {selectedServices.map((srvId) => {
                    const s = INITIAL_SERVICES.find((item) => item.id === srvId);
                    if (!s) return null;
                    return (
                      <div key={s.id} className="p-4 bg-[#FAF7F2] border border-[#E8E1D5] rounded-sm">
                        <div className="text-xs font-bold text-[#14110F] mb-2 font-display">{s.name}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                          {s.packages.map((pkg) => (
                            <button
                              key={pkg.id}
                              type="button"
                              onClick={() => setSelectedPackageIds({ ...selectedPackageIds, [s.id]: pkg.id })}
                              className={`p-2.5 text-left border text-xs transition-all rounded-xs ${
                                selectedPackageIds[s.id] === pkg.id
                                  ? 'bg-[#E85226] text-white border-[#E85226] shadow-xs'
                                  : 'bg-white text-[#524A43] border-[#E8E1D5] hover:border-[#E85226]'
                              }`}
                            >
                              <div className="font-semibold">{pkg.name}</div>
                              <div className="font-mono text-[11px] mt-0.5">{pkg.priceDisplay}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-[#E8E1D5] flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs font-mono uppercase text-[#7C7267] hover:text-[#14110F] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-3.5 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all flex items-center gap-2 cursor-pointer rounded-sm shadow-[0_4px_16px_rgba(232,82,38,0.35)]"
              >
                Continue to Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROJECT DETAILS */}
        {currentStep === 3 && (
          <div className="bg-white border border-[#E8E1D5] p-8 sm:p-10 space-y-6 rounded-sm shadow-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#E85226] font-bold">Step 03</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#14110F] mt-1">
                Project Details & Scope
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6158] mt-1">
                Share what you are building, any deadlines, references, and files.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                  Project Description *
                </label>
                <textarea
                  id="start-desc"
                  rows={4}
                  placeholder="Describe your vision, subject matter, target audience, format preferences, and what success looks like."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                    Target Deadline
                  </label>
                  <input
                    id="start-deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                    Budget Range
                  </label>
                  <select
                    id="start-budget"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm"
                  >
                    <option value="">Select an approximate range</option>
                    <option value="Under ₹5,000">Under ₹5,000</option>
                    <option value="₹5,000 – ₹15,000">₹5,000 – ₹15,000</option>
                    <option value="₹15,000 – ₹50,000">₹15,000 – ₹50,000</option>
                    <option value="₹50,000+ / Retainer">₹50,000+ / Retainer</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                  Reference Links (YouTube, Figma, Google Drive, Pinterest)
                </label>
                <input
                  id="start-refs"
                  type="text"
                  placeholder="https://..."
                  value={referenceLinks}
                  onChange={(e) => setReferenceLinks(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                  Additional Notes or Formatting Instructions
                </label>
                <input
                  id="start-notes"
                  type="text"
                  placeholder="Any specific pacing, aspect ratio (9:16 vs 16:9), or technical requirements."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-sm"
                />
              </div>

              {/* File Uploads */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                  Attach Assets or Brief (Optional)
                </label>
                <div className="border border-dashed border-[#FED7AA] p-6 text-center bg-[#FFF4ED] rounded-sm">
                  <input
                    id="start-files"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="start-files"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-[#E85226] text-xs font-semibold uppercase tracking-wider text-[#E85226] hover:bg-[#E85226] hover:text-white transition-colors rounded-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Choose Files
                  </label>
                  <p className="text-[11px] text-[#A3592E] mt-2">
                    Scripts, voiceovers, product images, or PDF creative briefs.
                  </p>

                  {attachments.length > 0 && (
                    <div className="mt-4 text-left border-t border-[#FED7AA] pt-3 space-y-1">
                      {attachments.map((file, i) => (
                        <div key={i} className="text-xs text-[#14110F] flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[#E85226]" />
                          <span className="font-medium">{file.name}</span>
                          <span className="text-[10px] text-[#8A8075]">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E1D5] flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs font-mono uppercase text-[#7C7267] hover:text-[#14110F] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-3.5 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all flex items-center gap-2 cursor-pointer rounded-sm shadow-[0_4px_16px_rgba(232,82,38,0.35)]"
              >
                Review Project Request
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW */}
        {currentStep === 4 && (
          <div className="bg-white border border-[#E8E1D5] p-8 sm:p-10 space-y-6 rounded-sm shadow-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#E85226] font-bold">Step 04</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#14110F] mt-1">
                Review Your Project Request
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6158] mt-1">
                Please verify the details before order registration.
              </p>
            </div>

            {/* Project ID Tag */}
            <div className="p-4 bg-[#FFF4ED] border border-[#FED7AA] flex items-center justify-between rounded-sm">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#A3592E] font-semibold block">Generated Unique Project ID</span>
                <span className="text-base font-bold font-mono text-[#14110F]">{generatedProjectId}</span>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 bg-[#E85226] text-white font-bold rounded-xs">System Verified</span>
            </div>

            {/* Review Card */}
            <div className="border border-[#E8E1D5] divide-y divide-[#E8E1D5] text-xs rounded-sm overflow-hidden">
              <div className="p-4 flex justify-between bg-white">
                <span className="font-mono text-[#7C7267] font-semibold">Client & Brand</span>
                <span className="font-semibold text-[#14110F] text-right">
                  {fullName} ({brandName || 'Independent'}) • {email}
                </span>
              </div>

              <div className="p-4 flex justify-between bg-white">
                <span className="font-mono text-[#7C7267] font-semibold">Requested Services</span>
                <span className="font-semibold text-[#14110F] text-right">
                  {selectedServices.map((id) => INITIAL_SERVICES.find((s) => s.id === id)?.name).join(', ')}
                </span>
              </div>

              <div className="p-4 flex justify-between bg-white">
                <span className="font-mono text-[#7C7267] font-semibold">Description</span>
                <span className="text-[#423C36] text-right max-w-md line-clamp-2">{description}</span>
              </div>

              {deadline && (
                <div className="p-4 flex justify-between bg-white">
                  <span className="font-mono text-[#7C7267] font-semibold">Target Deadline</span>
                  <span className="font-semibold text-[#14110F]">{deadline}</span>
                </div>
              )}

              {attachments.length > 0 && (
                <div className="p-4 flex justify-between bg-white">
                  <span className="font-mono text-[#7C7267] font-semibold">Attached Files</span>
                  <span className="font-semibold text-[#14110F]">{attachments.length} files attached</span>
                </div>
              )}

              <div className="p-4 flex justify-between items-center bg-[#FAF7F2]">
                <span className="font-mono uppercase text-[#7C7267] font-bold">Expected Order Amount</span>
                <span className="font-mono text-base font-bold text-[#E85226]">
                  {hasCustomQuote ? 'Custom Quote Required' : `₹${calculatedTotal.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E1D5] flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(3)}
                className="text-xs font-mono uppercase text-[#7C7267] hover:text-[#14110F] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Edit
              </button>
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 rounded-sm shadow-[0_4px_16px_rgba(232,82,38,0.35)]"
              >
                {isSubmitting ? 'Registering Order...' : 'Confirm & Proceed to Payment'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PAYMENT */}
        {currentStep === 5 && (
          <div className="bg-white border border-[#E8E1D5] p-8 sm:p-10 space-y-6 rounded-sm shadow-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#E85226] font-bold">Step 05</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#14110F] mt-1">
                Project Registration & Payment
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6158] mt-1">
                Order <span className="font-mono font-bold text-[#E85226]">{generatedProjectId}</span> has been logged to the studio database.
              </p>
            </div>

            {hasCustomQuote ? (
              /* CUSTOM QUOTE NOTICE */
              <div className="p-6 bg-[#FAF7F2] border-2 border-[#E85226]/40 space-y-4 rounded-sm">
                <div className="flex items-center gap-2 text-[#E85226] font-mono text-xs uppercase font-bold">
                  <Shield className="w-4 h-4" /> Custom Quote Required
                </div>
                <h3 className="text-lg font-bold text-[#14110F] font-display">
                  Your project requires a custom quote. We'll contact you with the final amount.
                </h3>
                <p className="text-xs sm:text-sm text-[#5C544D] leading-relaxed">
                  Because one or more selected services require bespoke engineering or consultation (such as Motion Graphics, App Architecture, or Workstation Optimization), we do not charge payment upfront. A producer will review your brief and send a precise quote directly to your client portal and email.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/portal')}
                    className="px-6 py-3 bg-[#E85226] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#D44218] transition-colors rounded-sm shadow-sm"
                  >
                    Open Client Portal
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 border border-[#E8E1D5] text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors rounded-sm"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            ) : (
              /* DEFINED PRICE PAYMENT GATEWAY */
              <div className="space-y-6">
                {/* Payment App Selection (MANDATORY REQUIREMENT) */}
                <div className="p-5 bg-[#FAF7F2] border border-[#E8E1D5] space-y-3 rounded-sm">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold block">
                    Which payment app are you using? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {(['FamApp', 'Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Other'] as PaymentApp[]).map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => handleUpdatePaymentApp(app)}
                        className={`p-2.5 text-xs font-semibold text-center border transition-all rounded-xs ${
                          selectedPaymentApp === app
                            ? 'bg-[#E85226] text-white border-[#E85226] shadow-xs'
                            : 'bg-white text-[#524A43] border-[#E8E1D5] hover:border-[#E85226]'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#7C7267]">
                    Selected app is recorded for transaction reconciliation and UPI routing.
                  </p>
                </div>

                {/* QR Display & Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-[#E8E1D5] p-6 sm:p-8 rounded-sm bg-white">
                  <div className="text-center space-y-4">
                    <span className="text-xs font-mono uppercase text-[#7C7267] block font-semibold">Scan Dynamic UPI QR</span>

                    <div className="w-56 h-56 mx-auto bg-white border-2 border-[#E8E1D5] p-3 flex items-center justify-center shadow-xs rounded-sm">
                      {isGeneratingPayment ? (
                        <span className="text-xs font-mono text-[#7C7267]">Generating secure QR...</span>
                      ) : paymentIntent?.qrDataUrl ? (
                        <img
                          src={paymentIntent.qrDataUrl}
                          alt="UPI Payment QR"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-xs font-mono text-[#7C7267] flex flex-col items-center gap-1">
                          <QrCode className="w-8 h-8 text-[#E85226]" />
                          <span>QR Initialized</span>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-[#7C7267]">
                      Transaction Ref: <span className="font-bold text-[#14110F]">{generatedProjectId}</span>
                    </div>

                    {/* Mobile Pay Link */}
                    {paymentIntent?.qrPayload && (
                      <div className="pt-2 block sm:hidden">
                        <a
                          href={paymentIntent.qrPayload}
                          className="inline-block px-4 py-2 bg-[#E85226] text-white text-xs font-semibold uppercase tracking-wider rounded-sm shadow-sm"
                        >
                          Open in {selectedPaymentApp}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-5">
                    <div>
                      <span className="text-xs font-mono text-[#7C7267] block font-semibold">Order Amount Due</span>
                      <span className="text-4xl font-bold font-mono text-[#14110F]">
                        ₹{calculatedTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-[#524A43] leading-relaxed">
                      <p>
                        <strong className="text-[#14110F]">1. Scan with {selectedPaymentApp}:</strong> Scan the QR code or send payment using your banking app.
                      </p>
                      <p>
                        <strong className="text-[#14110F]">2. Automatic Webhook Reconciliation:</strong> Once received, the payment gateway sends a signed server webhook to verify the exact amount.
                      </p>
                      <p>
                        <strong className="text-[#14110F]">3. Tracking:</strong> You can track live production progress in your Client Portal at any moment.
                      </p>
                    </div>

                    {/* Fallback button */}
                    <div className="pt-4 border-t border-[#E8E1D5] space-y-3">
                      <button
                        onClick={() => setShowManualModal(true)}
                        className="text-xs font-mono text-[#E85226] hover:underline flex items-center gap-1 font-semibold"
                      >
                        Can't see your payment? (Submit UTR for manual verification)
                      </button>

                      <button
                        onClick={() => navigate('/portal')}
                        className="w-full py-3 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-colors rounded-sm shadow-md"
                      >
                        Open Client Portal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MANUAL PAYMENT VERIFICATION MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] border border-[#E85226]/40 max-w-md w-full p-6 sm:p-8 space-y-6 rounded-md shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E8E1D5] pb-3">
              <div>
                <h3 className="font-bold text-lg font-display text-[#14110F]">
                  Manual Payment Verification
                </h3>
                <span className="text-xs font-mono text-[#7C7267]">Order: {generatedProjectId}</span>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-[#8A8075] hover:text-[#E85226] font-mono text-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {manualSubmitted ? (
              <div className="space-y-4 py-4 text-center">
                <div className="w-12 h-12 mx-auto bg-[#E85226] text-white flex items-center justify-center rounded-full shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-[#14110F] font-display">Payment received for review.</h4>
                <p className="text-xs text-[#6B6158] leading-relaxed">
                  We'll verify your transaction shortly. You will not be marked as paid until the UTR is reconciled against the bank records.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowManualModal(false);
                      navigate('/portal');
                    }}
                    className="px-6 py-2.5 bg-[#E85226] text-white text-xs font-semibold uppercase tracking-wider rounded-sm shadow-md hover:bg-[#D44218]"
                  >
                    View Status in Client Portal
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleManualVerificationSubmit} className="space-y-4 text-xs">
                <p className="text-[#6B6158] leading-relaxed">
                  If your bank debited the payment but automatic webhook notification was delayed, submit your transaction ID (UTR) below for immediate administrative review.
                </p>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#14110F] font-semibold">Transaction ID / UTR *</label>
                  <input
                    type="text"
                    required
                    placeholder="12-digit UTR or Reference Number"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none bg-white font-mono rounded-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#14110F] font-semibold">Payment App</label>
                  <input
                    type="text"
                    value={selectedPaymentApp}
                    readOnly
                    className="w-full px-3 py-2 border border-[#E8E1D5] bg-[#ECE5DA] text-[#60574F] rounded-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#14110F] font-semibold">Amount Paid (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder={calculatedTotal.toString()}
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none bg-white font-mono rounded-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#14110F] font-semibold">Screenshot / Bank Note</label>
                  <input
                    type="text"
                    placeholder="Optional bank confirmation notes or screenshot link"
                    value={manualNote}
                    onChange={(e) => setManualNote(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none bg-white rounded-xs"
                  />
                </div>

                <div className="pt-3 border-t border-[#E8E1D5] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-4 py-2 border border-[#E8E1D5] text-xs font-semibold rounded-xs hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#E85226] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#D44218] rounded-xs shadow-sm"
                  >
                    Submit for Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Check,
  Clock,
  Download,
  FileText,
  HelpCircle,
  MessageSquare,
  Paperclip,
  Send,
  Shield,
  User,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  TIMELINE_STEPS,
  ProjectOrder,
  ProjectTimelineStep,
  ProjectMessage,
  PaymentStatus,
} from '../types';
import {
  getOrdersByEmail,
  getOrderById,
  getAllOrders,
  getProjectMessages,
  sendProjectMessage,
  submitManualVerification,
} from '../services/db';

interface ClientPortalPageProps {
  navigate: (path: string) => void;
}

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({ navigate }) => {
  // Auth state
  const [clientEmail, setClientEmail] = useState<string>('client@creatorstudio.com');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginInput, setLoginInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Orders State
  const [orders, setOrders] = useState<ProjectOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ProjectOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Messaging State
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState<string>('');
  const [sendingMsg, setSendingMsg] = useState<boolean>(false);

  // Manual Verification Fallback Modal
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [manualAmount, setManualAmount] = useState<string>('');
  const [manualNote, setManualNote] = useState<string>('');
  const [manualSubmitted, setManualSubmitted] = useState<boolean>(false);

  const contactEmail = (import.meta as any).env?.CONTACT_EMAIL || '[Email to be configured]';

  // Load orders for active client
  useEffect(() => {
    const fetchClientOrders = async () => {
      setLoading(true);
      try {
        let clientOrders: ProjectOrder[] = [];
        if (clientEmail.startsWith('PROJECT-')) {
          const single = await getOrderById(clientEmail);
          if (single) clientOrders = [single];
        } else {
          clientOrders = await getOrdersByEmail(clientEmail);
        }

        if (clientOrders.length === 0) {
          // Fallback check all orders for demo
          const all = await getAllOrders();
          clientOrders = all.slice(0, 2);
        }

        setOrders(clientOrders);
        if (clientOrders.length > 0) {
          setSelectedOrder(clientOrders[0]);
        }
      } catch (err) {
        console.error('Failed to load client orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchClientOrders();
    }
  }, [clientEmail, isAuthenticated]);

  // Load messages for selected order
  useEffect(() => {
    const fetchMsgs = async () => {
      if (!selectedOrder) return;
      try {
        const msgs = await getProjectMessages(selectedOrder.id);
        setMessages(msgs);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMsgs();

    const handleMessageSent = () => {
      fetchMsgs();
    };
    window.addEventListener('pp_message_sent', handleMessageSent);
    return () => window.removeEventListener('pp_message_sent', handleMessageSent);
  }, [selectedOrder]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const input = loginInput.trim();
    if (!input) {
      setLoginError('Please provide your project email or Project ID.');
      return;
    }

    setClientEmail(input);
    setIsAuthenticated(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedOrder) return;

    setSendingMsg(true);
    try {
      await sendProjectMessage({
        projectId: selectedOrder.id,
        sender: 'client',
        senderName: selectedOrder.clientName,
        message: newMessageText.trim(),
      });
      setNewMessageText('');
      const updated = await getProjectMessages(selectedOrder.id);
      setMessages(updated);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleManualVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    await submitManualVerification({
      orderId: selectedOrder.id,
      transactionIdUtr: utrNumber.trim() || 'MANUAL-UTR-SUBMITTED',
      paymentApp: selectedOrder.selectedPaymentApp || 'Other',
      amountPaid: parseFloat(manualAmount) || selectedOrder.expectedAmount,
      dateTime: new Date().toISOString(),
      screenshotNote: manualNote,
    });

    setManualSubmitted(true);
  };

  // Helper for step index
  const getStepIndex = (step: ProjectTimelineStep) => {
    return TIMELINE_STEPS.indexOf(step);
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 max-w-md mx-auto px-6 bg-[#FAF7F2]">
        <div className="bg-white border border-[#E8E1D5] p-8 space-y-6 rounded-md shadow-md">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#FFF4ED] text-[#C44219] text-[11px] font-mono uppercase tracking-wider mb-2 border border-[#FED7AA] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
              Client Access
            </div>
            <h1 className="text-2xl font-bold font-display text-[#14110F]">Client Portal Login</h1>
            <p className="text-xs text-[#6B6158]">
              Enter the email address you used during project registration or your unique Project ID.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-[#FFF4ED] border border-[#FED7AA] text-[#C44219] text-xs rounded-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#14110F] font-semibold">
                Email or Project ID
              </label>
              <input
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="client@creatorstudio.com or PROJECT-2026-..."
                className="w-full px-3.5 py-2.5 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-sm bg-[#FAF7F2] rounded-xs"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#E85226] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D44218] transition-colors rounded-xs shadow-md cursor-pointer"
            >
              Access Project Workspace
            </button>
          </form>

          <div className="pt-4 border-t border-[#E8E1D5] text-xs text-[#7C7267] space-y-2">
            <div>
              <strong className="text-[#14110F]">Instant Demo Access:</strong>
            </div>
            <button
              type="button"
              onClick={() => {
                setClientEmail('client@creatorstudio.com');
                setIsAuthenticated(true);
              }}
              className="text-xs font-mono text-[#E85226] hover:underline block font-semibold cursor-pointer"
            >
              → Quick switch to Sample Client (Alex Vance)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Portal Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8E1D5] pb-6 mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF4ED] text-[#C44219] text-xs font-mono uppercase tracking-wider mb-2 border border-[#FED7AA] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E85226]"></span>
              Client Production Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#14110F] mt-1">
              Active Production{' '}
              <span className="font-serif-italic font-normal text-gradient-warm">Dashboard.</span>
            </h1>
            <span className="text-xs text-[#6B6158]">
              Logged in as: <strong className="text-[#14110F] font-mono">{clientEmail}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/start-project')}
              className="px-5 py-2.5 bg-[#E85226] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#D44218] transition-all flex items-center gap-1.5 rounded-xs shadow-sm cursor-pointer"
            >
              + New Project
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3.5 py-2.5 border border-[#E8E1D5] text-xs font-mono text-[#7C7267] hover:text-[#14110F] hover:border-[#14110F] rounded-xs transition-colors cursor-pointer bg-white"
            >
              Switch Account
            </button>
          </div>
        </div>

        {/* Project Selector (if multiple orders) */}
        {orders.length > 1 && (
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-mono uppercase text-[#7C7267] shrink-0 mr-2 font-semibold">Switch Project:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className={`px-3.5 py-1.5 text-xs font-mono transition-colors shrink-0 rounded-xs ${
                  selectedOrder?.id === o.id
                    ? 'bg-[#E85226] text-white shadow-xs'
                    : 'bg-white border border-[#E8E1D5] text-[#524A43] hover:border-[#E85226]'
                }`}
              >
                {o.projectId} • {o.services[0]}
              </button>
            ))}
          </div>
        )}

        {selectedOrder ? (
          <div className="space-y-10">
            {/* Overview Card */}
            <div className="bg-white border border-[#E8E1D5] p-6 sm:p-8 rounded-sm shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E8E1D5] gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#14110F] bg-[#FAF7F2] px-3 py-1 border border-[#E8E1D5] rounded-xs">
                      {selectedOrder.projectId}
                    </span>
                    <span
                      className={`text-xs font-mono px-2.5 py-0.5 uppercase tracking-wider font-semibold rounded-xs ${
                        selectedOrder.paymentStatus === 'PAID'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : selectedOrder.paymentStatus === 'MANUAL_REVIEW'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-orange-50 text-orange-800 border border-orange-200'
                      }`}
                    >
                      Payment: {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#14110F] mt-2">
                    {selectedOrder.brandName || selectedOrder.clientName}
                  </h2>
                  <p className="text-xs text-[#6B6158] mt-1">
                    Services: <strong className="text-[#14110F]">{selectedOrder.services.join(' • ')}</strong>
                  </p>
                </div>

                <div className="text-left md:text-right space-y-1">
                  <span className="text-xs font-mono text-[#7C7267] block font-semibold">Order Amount</span>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-[#E85226]">
                    {selectedOrder.isCustomQuote
                      ? 'Custom Quote Pending'
                      : `₹${selectedOrder.expectedAmount.toLocaleString('en-IN')}`}
                  </span>
                  {selectedOrder.paymentStatus !== 'PAID' && (
                    <button
                      onClick={() => setShowManualModal(true)}
                      className="text-xs font-mono text-[#E85226] hover:underline block font-semibold cursor-pointer"
                    >
                      Can't see your payment? (Verify UTR)
                    </button>
                  )}
                </div>
              </div>

              {/* TIMELINE PROGRESS UI (7-stage pipeline) */}
              <div className="py-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#7C7267] block mb-4 font-semibold">
                  Current Pipeline Stage: <strong className="text-[#14110F]">{selectedOrder.status}</strong>
                </span>

                {/* Visual Step Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const currentIdx = getStepIndex(selectedOrder.status);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={step}
                        className={`p-3 border text-xs transition-colors rounded-xs ${
                          isCurrent
                            ? 'bg-[#14110F] text-white border-[#14110F] shadow-sm'
                            : isCompleted
                            ? 'bg-[#FFF4ED] text-[#14110F] border-[#FED7AA]'
                            : 'bg-white text-[#9E9287] border-[#E8E1D5]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] font-bold">0{idx + 1}</span>
                          {isCompleted && <Check className="w-3.5 h-3.5 text-[#E85226]" />}
                        </div>
                        <div className="font-bold text-[11px] leading-tight">{step}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E1D5] text-xs text-[#6B6158] flex flex-col sm:flex-row justify-between gap-2">
                <span>Created: {new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                <span>Deadline: {selectedOrder.deadline || 'Standard queue turnaround'}</span>
              </div>
            </div>

            {/* Split Grid: Deliverables & Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Deliverables & Assets Tab */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-[#E8E1D5] p-6 space-y-4 rounded-sm shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
                    <h3 className="font-bold text-base font-display text-[#14110F]">
                      Deliverables & Master Files
                    </h3>
                    <span className="text-[11px] font-mono text-[#7C7267] font-semibold">
                      {(selectedOrder.deliverables || []).length} Files
                    </span>
                  </div>

                  {selectedOrder.deliverables && selectedOrder.deliverables.length > 0 ? (
                    <div className="space-y-3">
                      {selectedOrder.deliverables.map((deliv) => (
                        <div
                          key={deliv.id}
                          className="p-3 bg-[#FAF7F2] border border-[#E8E1D5] flex items-center justify-between rounded-xs"
                        >
                          <div className="space-y-0.5">
                            <h4 className="font-semibold text-xs text-[#14110F] flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-[#E85226]" />
                              {deliv.title}
                            </h4>
                            {deliv.note && <p className="text-[11px] text-[#6B6158]">{deliv.note}</p>}
                            <span className="text-[10px] font-mono text-[#8A8075]">
                              Uploaded: {new Date(deliv.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <a
                            href={deliv.url}
                            className="p-2.5 bg-[#E85226] text-white hover:bg-[#D44218] transition-colors rounded-xs shadow-xs"
                            title="Download Master"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-[#FAF7F2] border border-dashed border-[#E8E1D5] space-y-2 rounded-xs">
                      <Clock className="w-6 h-6 text-[#A69B90] mx-auto" />
                      <p className="text-xs text-[#7C7267]">
                        Files will be published here as soon as the first production pass is complete.
                      </p>
                    </div>
                  )}
                </div>

                {/* Project Brief Info Card */}
                <div className="bg-white border border-[#E8E1D5] p-6 space-y-3 text-xs rounded-sm shadow-sm">
                  <h4 className="font-bold text-sm font-display text-[#14110F]">
                    Project Specifications
                  </h4>
                  <div className="space-y-2 text-[#564E47] leading-relaxed">
                    <p>
                      <strong className="text-[#14110F]">Scope:</strong> {selectedOrder.description}
                    </p>
                    {selectedOrder.referenceLinks && (
                      <p>
                        <strong className="text-[#14110F]">References:</strong>{' '}
                        <span className="font-mono text-[11px] text-[#E85226]">{selectedOrder.referenceLinks}</span>
                      </p>
                    )}
                    {selectedOrder.notes && (
                      <p>
                        <strong className="text-[#14110F]">Production Notes:</strong> {selectedOrder.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messaging System */}
              <div className="lg:col-span-7 bg-white border border-[#E8E1D5] flex flex-col h-[560px] rounded-sm shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-[#E8E1D5] flex items-center justify-between bg-[#FAF7F2]">
                  <div>
                    <h3 className="font-bold text-sm text-[#14110F] flex items-center gap-2 font-display">
                      <MessageSquare className="w-4 h-4 text-[#E85226]" />
                      Project Conversation
                    </h3>
                    <span className="text-[10px] font-mono text-[#7C7267]">
                      Direct channel with Production Partner Studio Team
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#6B6158]">
                    Email: <span className="font-semibold text-[#14110F]">{contactEmail}</span>
                  </span>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FCFBF9]">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-6 text-[#8A8075] text-xs">
                      Start the project conversation below. You can send reference updates, revisions, or questions.
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender === 'client';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A8075] mb-1">
                            <span>{msg.senderName}</span>
                            <span>•</span>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div
                            className={`max-w-[85%] p-3.5 text-xs leading-relaxed rounded-xs shadow-xs ${
                              isMe
                                ? 'bg-[#E85226] text-white'
                                : 'bg-white text-[#14110F] border border-[#E8E1D5]'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E8E1D5] bg-[#FAF7F2] flex gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type your message, feedback, or revision request..."
                    className="flex-1 px-3.5 py-2.5 bg-white border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none text-xs rounded-xs"
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !newMessageText.trim()}
                    className="px-5 py-2.5 bg-[#E85226] text-white text-xs font-semibold hover:bg-[#D44218] transition-colors flex items-center gap-1.5 disabled:opacity-50 rounded-xs shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#E8E1D5] p-12 text-center space-y-4 rounded-sm shadow-sm">
            <h3 className="font-bold text-lg text-[#14110F] font-display">No Active Projects Found</h3>
            <p className="text-xs text-[#6B6158] max-w-sm mx-auto">
              We couldn't find an order associated with {clientEmail}. Start your first project to activate your workspace.
            </p>
            <div>
              <button
                onClick={() => navigate('/start-project')}
                className="px-6 py-3 bg-[#E85226] text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-md hover:bg-[#D44218] transition-colors"
              >
                Start a Project
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MANUAL PAYMENT VERIFICATION MODAL */}
      {showManualModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] border border-[#E85226]/40 max-w-md w-full p-6 sm:p-8 space-y-6 rounded-md shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E8E1D5] pb-3">
              <div>
                <h3 className="font-bold text-lg font-display text-[#14110F]">
                  Manual Payment Verification
                </h3>
                <span className="text-xs font-mono text-[#7C7267]">Order: {selectedOrder.id}</span>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-[#8A8075] hover:text-[#E85226] font-mono text-lg transition-colors cursor-pointer"
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
                      setManualSubmitted(false);
                    }}
                    className="px-6 py-2.5 bg-[#E85226] text-white text-xs font-semibold uppercase tracking-wider rounded-xs shadow-md hover:bg-[#D44218]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleManualVerificationSubmit} className="space-y-4 text-xs">
                <p className="text-[#6B6158] leading-relaxed">
                  If you transferred the funds and the automatic webhook did not update your status, submit your transaction ID (UTR) below for immediate administrative review.
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
                  <label className="font-mono uppercase text-[#14110F] font-semibold">Payment App Used</label>
                  <input
                    type="text"
                    value={selectedOrder.selectedPaymentApp || 'Other'}
                    readOnly
                    className="w-full px-3 py-2 border border-[#E8E1D5] bg-[#ECE5DA] text-[#60574F] rounded-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#14110F] font-semibold">Amount Paid (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder={selectedOrder.expectedAmount.toString()}
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none bg-white font-mono rounded-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#14110F] font-semibold">Screenshot / Transfer Note</label>
                  <input
                    type="text"
                    placeholder="Optional bank confirmation notes"
                    value={manualNote}
                    onChange={(e) => setManualNote(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E8E1D5] focus:border-[#E85226] focus:outline-none bg-white rounded-xs"
                  />
                </div>

                <div className="pt-3 border-t border-[#E8E1D5] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-4 py-2 border border-[#E8E1D5] text-xs font-semibold rounded-xs hover:bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#E85226] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#D44218] rounded-xs shadow-sm cursor-pointer"
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

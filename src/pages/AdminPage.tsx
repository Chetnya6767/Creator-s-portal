import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  Check,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  Shield,
  Upload,
  UserCheck,
  XCircle,
} from 'lucide-react';
import {
  ProjectOrder,
  ProjectTimelineStep,
  TIMELINE_STEPS,
  PaymentStatus,
  ManualPaymentVerification,
  ProjectMessage,
  FreelanceApplication,
  DeliverableFile,
} from '../types';
import {
  getAllOrders,
  updateOrderStatus,
  updateOrderPaymentStatus,
  addDeliverableToOrder,
  getManualVerifications,
  updateManualVerificationStatus,
  getProjectMessages,
  sendProjectMessage,
  getAllApplications,
  updateApplicationStatus,
} from '../services/db';
import { INITIAL_PORTFOLIO, PortfolioItem } from '../data/portfolioData';
import { defaultPaymentProvider } from '../services/paymentProvider';

interface AdminPageProps {
  navigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<
    'orders' | 'payments' | 'messages' | 'portfolio' | 'applications' | 'simulator'
  >('orders');

  // Data states
  const [orders, setOrders] = useState<ProjectOrder[]>([]);
  const [manualVerifications, setManualVerifications] = useState<ManualPaymentVerification[]>([]);
  const [applications, setApplications] = useState<FreelanceApplication[]>([]);
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<ProjectOrder | null>(null);

  // Message chat in Admin
  const [adminMessages, setAdminMessages] = useState<ProjectMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Deliverable upload modal
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [delivTitle, setDelivTitle] = useState('');
  const [delivUrl, setDelivUrl] = useState('');
  const [delivNote, setDelivNote] = useState('');

  // Portfolio Add Modal
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'content-production' | 'creative-design' | 'digital-build' | 'creator-tech'>('content-production');
  const [newService, setNewService] = useState('Video Editing');
  const [newDesc, setNewDesc] = useState('');
  const [newThumb, setNewThumb] = useState('');

  // Webhook simulator state
  const [simOrderId, setSimOrderId] = useState('');
  const [simAmount, setSimAmount] = useState('1499');
  const [simResult, setSimResult] = useState<string>('');

  const refreshData = async () => {
    setLoading(true);
    try {
      const [o, v, a] = await Promise.all([
        getAllOrders(),
        getManualVerifications(),
        getAllApplications(),
      ]);
      setOrders(o);
      setManualVerifications(v);
      setApplications(a);

      if (o.length > 0 && !selectedOrder) {
        setSelectedOrder(o[0]);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Load chat messages when selectedOrder changes
  useEffect(() => {
    const fetchMsgs = async () => {
      if (!selectedOrder) return;
      try {
        const msgs = await getProjectMessages(selectedOrder.id);
        setAdminMessages(msgs);
      } catch (err) {
        console.error('Failed to load admin msgs:', err);
      }
    };
    fetchMsgs();
  }, [selectedOrder]);

  const handleStatusChange = async (orderId: string, newStatus: ProjectTimelineStep) => {
    await updateOrderStatus(orderId, newStatus);
    await refreshData();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: PaymentStatus) => {
    await updateOrderPaymentStatus(orderId, newPaymentStatus);
    await refreshData();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus });
    }
  };

  const handleAddDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !delivTitle.trim()) return;

    const newDeliv: DeliverableFile = {
      id: `DELIV-${Date.now()}`,
      title: delivTitle,
      url: delivUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      uploadedAt: new Date().toISOString(),
      note: delivNote,
    };

    await addDeliverableToOrder(selectedOrder.id, newDeliv);
    setShowDeliverableModal(false);
    setDelivTitle('');
    setDelivUrl('');
    setDelivNote('');
    await refreshData();
    if (selectedOrder) {
      const updated = (await getAllOrders()).find((o) => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    }
  };

  const handleManualAction = async (
    verificationId: string,
    orderId: string,
    action: 'APPROVED' | 'REJECTED' | 'MORE_INFO',
    reviewNote?: string
  ) => {
    await updateManualVerificationStatus(verificationId, action, reviewNote);
    if (action === 'APPROVED') {
      await updateOrderPaymentStatus(orderId, 'PAID');
    }
    await refreshData();
  };

  const handleAdminSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !adminReplyText.trim()) return;

    setSendingReply(true);
    try {
      await sendProjectMessage({
        projectId: selectedOrder.id,
        sender: 'admin',
        senderName: 'Lead Producer (Studio)',
        message: adminReplyText.trim(),
      });
      setAdminReplyText('');
      const msgs = await getProjectMessages(selectedOrder.id);
      setAdminMessages(msgs);
    } catch (err) {
      console.error('Failed to send admin message:', err);
    } finally {
      setSendingReply(false);
    }
  };

  const handleSimulateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimResult('Sending webhook event...');
    try {
      const targetOrder = orders.find((o) => o.id === simOrderId) || orders[0];
      if (!targetOrder) {
        setSimResult('No order found to simulate.');
        return;
      }

      const result = await defaultPaymentProvider.handleWebhook({
        eventId: `EVT-${Date.now()}`,
        orderId: targetOrder.id,
        transactionId: `TXN-${Date.now()}`,
        amount: parseFloat(simAmount) || targetOrder.expectedAmount,
        currency: 'INR',
        status: 'captured',
        paymentApp: targetOrder.selectedPaymentApp || 'Google Pay',
        signature: 'simulated_valid_sha256_sig',
        timestamp: new Date().toISOString(),
      });

      if (result.success) {
        setSimResult(`✅ Webhook verified successfully! Order ${targetOrder.id} updated to PAID.`);
        await refreshData();
      } else {
        setSimResult(`❌ Webhook failed: ${result.message}`);
      }
    } catch (err) {
      setSimResult(`Error: ${String(err)}`);
    }
  };

  const handleAddPortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      categoryLabel: newCategory.toUpperCase().replace('-', ' '),
      service: newService,
      serviceSlug: newCategory === 'content-production' ? 'video-editing' : 'web-development',
      clientName: 'Studio Concept Spec',
      description: newDesc,
      thumbnail: newThumb || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      date: '2026',
      isPlaceholder: true,
      tags: ['Concept', 'Specification'],
    };

    setPortfolioList([newItem, ...portfolioList]);
    setShowPortfolioModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewThumb('');
  };

  const filteredOrders = orderStatusFilter === 'ALL'
    ? orders
    : orders.filter((o) => o.status === orderStatusFilter);

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8E1D5] pb-6 mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF4ED] text-[#C44219] text-xs font-mono tracking-wider uppercase mb-2 border border-[#FED7AA] rounded-full">
              <Shield className="w-3.5 h-3.5 text-[#E85226]" /> Internal Studio Console
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#14110F] mt-1">
              Agency Master Operations
            </h1>
            <p className="text-xs text-[#6B6158]">
              Order pipeline, timeline stepping, payment reconciliation, CMS, and applicant triage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              className="px-3.5 py-2 border border-[#E8E1D5] text-xs font-mono flex items-center gap-1.5 hover:border-[#E85226] text-[#14110F] transition-colors rounded-xs bg-white cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh State
            </button>
            <button
              onClick={() => navigate('/portal')}
              className="px-4 py-2 bg-[#E85226] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#D44218] transition-colors rounded-xs shadow-sm cursor-pointer"
            >
              View Client View →
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#E8E1D5] pb-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all rounded-xs cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#E85226] text-white shadow-xs' : 'bg-white border border-[#E8E1D5] text-[#6B6158] hover:border-[#E85226]'
            }`}
          >
            Orders & Pipeline ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all rounded-xs cursor-pointer ${
              activeTab === 'payments' ? 'bg-[#E85226] text-white shadow-xs' : 'bg-white border border-[#E8E1D5] text-[#6B6158] hover:border-[#E85226]'
            }`}
          >
            Manual Payments ({manualVerifications.filter((v) => v.status === 'PENDING').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all rounded-xs cursor-pointer ${
              activeTab === 'messages' ? 'bg-[#E85226] text-white shadow-xs' : 'bg-white border border-[#E8E1D5] text-[#6B6158] hover:border-[#E85226]'
            }`}
          >
            Client Conversations
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all rounded-xs cursor-pointer ${
              activeTab === 'portfolio' ? 'bg-[#E85226] text-white shadow-xs' : 'bg-white border border-[#E8E1D5] text-[#6B6158] hover:border-[#E85226]'
            }`}
          >
            Portfolio CMS ({portfolioList.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all rounded-xs cursor-pointer ${
              activeTab === 'applications' ? 'bg-[#E85226] text-white shadow-xs' : 'bg-white border border-[#E8E1D5] text-[#6B6158] hover:border-[#E85226]'
            }`}
          >
            Roster Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 text-xs font-mono tracking-wider transition-all rounded-xs cursor-pointer ${
              activeTab === 'simulator' ? 'bg-[#14110F] text-white' : 'bg-[#FFF4ED] border border-[#FED7AA] text-[#E85226]'
            }`}
          >
            ⚡ Webhook Test
          </button>
        </div>

        {/* TAB 1: ORDERS & PIPELINE */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Orders List */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#777]">Orders ({filteredOrders.length})</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-2 py-1 text-xs border border-[#EAE8E1] bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  {TIMELINE_STEPS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 border transition-all cursor-pointer bg-white ${
                        isSelected ? 'border-[#121212] ring-1 ring-[#121212]' : 'border-[#EAE8E1] hover:border-[#888]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-[#121212]">{order.projectId}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 uppercase ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#121212]">{order.clientName}</h4>
                      <div className="text-xs text-[#666] mt-1 line-clamp-1">
                        {order.services.join(', ')}
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#EAE8E1] flex justify-between items-center text-[11px] font-mono text-[#777]">
                        <span>Stage: {order.status}</span>
                        <span>{order.expectedAmount ? `₹${order.expectedAmount}` : 'Quote'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Order Detail & Actions */}
            {selectedOrder ? (
              <div className="lg:col-span-7 bg-white border border-[#EAE8E1] p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAE8E1] pb-4 gap-2">
                  <div>
                    <span className="text-xs font-mono text-[#E05A2B] uppercase">Order Administration</span>
                    <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#121212] mt-0.5">
                      {selectedOrder.projectId} — {selectedOrder.clientName}
                    </h3>
                    <span className="text-xs text-[#777] font-mono">{selectedOrder.email} • {selectedOrder.phone}</span>
                  </div>

                  <button
                    onClick={() => setShowDeliverableModal(true)}
                    className="px-3.5 py-2 bg-[#121212] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Deliverable
                  </button>
                </div>

                {/* Timeline Stepper Control */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#121212] block">
                    Change Production Timeline Stage:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIMELINE_STEPS.map((step) => (
                      <button
                        key={step}
                        onClick={() => handleStatusChange(selectedOrder.id, step)}
                        className={`p-2 text-xs text-left border font-semibold transition-colors ${
                          selectedOrder.status === step
                            ? 'bg-[#121212] text-white border-[#121212]'
                            : 'bg-[#FAF9F6] text-[#555] border-[#EAE8E1] hover:border-[#888]'
                        }`}
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Status Control */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#121212] block">
                    Update Payment Status:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['PENDING', 'PAID', 'PARTIAL', 'FAILED', 'CANCELLED', 'MANUAL_REVIEW'] as PaymentStatus[]).map((pStatus) => (
                      <button
                        key={pStatus}
                        onClick={() => handlePaymentStatusChange(selectedOrder.id, pStatus)}
                        className={`px-3 py-1.5 text-xs font-mono font-semibold transition-colors ${
                          selectedOrder.paymentStatus === pStatus
                            ? 'bg-[#121212] text-white'
                            : 'bg-white border border-[#EAE8E1] text-[#666] hover:text-[#121212]'
                        }`}
                      >
                        {pStatus}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brief & Deliverables List */}
                <div className="border-t border-[#EAE8E1] pt-4 space-y-4">
                  <div>
                    <h4 className="text-xs font-mono uppercase text-[#777] mb-1">Project Brief</h4>
                    <p className="text-xs text-[#333] leading-relaxed bg-[#FAF9F6] p-3 border border-[#EAE8E1]">
                      {selectedOrder.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase text-[#777] mb-2">
                      Active Deliverables ({(selectedOrder.deliverables || []).length})
                    </h4>
                    {selectedOrder.deliverables && selectedOrder.deliverables.length > 0 ? (
                      <div className="space-y-2">
                        {selectedOrder.deliverables.map((deliv) => (
                          <div
                            key={deliv.id}
                            className="p-3 bg-[#FAF9F6] border border-[#EAE8E1] flex justify-between items-center text-xs"
                          >
                            <div>
                              <div className="font-semibold text-[#121212]">{deliv.title}</div>
                              {deliv.note && <div className="text-[11px] text-[#666]">{deliv.note}</div>}
                            </div>
                            <a
                              href={deliv.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs text-[#E05A2B] hover:underline"
                            >
                              Download Asset ↗
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#888]">No deliverables uploaded for this order yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-7 bg-white border border-[#EAE8E1] p-12 text-center text-xs text-[#888]">
                Select an order from the list to manage.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANUAL PAYMENT VERIFICATIONS */}
        {activeTab === 'payments' && (
          <div className="bg-white border border-[#EAE8E1] p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-mono text-[#E05A2B] uppercase">Reconciliation Center</span>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#121212] mt-0.5">
                Manual Payment Submissions & Fallbacks
              </h2>
              <p className="text-xs text-[#666] mt-1">
                When automatic webhooks are delayed or customer uses direct UPI transfer, reviews appear here.
              </p>
            </div>

            {manualVerifications.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF9F6] border border-[#EAE8E1] text-xs text-[#888]">
                No pending manual payment submissions.
              </div>
            ) : (
              <div className="space-y-4">
                {manualVerifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 border border-[#EAE8E1] bg-[#FAF9F6] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAE8E1] pb-3 gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#121212]">
                          Order: {item.orderId}
                        </span>
                        <div className="text-xs text-[#555] mt-0.5">
                          App: <strong>{item.paymentApp}</strong> • Amount: <strong>₹{item.amountPaid}</strong>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 uppercase ${
                          item.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="font-mono text-[#777] block">Transaction ID / UTR:</span>
                        <span className="font-mono font-bold text-[#121212]">{item.transactionIdUtr}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[#777] block">Submitted At:</span>
                        <span className="text-[#333]">{new Date(item.dateTime).toLocaleString()}</span>
                      </div>
                      {item.screenshotNote && (
                        <div className="sm:col-span-2">
                          <span className="font-mono text-[#777] block">Customer Transfer Note:</span>
                          <span className="text-[#333]">{item.screenshotNote}</span>
                        </div>
                      )}
                    </div>

                    {item.status === 'PENDING' && (
                      <div className="pt-3 border-t border-[#EAE8E1] flex flex-wrap gap-2 justify-end">
                        <button
                          onClick={() => handleManualAction(item.id, item.orderId, 'MORE_INFO', 'Need clearer screenshot')}
                          className="px-3 py-1.5 border border-[#121212] text-xs font-semibold hover:bg-white"
                        >
                          Request More Information
                        </button>
                        <button
                          onClick={() => handleManualAction(item.id, item.orderId, 'REJECTED', 'UTR mismatch')}
                          className="px-3 py-1.5 bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleManualAction(item.id, item.orderId, 'APPROVED', 'Verified with bank statement')}
                          className="px-4 py-1.5 bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-800"
                        >
                          Approve & Mark Paid
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CLIENT CONVERSATIONS */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-mono uppercase text-[#777] block mb-2">Projects with Channels</span>
              {orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className={`w-full text-left p-3 border text-xs transition-colors ${
                    selectedOrder?.id === o.id
                      ? 'bg-[#121212] text-white border-[#121212]'
                      : 'bg-white border-[#EAE8E1] text-[#333] hover:border-[#888]'
                  }`}
                >
                  <div className="font-bold">{o.clientName}</div>
                  <div className="text-[11px] opacity-80">{o.projectId}</div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 bg-white border border-[#EAE8E1] flex flex-col h-[520px]">
              <div className="p-4 border-b border-[#EAE8E1] bg-[#FAF9F6]">
                <h3 className="font-bold text-sm text-[#121212]">
                  Chat with {selectedOrder?.clientName} ({selectedOrder?.projectId})
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {adminMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'admin' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] font-mono text-[#888] mb-0.5">
                      {m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div
                      className={`max-w-[80%] p-3 text-xs leading-relaxed ${
                        m.sender === 'admin'
                          ? 'bg-[#121212] text-white'
                          : 'bg-[#FAF9F6] text-[#121212] border border-[#EAE8E1]'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAdminSendReply} className="p-3 border-t border-[#EAE8E1] bg-[#FAF9F6] flex gap-2">
                <input
                  type="text"
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  placeholder="Send reply to client portal..."
                  className="flex-1 px-3 py-2 bg-white border border-[#EAE8E1] text-xs focus:border-[#121212] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sendingReply || !adminReplyText.trim()}
                  className="px-4 py-2 bg-[#121212] text-white text-xs font-semibold"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: PORTFOLIO CMS */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#121212]">
                  Portfolio Case Studies & Specifications
                </h2>
                <p className="text-xs text-[#666]">Add or modify demonstration case studies.</p>
              </div>
              <button
                onClick={() => setShowPortfolioModal(true)}
                className="px-4 py-2 bg-[#121212] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioList.map((item) => (
                <div key={item.id} className="bg-white border border-[#EAE8E1] p-4 flex flex-col justify-between">
                  <div>
                    <img src={item.thumbnail} alt={item.title} className="w-full h-36 object-cover mb-3" />
                    <span className="text-[10px] font-mono text-[#E05A2B] uppercase">{item.service}</span>
                    <h4 className="font-bold text-sm text-[#121212] mt-0.5">{item.title}</h4>
                    <p className="text-xs text-[#666] line-clamp-2 mt-1">{item.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#EAE8E1] flex justify-between text-xs">
                    <span className="text-[#888] font-mono">{item.clientName}</span>
                    <span className="font-mono text-emerald-700">Published</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TEAM APPLICATIONS (Work With Us) */}
        {activeTab === 'applications' && (
          <div className="bg-white border border-[#EAE8E1] p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-mono text-[#E05A2B] uppercase">Talent Ingestion</span>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#121212] mt-0.5">
                Creative & Technical Roster Submissions
              </h2>
              <p className="text-xs text-[#666] mt-1">
                Applicants from the "Work With Us" page are tracked here.
              </p>
            </div>

            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-5 bg-[#FAF9F6] border border-[#EAE8E1] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAE8E1] pb-3 gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#121212]">{app.fullName}</h4>
                      <span className="text-xs font-mono text-[#777]">{app.role} • {app.email}</span>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 bg-[#121212] text-white">
                      {app.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-2 text-[#444]">
                    <div>
                      <strong>Experience:</strong> {app.experience}
                    </div>
                    <div>
                      <strong>Portfolio:</strong>{' '}
                      <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="text-[#E05A2B] font-mono hover:underline">
                        {app.portfolioUrl} ↗
                      </a>
                    </div>
                    {app.notes && (
                      <div>
                        <strong>Bio / Philosophy:</strong> {app.notes}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex gap-2 justify-end">
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'ACCEPTED')}
                      className="px-3 py-1 bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider"
                    >
                      Accept to Roster
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'ARCHIVED')}
                      className="px-3 py-1 border border-[#121212] text-xs font-semibold uppercase tracking-wider"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: WEBHOOK SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="bg-white border border-[#121212] p-6 sm:p-8 max-w-xl mx-auto space-y-6">
            <div>
              <span className="text-xs font-mono text-[#E05A2B] uppercase">Developer Sandbox</span>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#121212] mt-0.5">
                Payment Provider Webhook Simulator
              </h2>
              <p className="text-xs text-[#666] mt-1 leading-relaxed">
                Test incoming server-side webhook payloads. This sends a simulated banking webhook to verify that payment status is never trusted from the browser.
              </p>
            </div>

            <form onSubmit={handleSimulateWebhook} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-mono uppercase text-[#121212]">Target Order ID</label>
                <select
                  value={simOrderId}
                  onChange={(e) => setSimOrderId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE8E1] bg-[#FAF9F6] font-mono text-xs"
                >
                  <option value="">Select an order to simulate</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.projectId} ({o.clientName} - ₹{o.expectedAmount}) [{o.paymentStatus}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#121212]">Simulated Paid Amount (INR)</label>
                <input
                  type="number"
                  value={simAmount}
                  onChange={(e) => setSimAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE8E1] font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#121212] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#2A2A2A]"
              >
                Dispatch Signed Webhook
              </button>
            </form>

            {simResult && (
              <div className="p-4 bg-[#FAF9F6] border border-[#121212] text-xs font-mono">
                {simResult}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DELIVERABLE UPLOAD MODAL */}
      {showDeliverableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FAF9F6] border border-[#121212] max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#EAE8E1] pb-2">
              <h3 className="font-bold text-sm text-[#121212]">Upload Deliverable File</h3>
              <button onClick={() => setShowDeliverableModal(false)} className="text-base font-mono">✕</button>
            </div>

            <form onSubmit={handleAddDeliverable} className="space-y-3">
              <div className="space-y-1">
                <label className="font-mono uppercase text-[#121212]">File Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Cut v1 (4K ProRes 422HQ)"
                  value={delivTitle}
                  onChange={(e) => setDelivTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE8E1] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#121212]">Asset Download URL</label>
                <input
                  type="text"
                  placeholder="https://cloudstorage.com/export.zip"
                  value={delivUrl}
                  onChange={(e) => setDelivUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE8E1] bg-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#121212]">Production Note</label>
                <input
                  type="text"
                  placeholder="Color graded in Rec.709 with -14 LUFS loudness master."
                  value={delivNote}
                  onChange={(e) => setDelivNote(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE8E1] bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeliverableModal(false)}
                  className="px-3 py-2 border border-[#121212]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#121212] text-white uppercase tracking-wider font-semibold"
                >
                  Publish to Client Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTFOLIO ADD MODAL */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FAF9F6] border border-[#121212] max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#EAE8E1] pb-2">
              <h3 className="font-bold text-sm text-[#121212]">Add Portfolio Case Study</h3>
              <button onClick={() => setShowPortfolioModal(false)} className="text-base font-mono">✕</button>
            </div>

            <form onSubmit={handleAddPortfolioItem} className="space-y-3">
              <div className="space-y-1">
                <label className="font-mono uppercase text-[#121212]">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kinetic 3D Fluid Simulation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE8E1] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#121212]">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#EAE8E1] bg-white"
                >
                  <option value="content-production">Content Production</option>
                  <option value="creative-design">Creative Design</option>
                  <option value="digital-build">Digital Build</option>
                  <option value="creator-tech">Creator Tech</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#121212]">Service Tag</label>
                <input
                  type="text"
                  placeholder="e.g. CGI Ads"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE8E1] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#121212]">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe technical execution..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE8E1] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#121212]">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newThumb}
                  onChange={(e) => setNewThumb(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE8E1] bg-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPortfolioModal(false)}
                  className="px-3 py-2 border border-[#121212]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#121212] text-white uppercase tracking-wider font-semibold"
                >
                  Add to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

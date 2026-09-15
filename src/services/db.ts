import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  ProjectOrder,
  PaymentRecord,
  ManualPaymentVerification,
  ProjectMessage,
  TeamApplication,
  PaymentStatus,
  ProjectTimelineStep,
} from '../types';
import { INITIAL_PORTFOLIO, PortfolioItem } from '../data/portfolioData';

// Local storage backup keys to ensure 100% resilient operation
const LS_ORDERS = 'pp_orders';
const LS_PAYMENTS = 'pp_payments';
const LS_MANUAL_VERIF = 'pp_manual_verifications';
const LS_MESSAGES = 'pp_messages';
const LS_PORTFOLIO = 'pp_portfolio';
const LS_APPLICATIONS = 'pp_applications';

// Helper to safely read from localStorage
function getLocal<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Helper to safely write to localStorage
function setLocal<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// Initial seed orders for immediate demonstration in Client Portal & Admin
const SEED_ORDERS: ProjectOrder[] = [
  {
    id: 'PROJECT-2026-000001',
    projectId: 'PROJECT-2026-000001',
    clientName: 'Alex Vance',
    email: 'client@creatorstudio.com',
    phone: '+91 98765 43210',
    brandName: 'Vance Tech Media',
    services: ['CGI Ads', 'Video Editing'],
    serviceSlugs: ['cgi-ads', 'video-editing'],
    packageName: '1 CGI Ad + Short-form video',
    description: 'High-contrast 3D reveal for an aluminum desk microphone with dynamic lighting and social cuts.',
    deadline: '2026-10-15',
    budgetRange: '₹5,000 – ₹15,000',
    expectedAmount: 1588,
    isCustomQuote: false,
    currency: 'INR',
    status: 'IN PRODUCTION',
    paymentStatus: 'PAID',
    selectedPaymentApp: 'PhonePe',
    paymentId: 'PAY-2026-000001',
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-09-12T14:30:00Z',
    deliverables: [
      {
        id: 'deliv-01',
        title: 'Draft Styleframe Pack (PDF)',
        url: '#',
        uploadedAt: '2026-09-12T12:00:00Z',
        note: 'First pass lighting angles for your microphone 3D render.',
      },
    ],
  },
  {
    id: 'PROJECT-2026-000002',
    projectId: 'PROJECT-2026-000002',
    clientName: 'Sarah Jenkins',
    email: 'sarah@chronicles.tv',
    phone: '+91 91234 56789',
    brandName: 'Sarah Chronicles',
    services: ['Documentary / YouTube Video'],
    serviceSlugs: ['documentary'],
    packageName: '10 × 10-minute Videos',
    description: '10-part serialized narrative series on space exploration history. Archival research and pacing.',
    deadline: '2026-11-01',
    budgetRange: '₹10,000 – ₹25,000',
    expectedAmount: 7999,
    isCustomQuote: false,
    currency: 'INR',
    status: 'PAYMENT VERIFIED',
    paymentStatus: 'PAID',
    selectedPaymentApp: 'Google Pay',
    paymentId: 'PAY-2026-000002',
    createdAt: '2026-09-13T09:15:00Z',
    updatedAt: '2026-09-13T10:00:00Z',
    deliverables: [],
  },
  {
    id: 'PROJECT-2026-000003',
    projectId: 'PROJECT-2026-000003',
    clientName: 'Rohan Mehta',
    email: 'rohan@creator.in',
    phone: '+91 99887 76655',
    brandName: 'Rohan Builds',
    services: ['Web Development'],
    serviceSlugs: ['web-development'],
    packageName: 'Single Page',
    description: 'Clean portfolio website with dark-mode switch and project showcases.',
    deadline: '2026-09-30',
    budgetRange: '₹4,000 – ₹8,000',
    expectedAmount: 3999,
    isCustomQuote: false,
    currency: 'INR',
    status: 'ORDER RECEIVED',
    paymentStatus: 'MANUAL_REVIEW',
    selectedPaymentApp: 'Paytm',
    paymentId: 'PAY-2026-000003',
    createdAt: '2026-09-14T01:20:00Z',
    updatedAt: '2026-09-14T01:25:00Z',
    deliverables: [],
  },
];

const SEED_MESSAGES: ProjectMessage[] = [
  {
    id: 'msg-01',
    projectId: 'PROJECT-2026-000001',
    sender: 'client',
    senderName: 'Alex Vance',
    message: 'Hey team, just uploaded the reference photos for the microphone chassis. Looking for a clean gunmetal finish.',
    timestamp: '2026-09-10T10:05:00Z',
  },
  {
    id: 'msg-02',
    projectId: 'PROJECT-2026-000001',
    sender: 'agency_admin',
    senderName: 'Production Partner Studio',
    message: 'Got it Alex! We received the files and lighting references. We have matched the physical shader and started lighting tests.',
    timestamp: '2026-09-11T09:30:00Z',
  },
  {
    id: 'msg-03',
    projectId: 'PROJECT-2026-000001',
    sender: 'agency_admin',
    senderName: 'Production Partner Studio',
    message: 'Uploaded the draft styleframe pack to your deliverables tab. Let us know if the rim light angle feels right.',
    timestamp: '2026-09-12T12:05:00Z',
  },
];

// Initialize seed data if not present locally
if (!localStorage.getItem(LS_ORDERS)) {
  setLocal(LS_ORDERS, SEED_ORDERS);
}
if (!localStorage.getItem(LS_MESSAGES)) {
  setLocal(LS_MESSAGES, SEED_MESSAGES);
}
if (!localStorage.getItem(LS_PORTFOLIO)) {
  setLocal(LS_PORTFOLIO, INITIAL_PORTFOLIO);
}

// -------------------------------------------------------------
// ORDERS SERVICE
// -------------------------------------------------------------

export async function createOrder(order: ProjectOrder): Promise<ProjectOrder> {
  try {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, { ...order, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn('Firestore write fallback to local storage:', err);
  }

  // Always update local store
  const existing = getLocal<ProjectOrder>(LS_ORDERS, SEED_ORDERS);
  const updated = [order, ...existing.filter((o) => o.id !== order.id)];
  setLocal(LS_ORDERS, updated);

  return order;
}

export async function getOrderById(orderId: string): Promise<ProjectOrder | null> {
  try {
    const docRef = doc(db, 'orders', orderId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as ProjectOrder;
    }
  } catch (err) {
    console.warn('Firestore read error, checking local store:', err);
  }

  const existing = getLocal<ProjectOrder>(LS_ORDERS, SEED_ORDERS);
  return existing.find((o) => o.id === orderId || o.projectId === orderId) || null;
}

export async function getOrdersByEmail(email: string): Promise<ProjectOrder[]> {
  try {
    const q = query(collection(db, 'orders'), where('email', '==', email.toLowerCase().trim()));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as ProjectOrder);
    }
  } catch (err) {
    console.warn('Firestore query error, using local store:', err);
  }

  const existing = getLocal<ProjectOrder>(LS_ORDERS, SEED_ORDERS);
  return existing.filter((o) => o.email.toLowerCase().trim() === email.toLowerCase().trim());
}

export async function getAllOrders(): Promise<ProjectOrder[]> {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as ProjectOrder);
      // sort by createdAt desc
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    console.warn('Firestore getAllOrders error, using local store:', err);
  }

  const list = getLocal<ProjectOrder>(LS_ORDERS, SEED_ORDERS);
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateOrderStatus(
  orderId: string,
  timelineStatus: ProjectTimelineStep,
  paymentStatus?: PaymentStatus
): Promise<void> {
  const updates: Record<string, unknown> = {
    status: timelineStatus,
    updatedAt: new Date().toISOString(),
  };
  if (paymentStatus) {
    updates.paymentStatus = paymentStatus;
  }

  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('Firestore updateOrderStatus error:', err);
  }

  const existing = getLocal<ProjectOrder>(LS_ORDERS, SEED_ORDERS);
  const updated = existing.map((o) =>
    o.id === orderId
      ? {
          ...o,
          status: timelineStatus,
          paymentStatus: paymentStatus || o.paymentStatus,
          updatedAt: new Date().toISOString(),
        }
      : o
  );
  setLocal(LS_ORDERS, updated);
}

export async function addOrderDeliverable(
  orderId: string,
  deliverable: { title: string; url: string; note?: string }
): Promise<void> {
  const newDeliv = {
    id: `deliv-${Date.now()}`,
    title: deliverable.title,
    url: deliverable.url,
    uploadedAt: new Date().toISOString(),
    note: deliverable.note,
  };

  const existing = getLocal<ProjectOrder>(LS_ORDERS, SEED_ORDERS);
  const updated = existing.map((o) => {
    if (o.id === orderId) {
      const delivs = o.deliverables || [];
      return { ...o, deliverables: [...delivs, newDeliv], updatedAt: new Date().toISOString() };
    }
    return o;
  });
  setLocal(LS_ORDERS, updated);

  try {
    const docRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(docRef);
    if (orderSnap.exists()) {
      const data = orderSnap.data() as ProjectOrder;
      await updateDoc(docRef, {
        deliverables: [...(data.deliverables || []), newDeliv],
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Firestore addOrderDeliverable error:', err);
  }
}

// -------------------------------------------------------------
// PAYMENTS & MANUAL VERIFICATION SERVICE
// -------------------------------------------------------------

export async function createPaymentRecord(payment: PaymentRecord): Promise<PaymentRecord> {
  try {
    const docRef = doc(db, 'payments', payment.paymentId);
    await setDoc(docRef, payment);
  } catch (err) {
    console.warn('Firestore payment write fallback:', err);
  }

  const existing = getLocal<PaymentRecord>(LS_PAYMENTS, []);
  setLocal(LS_PAYMENTS, [payment, ...existing.filter((p) => p.paymentId !== payment.paymentId)]);
  return payment;
}

export async function submitManualVerification(
  req: Omit<ManualPaymentVerification, 'id' | 'status' | 'submittedAt'>
): Promise<ManualPaymentVerification> {
  const newVerification: ManualPaymentVerification = {
    ...req,
    id: `VERIF-${Date.now()}`,
    status: 'PENDING',
    submittedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'manual_payment_verifications', newVerification.id);
    await setDoc(docRef, newVerification);
  } catch (err) {
    console.warn('Firestore manual verification write fallback:', err);
  }

  const existing = getLocal<ManualPaymentVerification>(LS_MANUAL_VERIF, []);
  setLocal(LS_MANUAL_VERIF, [newVerification, ...existing]);

  // Set order paymentStatus to MANUAL_REVIEW
  await updateOrderStatus(req.orderId, 'ORDER RECEIVED', 'MANUAL_REVIEW');

  return newVerification;
}

export async function getAllManualVerifications(): Promise<ManualPaymentVerification[]> {
  try {
    const snap = await getDocs(collection(db, 'manual_payment_verifications'));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as ManualPaymentVerification);
    }
  } catch (err) {
    console.warn('Firestore read error:', err);
  }
  return getLocal<ManualPaymentVerification>(LS_MANUAL_VERIF, []);
}

export async function reviewManualVerification(
  id: string,
  status: 'APPROVED' | 'REJECTED' | 'MORE_INFO',
  adminNotes?: string
): Promise<void> {
  const existing = getLocal<ManualPaymentVerification>(LS_MANUAL_VERIF, []);
  let targetOrderId: string | null = null;

  const updated = existing.map((v) => {
    if (v.id === id) {
      targetOrderId = v.orderId;
      return {
        ...v,
        status,
        adminNotes,
        reviewedAt: new Date().toISOString(),
      };
    }
    return v;
  });
  setLocal(LS_MANUAL_VERIF, updated);

  try {
    const docRef = doc(db, 'manual_payment_verifications', id);
    await updateDoc(docRef, {
      status,
      adminNotes,
      reviewedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore review error:', err);
  }

  // If approved, update order status to PAYMENT VERIFIED and paymentStatus to PAID
  if (status === 'APPROVED' && targetOrderId) {
    await updateOrderStatus(targetOrderId, 'PAYMENT VERIFIED', 'PAID');
  } else if (status === 'REJECTED' && targetOrderId) {
    await updateOrderStatus(targetOrderId, 'ORDER RECEIVED', 'FAILED');
  }
}

// -------------------------------------------------------------
// MESSAGING SERVICE
// -------------------------------------------------------------

export async function getProjectMessages(projectId: string): Promise<ProjectMessage[]> {
  try {
    const q = query(
      collection(db, 'messages'),
      where('projectId', '==', projectId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const msgs = snap.docs.map((d) => d.data() as ProjectMessage);
      return msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
  } catch (err) {
    console.warn('Firestore getProjectMessages error:', err);
  }

  const existing = getLocal<ProjectMessage>(LS_MESSAGES, SEED_MESSAGES);
  return existing
    .filter((m) => m.projectId === projectId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export async function sendProjectMessage(message: Omit<ProjectMessage, 'id' | 'timestamp'>): Promise<ProjectMessage> {
  const newMsg: ProjectMessage = {
    ...message,
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'messages', newMsg.id);
    await setDoc(docRef, newMsg);
  } catch (err) {
    console.warn('Firestore sendProjectMessage error:', err);
  }

  const existing = getLocal<ProjectMessage>(LS_MESSAGES, SEED_MESSAGES);
  setLocal(LS_MESSAGES, [...existing, newMsg]);

  // Dispatch custom event for real-time local reactivity
  window.dispatchEvent(new CustomEvent('pp_message_sent', { detail: newMsg }));

  return newMsg;
}

// -------------------------------------------------------------
// WORK WITH US (TEAM APPLICATIONS)
// -------------------------------------------------------------

export async function submitTeamApplication(appData: Omit<TeamApplication, 'id' | 'submittedAt' | 'status'>): Promise<TeamApplication> {
  const newApp: TeamApplication = {
    ...appData,
    id: `APP-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'NEW',
  };

  try {
    const docRef = doc(db, 'team_applications', newApp.id);
    await setDoc(docRef, newApp);
  } catch (err) {
    console.warn('Firestore submitTeamApplication error:', err);
  }

  const existing = getLocal<TeamApplication>(LS_APPLICATIONS, []);
  setLocal(LS_APPLICATIONS, [newApp, ...existing]);

  return newApp;
}

export async function getAllTeamApplications(): Promise<TeamApplication[]> {
  try {
    const snap = await getDocs(collection(db, 'team_applications'));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as TeamApplication);
    }
  } catch (err) {
    console.warn('Firestore getAllTeamApplications error:', err);
  }
  return getLocal<TeamApplication>(LS_APPLICATIONS, []);
}

// -------------------------------------------------------------
// PORTFOLIO CMS
// -------------------------------------------------------------

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const snap = await getDocs(collection(db, 'portfolio_items'));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as PortfolioItem);
    }
  } catch (err) {
    console.warn('Firestore portfolio error:', err);
  }
  return getLocal<PortfolioItem>(LS_PORTFOLIO, INITIAL_PORTFOLIO);
}

export async function savePortfolioItem(item: PortfolioItem): Promise<void> {
  try {
    const docRef = doc(db, 'portfolio_items', item.id);
    await setDoc(docRef, item);
  } catch (err) {
    console.warn('Firestore savePortfolioItem error:', err);
  }

  const existing = getLocal<PortfolioItem>(LS_PORTFOLIO, INITIAL_PORTFOLIO);
  const updated = [item, ...existing.filter((p) => p.id !== item.id)];
  setLocal(LS_PORTFOLIO, updated);
}

export async function deletePortfolioItem(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'portfolio_items', id);
    // deleteDoc if needed
  } catch (err) {
    console.warn('Firestore delete error:', err);
  }

  const existing = getLocal<PortfolioItem>(LS_PORTFOLIO, INITIAL_PORTFOLIO);
  setLocal(LS_PORTFOLIO, existing.filter((p) => p.id !== id));
}

// -------------------------------------------------------------
// COMPATIBILITY ALIASES & STATUS UPDATERS
// -------------------------------------------------------------

export async function updateOrderPaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<void> {
  const existing = getLocal<ProjectOrder>(LS_ORDERS, SEED_ORDERS);
  const currentOrder = existing.find((o) => o.id === orderId);
  const currentTimeline = currentOrder ? currentOrder.status : 'ORDER RECEIVED';
  await updateOrderStatus(orderId, currentTimeline, paymentStatus);
}

export const addDeliverableToOrder = addOrderDeliverable;
export const getManualVerifications = getAllManualVerifications;
export const updateManualVerificationStatus = reviewManualVerification;
export const getAllApplications = getAllTeamApplications;
export const submitApplication = submitTeamApplication;

export async function updateApplicationStatus(id: string, status: 'NEW' | 'REVIEWING' | 'INTERVIEW' | 'ACCEPTED' | 'DECLINED' | 'ARCHIVED'): Promise<void> {
  const existing = getLocal<TeamApplication>(LS_APPLICATIONS, []);
  const updated = existing.map((app) => (app.id === id ? { ...app, status } : app));
  setLocal(LS_APPLICATIONS, updated);

  try {
    const docRef = doc(db, 'team_applications', id);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.warn('Firestore application status update error:', err);
  }
}


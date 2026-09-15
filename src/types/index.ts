export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'PARTIAL'
  | 'FAILED'
  | 'CANCELLED'
  | 'MANUAL_REVIEW';

export type PaymentApp = 'FamApp' | 'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM' | 'Other';

export type ProjectTimelineStep =
  | 'ORDER RECEIVED'
  | 'PAYMENT VERIFIED'
  | 'IN QUEUE'
  | 'IN PRODUCTION'
  | 'REVISION'
  | 'COMPLETED'
  | 'DELIVERED';

export const TIMELINE_STEPS: ProjectTimelineStep[] = [
  'ORDER RECEIVED',
  'PAYMENT VERIFIED',
  'IN QUEUE',
  'IN PRODUCTION',
  'REVISION',
  'COMPLETED',
  'DELIVERED',
];

export interface FileAttachment {
  name: string;
  size: number;
  type: string;
  url?: string;
  dataUrl?: string; // For previews/uploads
}

export type OrderDeliverable = {
  id: string;
  title: string;
  url: string;
  uploadedAt: string;
  note?: string;
};

export type DeliverableFile = OrderDeliverable;

export interface ProjectOrder {
  id: string; // Document ID (e.g., PROJECT-2026-000001)
  projectId: string;
  clientName: string;
  email: string;
  phone: string;
  brandName?: string;
  services: string[]; // e.g. ['CGI Ads', 'Video Editing']
  serviceSlugs: string[];
  packageName?: string;
  description: string;
  deadline?: string;
  budgetRange?: string;
  referenceLinks?: string;
  notes?: string;
  attachments?: FileAttachment[];
  expectedAmount: number; // 0 if custom quote required
  isCustomQuote: boolean;
  currency: 'INR' | 'USD';
  status: ProjectTimelineStep;
  paymentStatus: PaymentStatus;
  selectedPaymentApp?: PaymentApp;
  paymentId?: string;
  deliverables?: OrderDeliverable[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  paymentId: string;
  orderId: string;
  provider: string; // 'upi_qr' | 'razorpay' | 'cashfree' | 'stripe'
  transactionId?: string;
  webhookEventId?: string;
  expectedAmount: number;
  receivedAmount: number;
  currency: string;
  paymentApp: PaymentApp;
  status: PaymentStatus;
  rawPayload?: Record<string, unknown>;
  createdAt: string;
  verifiedAt?: string;
}

export interface ManualPaymentVerification {
  id: string;
  orderId: string;
  transactionIdUtr: string;
  paymentApp: PaymentApp;
  amountPaid: number;
  dateTime: string;
  screenshotNote?: string;
  screenshotDataUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFO';
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface ProjectMessage {
  id: string;
  projectId: string;
  sender: 'client' | 'agency_admin' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: FileAttachment[];
}

export interface TeamApplication {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  experience: string;
  portfolio?: string;
  portfolioUrl?: string;
  socialLink?: string;
  reason?: string;
  notes?: string;
  availability?: string;
  expectedCompensation?: string;
  resumeFileName?: string;
  submittedAt: string;
  status: 'NEW' | 'REVIEWING' | 'INTERVIEW' | 'ACCEPTED' | 'DECLINED' | 'ARCHIVED';
}

export type FreelanceApplication = TeamApplication;

export interface WebhookLogEvent {
  id: string;
  eventId: string;
  orderId: string;
  provider: string;
  receivedAt: string;
  isDuplicate: boolean;
  status: 'SUCCESS' | 'MISMATCH' | 'FAILED';
  rawEvent: string;
}

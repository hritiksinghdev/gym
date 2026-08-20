export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ClientData {
  id: string;
  memberId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  dateOfBirth?: string | Date | null;
  gender?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  photoUrl?: string | null;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  memberships?: MembershipData[];
  payments?: PaymentData[];
}

export interface MembershipPlanData {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  description?: string | null;
  benefits?: string | null; // JSON string
  isActive: boolean;
  sortOrder: number;
}

export interface MembershipData {
  id: string;
  clientId: string;
  planId: string;
  startDate: string | Date;
  endDate: string | Date;
  amount: number;
  discount: number;
  finalAmount: number;
  paymentStatus: "PAID" | "PENDING" | "PARTIAL";
  status: "ACTIVE" | "EXPIRED" | "EXPIRING_SOON" | "SUSPENDED" | "UPCOMING" | "CANCELLED";
  notes?: string | null;
  createdAt: string | Date;
  client?: ClientData;
  plan?: MembershipPlanData;
  payments?: PaymentData[];
}

export interface PaymentData {
  id: string;
  clientId: string;
  membershipId?: string | null;
  amount: number;
  paymentMethod: "CASH" | "UPI" | "CARD" | "BANK_TRANSFER" | "OTHER";
  paymentDate: string | Date;
  transactionId?: string | null;
  status: "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED";
  notes?: string | null;
  client?: ClientData;
  membership?: MembershipData;
}

export interface TrainerData {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  photoUrl?: string | null;
  bio?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface GymSettingsData {
  id: string;
  gymName: string;
  tagline: string;
  logoUrl?: string | null;
  heroHeadline: string;
  heroDescription: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  openingHours: string;
  googleMapsUrl: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  currencySymbol: string;
  memberIdPrefix: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  expiringSoonMembers: number;
  todayNewMembers: number;
  todayRevenue: number;
  monthlyRevenue: number;
}

export type MembershipComputedStatus =
  | "ACTIVE"
  | "EXPIRING_SOON"
  | "EXPIRED"
  | "UPCOMING"
  | "SUSPENDED"
  | "CANCELLED";

export interface MembershipStatusInfo {
  status: MembershipComputedStatus;
  label: string;
  badgeClass: string;
  daysRemaining: number;
  isExpiringSoon: boolean;
  isExpired: boolean;
  isActive: boolean;
}

/**
 * Derives membership status mathematically from dates.
 * Requirement 11:
 * If today < start_date -> UPCOMING
 * If start_date <= today <= expiry_date -> ACTIVE
 * If expiry_date - today <= 7 days (and not expired) -> EXPIRING_SOON
 * If today > expiry_date -> EXPIRED
 */
export function getMembershipStatus(
  startDateInput: Date | string,
  endDateInput: Date | string,
  manualStatus?: string | null
): MembershipStatusInfo {
  if (manualStatus === "SUSPENDED") {
    return {
      status: "SUSPENDED",
      label: "Suspended",
      badgeClass: "badge-suspended",
      daysRemaining: 0,
      isExpiringSoon: false,
      isExpired: false,
      isActive: false,
    };
  }

  if (manualStatus === "CANCELLED") {
    return {
      status: "CANCELLED",
      label: "Cancelled",
      badgeClass: "badge-cancelled",
      daysRemaining: 0,
      isExpiringSoon: false,
      isExpired: false,
      isActive: false,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDateInput);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDateInput);
  end.setHours(23, 59, 59, 999);

  const diffTime = end.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (today < start) {
    return {
      status: "UPCOMING",
      label: "Upcoming",
      badgeClass: "badge-upcoming",
      daysRemaining,
      isExpiringSoon: false,
      isExpired: false,
      isActive: false,
    };
  }

  if (today > end) {
    return {
      status: "EXPIRED",
      label: "Expired",
      badgeClass: "badge-expired",
      daysRemaining: 0,
      isExpiringSoon: false,
      isExpired: true,
      isActive: false,
    };
  }

  if (daysRemaining <= 7 && daysRemaining >= 0) {
    return {
      status: "EXPIRING_SOON",
      label: `Expiring Soon (${daysRemaining}d)`,
      badgeClass: "badge-warning",
      daysRemaining,
      isExpiringSoon: true,
      isExpired: false,
      isActive: true,
    };
  }

  return {
    status: "ACTIVE",
    label: "Active",
    badgeClass: "badge-active",
    daysRemaining,
    isExpiringSoon: false,
    isExpired: false,
    isActive: true,
  };
}

export function formatDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "N/A";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateInput(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

export function formatCurrency(amount: number | null | undefined, symbol = "₹"): string {
  if (amount === null || amount === undefined || isNaN(amount)) return `${symbol}0`;
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  // Strip non-digit characters
  let cleanPhone = phone.replace(/\D/g, "");
  // If Indian phone without country code (10 digits), prepend 91
  if (cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppReminderMessage(
  clientName: string,
  planName: string,
  expiryDateFormatted: string,
  gymName = "TITAN FORGE GYM"
): string {
  return `Hi ${clientName}, this is a reminder from ${gymName}. Your ${planName} membership is expiring on ${expiryDateFormatted}. Please contact us or visit the front desk to renew and continue your training without interruption! 💪🔥`;
}

export function getWhatsAppExpiredMessage(
  clientName: string,
  planName: string,
  expiryDateFormatted: string,
  gymName = "TITAN FORGE GYM"
): string {
  return `Hi ${clientName}, your ${planName} membership at ${gymName} expired on ${expiryDateFormatted}. We'd love to see you back on the floor! Reach out to renew your membership today. 🏋️‍♂️`;
}

export function getWhatsAppWelcomeMessage(
  clientName: string,
  memberId: string,
  planName: string,
  expiryDateFormatted: string,
  gymName = "TITAN FORGE GYM"
): string {
  return `Welcome to ${gymName}, ${clientName}! 🏋️\n\nYour Member ID is: *${memberId}*\nMembership Plan: *${planName}*\nValid Until: *${expiryDateFormatted}*\n\nGet ready to crush your goals! If you need anything, we're right here.`;
}

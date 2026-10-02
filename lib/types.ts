export type Role = "DOCTOR" | "SECRETARY";

export type WeekDay =
  | "SATURDAY" | "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";

export const WEEKDAY_LABELS: Record<WeekDay, string> = {
  SATURDAY: "شەممە",
  SUNDAY: "یەکشەممە",
  MONDAY: "دووشەممە",
  TUESDAY: "سێشەممە",
  WEDNESDAY: "چوارشەممە",
  THURSDAY: "پێنجشەممە",
  FRIDAY: "هەینی",
};
export const WEEKDAYS = Object.keys(WEEKDAY_LABELS) as WeekDay[];

export interface Patient {
  id: string;
  name: string;
  phone: string;
  age?: number;
  bloodGroup?: string;
  emergencyContact?: string;
  illness?: string;
  /** @deprecated superseded by the PatientNote[] list (see `patientNotes`
   * in the store) — kept only so old seed data still type-checks. The UI
   * no longer reads this field directly. */
  notes?: string;
  lastVisitDate?: string;
}

/** A single, timestamped note entry. Notes are append-only — once added
 * they're never edited or deleted, so the patient's history stays intact
 * (doctor-only, per the access rules elsewhere in this demo). */
export interface PatientNote {
  id: string;
  patientId: string;
  text: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: "BLOOD_TEST" | "XRAY" | "PRESCRIPTION" | "OTHER";
  title: string;
  result?: string;
  createdAt: string;
}

export type AppointmentStatus = "PENDING" | "IN_QUEUE" | "COMPLETED" | "CANCELLED";

export interface Appointment {
  id: string;
  patientId: string;
  visitDate: string; // ISO date (midnight) of the actual calendar day booked — patient/secretary picks any day up to 6 months out
  visitTime?: string; // "14:30" — the specific time slot requested, shown alongside the date
  symptoms?: string;
  status: AppointmentStatus;
  queuePosition: number;
  createdAt: string; // when the booking itself was made — shown separately from visitDate/visitTime
}

export type QueueStatus = "WAITING" | "IN_ROOM" | "DONE";

export interface QueueEntry {
  id: string;
  patientId: string;
  queueNumber: number;
  status: QueueStatus;
  xrayStatus?: string;
  insuranceNo?: string;
  paid: boolean;
  visitDate: string; // ISO date of the day this entry belongs to
  createdAt: string;
}

export type InvoiceStatus = "COLLECTED" | "NOT_COLLECTED";

export interface Invoice {
  id: string;
  patientId?: string;
  amount: number;
  status: InvoiceStatus;
  description?: string;
  issuedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  batchNumber?: string;
  stockLevel: number;
  lowStockAt: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
  active: boolean;
}

export interface Surgery {
  id: string;
  patientName: string;
  scheduledAt: string;
  type: string;
  consentNote?: string;
  /** Base64 PNG data URL of a drawn signature or stamp, captured via the
   * on-screen signature pad — the family member's/guardian's actual mark,
   * not just a typed note. */
  consentSignature?: string;
}

export type NotificationType = "APPOINTMENT_REMINDER" | "QUEUE_ALERT" | "LOW_STOCK" | "SEMINAR" | "EMERGENCY" | "SYSTEM";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body?: string;
  read: boolean;
  createdAt: string;
}

export interface ClinicSettings {
  clinic_address: string;
  clinic_phone: string;
  consultation_fee: string;
  reminder_hours: string;
  sms_reminders: boolean;
  whatsapp_reminders: boolean;
  shift_active: boolean;
}

export interface DeviceKeyDemo {
  id: string;
  label: string;
  key: string;
  active: boolean;
  createdAt: string;
  lastUsedAt?: string;
}

export interface CurrentUser {
  name: string;
  email: string;
  role: Role;
}

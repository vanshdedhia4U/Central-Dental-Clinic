export type ShiftType = 'morning' | 'evening';

export type AppointmentStatus = 'Upcoming' | 'In-Chair' | 'Completed' | 'Rescheduled' | 'Cancelled';

export interface PrescriptionItem {
  id: string;
  medicine: string;
  dosage: string;
  frequency: string; // e.g. "Twice a day (1-0-1)"
  duration: string;  // e.g. "5 days"
  instructions: string; // e.g. "After food"
}

export interface ClinicalNotes {
  chiefComplaint: string;
  clinicalExamination: string;
  diagnosis: string;
  treatmentDone: string;
  prescriptions: PrescriptionItem[];
  doctorRemarks: string;
  postOpAdvice: string;
  nextFollowUpDate?: string;
  recordedAt: string;
  recordedBy: string;
}

export interface Appointment {
  id: string;
  referenceCode: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge?: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  shift: ShiftType;
  service: string;
  symptoms?: string;
  medicalHistory?: string;
  status: AppointmentStatus;
  isWalkIn?: boolean;
  clinicalNotes?: ClinicalNotes;
  createdAt: string;
}

export interface BlockedSlot {
  id: string;
  date: string;
  timeSlot: string;
  reason: string;
  blockedAt: string;
}

export interface ScheduleSettings {
  isOpenSunday: boolean;
  morningShiftStart: string; // "10:00"
  morningShiftEnd: string;   // "14:00"
  eveningShiftStart: string; // "18:00"
  eveningShiftEnd: string;   // "22:00"
  slotDurationMinutes: number; // 30
  maxPatientsPerSlot: number;
  clinicNotice: string;
  blockedDates: string[]; // ['2026-10-15', ...]
  blockedSlots: BlockedSlot[];
}

export interface DoctorCredential {
  id: string;
  doctorName: string;
  email: string;
  password: string;
  role: 'dentist' | 'specialist';
  title: string;
  contactPhone: string;
  shiftAssignment: 'both' | 'morning' | 'evening';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface DeveloperCredential {
  email: string;
  password: string;
  role: 'developer';
  name: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'operatory' | 'technology' | 'interiors' | 'hygiene';
  categoryLabel: string;
  imageUrl: string;
  description: string;
  features: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  iconName: string;
  duration: string;
  badge?: string;
  keyBenefits: string[];
  recommendedFor: string;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, ClinicalNotes, DoctorCredential, ScheduleSettings, BlockedSlot, AppointmentStatus } from '../types/clinic';
import { INITIAL_APPOINTMENTS, INITIAL_DOCTORS } from '../data/clinicData';

interface AuthUser {
  role: 'developer' | 'dentist';
  name: string;
  email: string;
  doctorId?: string;
  title?: string;
}

interface BookingFormData {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge?: number;
  date: string;
  timeSlot: string;
  service: string;
  symptoms?: string;
  medicalHistory?: string;
}

interface ClinicContextType {
  // Appointments
  appointments: Appointment[];
  bookAppointment: (data: BookingFormData) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  saveClinicalNotes: (appointmentId: string, notes: ClinicalNotes) => void;
  deleteAppointment: (id: string) => void;
  addWalkInAppointment: (data: BookingFormData & { shift?: 'morning' | 'evening' }) => Appointment;

  // Schedule Management (Directly managed by Dentist)
  scheduleSettings: ScheduleSettings;
  updateScheduleSettings: (settings: Partial<ScheduleSettings>) => void;
  addBlockedSlot: (date: string, timeSlot: string, reason: string) => void;
  removeBlockedSlot: (id: string) => void;
  toggleBlockedDate: (date: string) => void;
  getAvailableSlotsForDate: (dateString: string) => { morning: string[]; evening: string[] };

  // Developer Credential Management
  doctors: DoctorCredential[];
  addDoctorCredential: (cred: Omit<DoctorCredential, 'id' | 'createdAt'>) => void;
  updateDoctorCredential: (id: string, updates: Partial<DoctorCredential>) => void;
  deleteDoctorCredential: (id: string) => void;

  // Authentication
  currentUser: AuthUser | null;
  loginAsDeveloper: (pass: string) => boolean;
  loginAsDoctor: (email: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  quickLoginAsDoctor: (doctorId?: string) => void;
  quickLoginAsDeveloper: () => void;
}

const DEFAULT_SCHEDULE: ScheduleSettings = {
  isOpenSunday: false,
  morningShiftStart: '10:00',
  morningShiftEnd: '14:00',
  eveningShiftStart: '18:00',
  eveningShiftEnd: '22:00',
  slotDurationMinutes: 30,
  maxPatientsPerSlot: 2,
  clinicNotice: 'Standard sterilisation and digital OPG protocol in effect.',
  blockedDates: [],
  blockedSlots: [
    {
      id: 'block-1',
      date: '2026-10-14',
      timeSlot: '01:30 PM',
      reason: 'Bi-weekly Dental Autoclave & Unit Servicing',
      blockedAt: '2026-10-10T10:00:00.000Z',
    },
  ],
};

const DEVELOPER_MASTER_PASS = 'MasterDev2026!';

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const stored = localStorage.getItem('cdc_appointments_v1');
      return stored ? JSON.parse(stored) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // Doctors / Credentials state
  const [doctors, setDoctors] = useState<DoctorCredential[]>(() => {
    try {
      const stored = localStorage.getItem('cdc_doctors_v1');
      return stored ? JSON.parse(stored) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });

  // Schedule settings
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>(() => {
    try {
      const stored = localStorage.getItem('cdc_schedule_v1');
      return stored ? JSON.parse(stored) : DEFAULT_SCHEDULE;
    } catch {
      return DEFAULT_SCHEDULE;
    }
  });

  // Active user authentication
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('cdc_auth_user_v1');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('cdc_appointments_v1', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('cdc_doctors_v1', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('cdc_schedule_v1', JSON.stringify(scheduleSettings));
  }, [scheduleSettings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cdc_auth_user_v1', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cdc_auth_user_v1');
    }
  }, [currentUser]);

  // Determine shift from time slot string (e.g. "10:30 AM" -> morning, "07:00 PM" -> evening)
  const getShiftFromTime = (timeStr: string): 'morning' | 'evening' => {
    const isPM = timeStr.toUpperCase().includes('PM');
    const parts = timeStr.replace(/[^0-9:]/g, '').split(':');
    let hour = parseInt(parts[0], 10) || 10;
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    return hour >= 16 ? 'evening' : 'morning';
  };

  // Generate slots helper
  const getAvailableSlotsForDate = (dateString: string) => {
    const d = new Date(dateString + 'T00:00:00');
    const dayOfWeek = d.getDay(); // 0 is Sunday

    if (dayOfWeek === 0 && !scheduleSettings.isOpenSunday) {
      return { morning: [], evening: [] };
    }

    if (scheduleSettings.blockedDates.includes(dateString)) {
      return { morning: [], evening: [] };
    }

    const morningTimes = [
      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    ];

    const eveningTimes = [
      '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
      '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
    ];

    // Filter out blocked slots for this date
    const blockedForDate = scheduleSettings.blockedSlots
      .filter((b) => b.date === dateString)
      .map((b) => b.timeSlot.trim().toUpperCase());

    const morning = morningTimes.filter((t) => !blockedForDate.includes(t.toUpperCase()));
    const evening = eveningTimes.filter((t) => !blockedForDate.includes(t.toUpperCase()));

    return { morning, evening };
  };

  // Book appointment
  const bookAppointment = (data: BookingFormData): Appointment => {
    const refCode = `CDC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const shift = getShiftFromTime(data.timeSlot);

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      referenceCode: refCode,
      patientName: data.patientName.trim(),
      patientPhone: data.patientPhone.trim(),
      patientEmail: data.patientEmail.trim(),
      patientAge: data.patientAge,
      date: data.date,
      timeSlot: data.timeSlot,
      shift,
      service: data.service,
      symptoms: data.symptoms?.trim() || undefined,
      medicalHistory: data.medicalHistory?.trim() || undefined,
      status: 'Upcoming',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newApt, ...prev]);
    return newApt;
  };

  const addWalkInAppointment = (data: BookingFormData & { shift?: 'morning' | 'evening' }): Appointment => {
    const refCode = `CDC-WALK-${Math.floor(1000 + Math.random() * 9000)}`;
    const shift = data.shift || getShiftFromTime(data.timeSlot);

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      referenceCode: refCode,
      patientName: data.patientName.trim(),
      patientPhone: data.patientPhone.trim(),
      patientEmail: data.patientEmail.trim() || 'walkin@clinic.local',
      patientAge: data.patientAge,
      date: data.date,
      timeSlot: data.timeSlot,
      shift,
      service: data.service,
      symptoms: data.symptoms?.trim() || 'Walk-in consultation',
      status: 'In-Chair',
      isWalkIn: true,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newApt, ...prev]);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const saveClinicalNotes = (appointmentId: string, notes: ClinicalNotes) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? {
              ...apt,
              clinicalNotes: notes,
              // If clinical notes were added and status is still upcoming, advance to in-chair or completed
              status: apt.status === 'Upcoming' ? 'In-Chair' : apt.status,
            }
          : apt
      )
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
  };

  // Schedule management actions
  const updateScheduleSettings = (updates: Partial<ScheduleSettings>) => {
    setScheduleSettings((prev) => ({ ...prev, ...updates }));
  };

  const addBlockedSlot = (date: string, timeSlot: string, reason: string) => {
    const newBlocked: BlockedSlot = {
      id: `block-${Date.now()}`,
      date,
      timeSlot,
      reason: reason.trim() || 'Doctor Unavailable / Maintenance',
      blockedAt: new Date().toISOString(),
    };
    setScheduleSettings((prev) => ({
      ...prev,
      blockedSlots: [newBlocked, ...prev.blockedSlots],
    }));
  };

  const removeBlockedSlot = (id: string) => {
    setScheduleSettings((prev) => ({
      ...prev,
      blockedSlots: prev.blockedSlots.filter((b) => b.id !== id),
    }));
  };

  const toggleBlockedDate = (date: string) => {
    setScheduleSettings((prev) => {
      const exists = prev.blockedDates.includes(date);
      return {
        ...prev,
        blockedDates: exists
          ? prev.blockedDates.filter((d) => d !== date)
          : [...prev.blockedDates, date],
      };
    });
  };

  // Developer Doctor Credential management
  const addDoctorCredential = (cred: Omit<DoctorCredential, 'id' | 'createdAt'>) => {
    const newDoc: DoctorCredential = {
      ...cred,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDoctors((prev) => [...prev, newDoc]);
  };

  const updateDoctorCredential = (id: string, updates: Partial<DoctorCredential>) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const deleteDoctorCredential = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  // Authentication
  const loginAsDeveloper = (pass: string): boolean => {
    if (pass === DEVELOPER_MASTER_PASS || pass.toLowerCase() === 'developer' || pass === 'MasterDev2026!') {
      setCurrentUser({
        role: 'developer',
        name: 'Webmaster / Agency Developer',
        email: 'developer@agency.com',
      });
      return true;
    }
    return false;
  };

  const loginAsDoctor = (email: string, pass: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const doc = doctors.find((d) => d.email.toLowerCase() === cleanEmail);

    if (!doc) {
      return { success: false, message: 'Doctor email not found in clinic registry.' };
    }

    if (!doc.isActive) {
      return { success: false, message: 'This doctor account is currently deactivated. Contact developer.' };
    }

    if (doc.password !== pass) {
      return { success: false, message: 'Incorrect password for this doctor profile.' };
    }

    // Update lastLogin
    updateDoctorCredential(doc.id, { lastLogin: new Date().toISOString() });

    setCurrentUser({
      role: 'dentist',
      doctorId: doc.id,
      name: doc.doctorName,
      email: doc.email,
      title: doc.title,
    });

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickLoginAsDoctor = (doctorId?: string) => {
    const targetDoc = doctorId ? doctors.find((d) => d.id === doctorId) : doctors[0];
    if (targetDoc) {
      setCurrentUser({
        role: 'dentist',
        doctorId: targetDoc.id,
        name: targetDoc.doctorName,
        email: targetDoc.email,
        title: targetDoc.title,
      });
    }
  };

  const quickLoginAsDeveloper = () => {
    setCurrentUser({
      role: 'developer',
      name: 'Webmaster / Agency Developer',
      email: 'developer@agency.com',
    });
  };

  return (
    <ClinicContext.Provider
      value={{
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        saveClinicalNotes,
        deleteAppointment,
        addWalkInAppointment,
        scheduleSettings,
        updateScheduleSettings,
        addBlockedSlot,
        removeBlockedSlot,
        toggleBlockedDate,
        getAvailableSlotsForDate,
        doctors,
        addDoctorCredential,
        updateDoctorCredential,
        deleteDoctorCredential,
        currentUser,
        loginAsDeveloper,
        loginAsDoctor,
        logout,
        quickLoginAsDoctor,
        quickLoginAsDeveloper,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};

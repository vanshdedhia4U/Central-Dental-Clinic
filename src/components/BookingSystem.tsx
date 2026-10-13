import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { SERVICES, CLINIC_INFO } from '../data/clinicData';
import { Appointment } from '../types/clinic';

interface BookingSystemProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: string;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({
  isOpen,
  onClose,
  preSelectedService,
}) => {
  const { bookAppointment, getAvailableSlotsForDate, scheduleSettings } = useClinic();

  // Step state: 1 = Service & Date/Time, 2 = Patient Details, 3 = Confirmed
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<string>(
    preSelectedService || SERVICES[0].title
  );

  // Initialize with today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30 AM');

  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [medicalHistory, setMedicalHistory] = useState<string>('');

  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [formError, setFormError] = useState<string>('');

  if (!isOpen) return null;

  // Retrieve available slots dynamically
  const { morning: morningSlots, evening: eveningSlots } = getAvailableSlotsForDate(selectedDate);
  const allAvailableSlots = [...morningSlots, ...eveningSlots];

  // If currently selected slot is not in available slots, auto-select first available
  if (allAvailableSlots.length > 0 && !allAvailableSlots.includes(selectedTimeSlot)) {
    // update slot when needed
  }

  const handleNextToDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) {
      setFormError('Please select a dental service or consultation');
      return;
    }
    if (!selectedDate) {
      setFormError('Please pick an appointment date');
      return;
    }
    if (!selectedTimeSlot) {
      setFormError('Please pick an available time slot');
      return;
    }
    setFormError('');
    setStep(2);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setFormError('Please enter the patient full name');
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 8) {
      setFormError('Please enter a valid 10-digit mobile contact number');
      return;
    }

    try {
      const created = bookAppointment({
        patientName,
        patientPhone,
        patientEmail: patientEmail.trim() || `${patientName.toLowerCase().replace(/\s+/g, '')}@patient.local`,
        patientAge: patientAge ? parseInt(patientAge, 10) : undefined,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        service: selectedService,
        symptoms,
        medicalHistory,
      });

      setConfirmedAppointment(created);
      setStep(3);
    } catch {
      setFormError('Failed to confirm booking. Please try again or call the clinic.');
    }
  };

  const handleDownloadICS = () => {
    if (!confirmedAppointment) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Central Dental Clinic Kalyan//Appointment//EN
BEGIN:VEVENT
SUMMARY:Dental Visit: ${confirmedAppointment.service}
DESCRIPTION:Appointment with ${CLINIC_INFO.doctorName} at Central Dental Clinic Kalyan. Reference: ${confirmedAppointment.referenceCode}. Address: ${CLINIC_INFO.address}. Phone: ${CLINIC_INFO.phone1}
LOCATION:${CLINIC_INFO.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appointment-${confirmedAppointment.referenceCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetAndClose = () => {
    setStep(1);
    setConfirmedAppointment(null);
    setFormError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Top Banner */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Central Dental Clinic & Hospital Kalyan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif">
            {step === 3 ? 'Appointment Confirmed' : 'Book Your Dental Consultation'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {step === 3
              ? 'Your clinic slot is verified and entered into Dr. Mahesh Deokar\'s live schedule.'
              : 'Choose your desired treatment, consultation time slot, and patient details.'}
          </p>

          {/* Step Progress Indicator (when not confirmed) */}
          {step < 3 && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
              <div
                className={`flex items-center gap-1.5 font-medium ${
                  step === 1 ? 'text-teal-400 font-semibold' : 'text-slate-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[11px] border border-slate-700">
                  1
                </span>
                <span>Select Service & Slot</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <div
                className={`flex items-center gap-1.5 font-medium ${
                  step === 2 ? 'text-teal-400 font-semibold' : 'text-slate-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[11px] border border-slate-700">
                  2
                </span>
                <span>Patient Information</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {formError && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: SERVICE & TIME */}
          {step === 1 && (
            <form onSubmit={handleNextToDetails} className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Treatment or Consultation
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-sm font-medium"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title} ({s.duration})
                    </option>
                  ))}
                  <option value="General Checkup & Consultation">General Dental Checkup & Consultation</option>
                  <option value="Emergency Toothache & Pain Relief">Emergency Toothache & Pain Relief</option>
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Preferred Appointment Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-sm"
                    required
                  />
                </div>
                {scheduleSettings.blockedDates.includes(selectedDate) && (
                  <p className="mt-1.5 text-xs text-amber-700 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Clinic is closed on this selected date. Please pick another date.</span>
                  </p>
                )}
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Choose Available Time Slot
                </label>

                {allAvailableSlots.length === 0 ? (
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs text-center">
                    No open appointment slots available for {selectedDate}. The doctor may be off-duty or slots are blocked. Please select another date.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Morning Shift */}
                    {morningSlots.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          <span>Morning Shift (10:00 AM – 02:00 PM)</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {morningSlots.map((slot) => (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`py-2 px-2.5 text-xs rounded-lg font-medium border transition-all cursor-pointer ${
                                selectedTimeSlot === slot
                                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evening Shift */}
                    {eveningSlots.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          <span>Evening Shift (06:00 PM – 10:00 PM)</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {eveningSlots.map((slot) => (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`py-2 px-2.5 text-xs rounded-lg font-medium border transition-all cursor-pointer ${
                                selectedTimeSlot === slot
                                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={allAvailableSlots.length === 0}
                  className="w-full py-3 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <span>Proceed to Patient Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PATIENT DETAILS */}
          {step === 2 && (
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="bg-teal-50/80 rounded-lg p-3 border border-teal-100 text-xs text-teal-900 flex items-center justify-between">
                <div>
                  <span className="font-semibold">{selectedService}</span>
                  <div>{selectedDate} at {selectedTimeSlot}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-teal-700 underline font-medium hover:text-teal-900 cursor-pointer"
                >
                  Change Slot
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patil"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 00000"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="115"
                    placeholder="e.g. 34"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Describe Main Symptoms or Chief Complaint
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Toothache while drinking cold water, missing back teeth, need OPG scan"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Medical Conditions / Drug Allergies (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. High BP, Diabetes, Penicillin allergy, or None"
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: BOOKING CONFIRMED */}
          {step === 3 && confirmedAppointment && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">
                  Appointment Successfully Booked!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  A clinical slot has been reserved with {CLINIC_INFO.doctorName}. We look forward to seeing you at our Kalyan West clinic.
                </p>
              </div>

              {/* Appointment Slip Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Booking Reference</div>
                    <div className="text-base font-bold font-mono text-teal-800">{confirmedAppointment.referenceCode}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Scheduled
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Patient:</span>
                    <div className="font-semibold text-slate-900">{confirmedAppointment.patientName}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Contact:</span>
                    <div className="font-semibold text-slate-900">{confirmedAppointment.patientPhone}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Date:</span>
                    <div className="font-semibold text-slate-900">{confirmedAppointment.date}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Time Slot:</span>
                    <div className="font-semibold text-slate-900">{confirmedAppointment.timeSlot}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Service:</span>
                    <div className="font-semibold text-slate-900">{confirmedAppointment.service}</div>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Clinic Address:</span>
                    <div className="font-medium text-slate-800">{CLINIC_INFO.address}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/${CLINIC_INFO.whatsapp}?text=Hello%20Central%20Dental%20Clinic,%20I%20have%20booked%20an%20appointment.%20Ref:%20${confirmedAppointment.referenceCode},%20Name:%20${encodeURIComponent(confirmedAppointment.patientName)},%20Date:%20${confirmedAppointment.date}%20at%20${encodeURIComponent(confirmedAppointment.timeSlot)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send WhatsApp Confirmation</span>
                </a>

                <button
                  onClick={handleDownloadICS}
                  className="py-2.5 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Add to Calendar (.ics)</span>
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={handleResetAndClose}
                  className="text-xs text-teal-700 hover:underline font-semibold cursor-pointer"
                >
                  Done & Return to Website
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

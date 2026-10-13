import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, Clock } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { SERVICES } from '../../data/clinicData';

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate: string;
}

export const WalkInModal: React.FC<WalkInModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
}) => {
  const { addWalkInAppointment } = useClinic();

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [service, setService] = useState(SERVICES[0].title);
  const [timeSlot, setTimeSlot] = useState('11:00 AM');
  const [symptoms, setSymptoms] = useState('');
  const [shift, setShift] = useState<'morning' | 'evening'>('morning');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    addWalkInAppointment({
      patientName,
      patientPhone: patientPhone.trim() || 'Offline Walk-in',
      patientEmail: `${patientName.toLowerCase().replace(/\s+/g, '')}@walkin.local`,
      patientAge: patientAge ? parseInt(patientAge, 10) : undefined,
      date: defaultDate,
      timeSlot,
      service,
      symptoms: symptoms.trim() || 'Urgent walk-in consultation',
      shift,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-teal-400" />
            <h3 className="font-serif font-bold text-base sm:text-lg">Add Walk-In / Urgent Patient</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Patient Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rameshwar Patil"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98200 00000"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Age
              </label>
              <input
                type="number"
                placeholder="45"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Shift
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as 'morning' | 'evening')}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900"
              >
                <option value="morning">Morning (10am-2pm)</option>
                <option value="evening">Evening (6pm-10pm)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Slot Time
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="11:00 AM"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Primary Concern / Treatment
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900"
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.title}>{s.title}</option>
              ))}
              <option value="Emergency Toothache & Pain Relief">Emergency Toothache & Pain Relief</option>
              <option value="General Checkup & Consultation">General Checkup & Consultation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Immediate Symptoms / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Swollen cheek, acute throbbing pain"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
            >
              Add to Active Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

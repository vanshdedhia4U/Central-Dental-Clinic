import React from 'react';
import { X, Printer, Stethoscope, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Appointment } from '../../types/clinic';
import { CLINIC_INFO } from '../../data/clinicData';

interface VisitSlipModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VisitSlipModal: React.FC<VisitSlipModalProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !appointment) return null;

  const notes = appointment.clinicalNotes;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 print:m-0 print:border-none print:shadow-none print:max-w-none">
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="text-xs font-semibold text-teal-400">
            Printable Patient Visit Record & Prescription
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prescription Paper Body */}
        <div className="p-8 space-y-6 text-slate-900 font-sans print:p-4 print:text-black">
          {/* Clinic Letterhead */}
          <div className="border-b-2 border-teal-800 pb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold font-serif text-teal-900">
                  {CLINIC_INFO.name}
                </h2>
              </div>
              <div className="text-xs font-semibold text-teal-700 tracking-wide mt-1">
                {CLINIC_INFO.tagline} · In-House Full Mouth OPG Centre
              </div>
              <p className="text-[11px] text-slate-600 mt-1 max-w-md">
                {CLINIC_INFO.address}
              </p>
            </div>

            <div className="text-right text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-900">{CLINIC_INFO.doctorName}</div>
              <div className="text-[11px] text-slate-500">{CLINIC_INFO.doctorDegree}</div>
              <div className="text-[11px]">Phone: {CLINIC_INFO.phone1}</div>
              <div className="font-mono text-[11px] text-teal-800 font-bold mt-1">
                Ref: {appointment.referenceCode}
              </div>
            </div>
          </div>

          {/* Patient Details Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Patient Name</span>
              <strong className="text-slate-900">{appointment.patientName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Age / Gender</span>
              <span className="text-slate-800 font-medium">{appointment.patientAge ? `${appointment.patientAge} Yrs` : 'Adult'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Visit Date & Slot</span>
              <span className="text-slate-800 font-medium">{appointment.date} ({appointment.timeSlot})</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Contact</span>
              <span className="text-slate-800 font-medium">{appointment.patientPhone}</span>
            </div>
          </div>

          {/* Clinical Findings & Diagnosis */}
          <div className="space-y-3 text-xs">
            {notes?.diagnosis && (
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Diagnosis:</span>
                <p className="text-slate-900 font-medium mt-0.5 bg-teal-50/50 p-2 rounded border border-teal-100">
                  {notes.diagnosis}
                </p>
              </div>
            )}

            {notes?.treatmentDone && (
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Treatment Performed:</span>
                <p className="text-slate-800 mt-0.5 leading-relaxed bg-slate-50 p-2 rounded border border-slate-200">
                  {notes.treatmentDone}
                </p>
              </div>
            )}
          </div>

          {/* Rx Prescriptions */}
          {notes?.prescriptions && notes.prescriptions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-serif font-black text-teal-900">℞</span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Medical Prescription</span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Medicine</th>
                      <th className="py-2 px-3 font-semibold">Dosage</th>
                      <th className="py-2 px-3 font-semibold">Frequency</th>
                      <th className="py-2 px-3 font-semibold">Duration</th>
                      <th className="py-2 px-3 font-semibold">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {notes.prescriptions.map((rx, idx) => (
                      <tr key={rx.id || idx}>
                        <td className="py-2 px-3 font-bold text-slate-900">{rx.medicine}</td>
                        <td className="py-2 px-3 text-slate-700">{rx.dosage}</td>
                        <td className="py-2 px-3 text-slate-700">{rx.frequency}</td>
                        <td className="py-2 px-3 text-slate-700">{rx.duration}</td>
                        <td className="py-2 px-3 text-slate-600 italic">{rx.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Post-Op Advice & Follow Up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            {notes?.postOpAdvice && (
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Instructions for Patient:</span>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  {notes.postOpAdvice}
                </p>
              </div>
            )}

            {notes?.nextFollowUpDate && (
              <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-lg">
                <span className="font-bold text-teal-900 block text-[11px] uppercase tracking-wider">Next Recommended Follow-Up:</span>
                <div className="text-sm font-bold text-teal-800 mt-0.5">
                  {notes.nextFollowUpDate}
                </div>
                <div className="text-[11px] text-teal-700 mt-0.5">Please bring this slip along for suture removal / review.</div>
              </div>
            )}
          </div>

          {/* Signature Line */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs">
            <div className="text-[11px] text-slate-500">
              Generated by Central Dental Clinic Management Portal · Valid Medical Record
            </div>
            <div className="text-center">
              <div className="font-serif font-bold text-teal-900">{notes?.recordedBy || CLINIC_INFO.doctorName}</div>
              <div className="text-[11px] text-slate-500">Authorized Dental Surgeon & Sign</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Printer, Stethoscope, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { Appointment, ClinicalNotes, PrescriptionItem } from '../../types/clinic';
import { CLINIC_INFO } from '../../data/clinicData';

interface ClinicalNotesModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: ClinicalNotes) => void;
  onPrintSlip: (appointment: Appointment) => void;
  doctorName: string;
}

const RX_TEMPLATES = [
  {
    name: 'Post-Root Canal Protocol',
    items: [
      { medicine: 'Augmentin 625mg', dosage: '1 tablet', frequency: 'Twice daily (1-0-1)', duration: '5 days', instructions: 'After meals' },
      { medicine: 'Combiflam (Ibuprofen + Paracetamol)', dosage: '1 tablet', frequency: 'Thrice daily (1-1-1)', duration: '3 days', instructions: 'After meals for pain relief' },
      { medicine: 'Pantoprazole 40mg', dosage: '1 tablet', frequency: 'Once daily (1-0-0)', duration: '5 days', instructions: '30 mins before breakfast' },
    ],
  },
  {
    name: 'Post-Implant & Surgical Protocol',
    items: [
      { medicine: 'Moxikind-CV 625mg', dosage: '1 tablet', frequency: 'Twice daily (1-0-1)', duration: '5 days', instructions: 'After meals' },
      { medicine: 'Zerodol-SP', dosage: '1 tablet', frequency: 'Twice daily (1-0-1)', duration: '4 days', instructions: 'After meals with plenty of water' },
      { medicine: 'Chlorhexidine 0.2% Mouthwash', dosage: '10 ml', frequency: 'Twice daily', duration: '7 days', instructions: 'Gentle mouth rinse 30 mins after brushing' },
    ],
  },
  {
    name: 'Acute Pain Relief (SOS)',
    items: [
      { medicine: 'Ketorol-DT 10mg', dosage: '1 dispersible tablet', frequency: 'SOS (as needed)', duration: '2 days', instructions: 'Dissolve in half glass of water' },
      { medicine: 'Pan-D', dosage: '1 capsule', frequency: 'Once daily', duration: '3 days', instructions: 'Before breakfast' },
    ],
  },
];

export const ClinicalNotesModal: React.FC<ClinicalNotesModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onSave,
  onPrintSlip,
  doctorName,
}) => {
  const existing = appointment.clinicalNotes;

  const [chiefComplaint, setChiefComplaint] = useState(
    existing?.chiefComplaint || appointment.symptoms || ''
  );
  const [clinicalExamination, setClinicalExamination] = useState(
    existing?.clinicalExamination || ''
  );
  const [diagnosis, setDiagnosis] = useState(existing?.diagnosis || '');
  const [treatmentDone, setTreatmentDone] = useState(existing?.treatmentDone || '');
  const [doctorRemarks, setDoctorRemarks] = useState(existing?.doctorRemarks || '');
  const [postOpAdvice, setPostOpAdvice] = useState(
    existing?.postOpAdvice || 'Maintain oral hygiene, avoid chewing hard foods on the treated side today.'
  );
  const [nextFollowUpDate, setNextFollowUpDate] = useState(
    existing?.nextFollowUpDate || ''
  );

  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(
    existing?.prescriptions || [
      {
        id: 'rx-default-1',
        medicine: 'Augmentin 625mg',
        dosage: '1 tablet',
        frequency: 'Twice daily (1-0-1)',
        duration: '5 days',
        instructions: 'After meals',
      },
    ]
  );

  if (!isOpen) return null;

  const handleAddPrescription = () => {
    const newItem: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      medicine: '',
      dosage: '1 tab',
      frequency: 'Twice daily (1-0-1)',
      duration: '5 days',
      instructions: 'After food',
    };
    setPrescriptions([...prescriptions, newItem]);
  };

  const handleUpdatePrescription = (id: string, field: keyof PrescriptionItem, val: string) => {
    setPrescriptions(
      prescriptions.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleRemovePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter((item) => item.id !== id));
  };

  const handleApplyTemplate = (tmpl: (typeof RX_TEMPLATES)[0]) => {
    const newItems: PrescriptionItem[] = tmpl.items.map((it, idx) => ({
      id: `rx-tmpl-${Date.now()}-${idx}`,
      ...it,
    }));
    setPrescriptions(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const notes: ClinicalNotes = {
      chiefComplaint: chiefComplaint.trim(),
      clinicalExamination: clinicalExamination.trim(),
      diagnosis: diagnosis.trim(),
      treatmentDone: treatmentDone.trim(),
      prescriptions: prescriptions.filter((p) => p.medicine.trim().length > 0),
      doctorRemarks: doctorRemarks.trim(),
      postOpAdvice: postOpAdvice.trim(),
      nextFollowUpDate: nextFollowUpDate || undefined,
      recordedAt: new Date().toISOString(),
      recordedBy: doctorName || CLINIC_INFO.doctorName,
    };
    onSave(notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif">
                  Clinical Examination & Visit Notes
                </h3>
                <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded-md text-teal-300">
                  {appointment.referenceCode}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Patient: <strong className="text-white">{appointment.patientName}</strong>
                {appointment.patientAge ? ` (${appointment.patientAge}y)` : ''} · {appointment.timeSlot} · {appointment.service}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPrintSlip(appointment)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Section 1: Clinical Observation & Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Chief Complaint & Symptoms *
              </label>
              <textarea
                rows={3}
                required
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="e.g. Sharp pain in lower right tooth #46 aggravated by cold/hot liquids"
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Clinical & Radiographic Examination (OPG / IOPA)
              </label>
              <textarea
                rows={3}
                value={clinicalExamination}
                onChange={(e) => setClinicalExamination(e.target.value)}
                placeholder="e.g. Deep disto-occlusal caries #46, percussion positive, OPG confirms periapical radiolucency"
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Clinical Diagnosis *
              </label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Irreversible Pulpitis #46 with Apical Periodontitis"
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Next Follow-Up / Review Date
              </label>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Section 2: Procedure & Treatment Performed */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Treatment / Procedure Performed Today *
            </label>
            <textarea
              rows={3}
              required
              value={treatmentDone}
              onChange={(e) => setTreatmentDone(e.target.value)}
              placeholder="e.g. 2% Lignocaine nerve block given. Access cavity prepared under rubber dam. Working length verified via apex locator (21mm). Bio-mechanical preparation completed with Rotary ProTaper Gold up to F2. Irrigated with 3% NaOCl and saline. Obturated with Gutta-Percha and AH-Plus sealer. Cavity sealed with composite restoration."
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Section 3: Prescriptions (Rx) */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-700" />
                  <span>Prescription / Medications (Rx)</span>
                </label>
                <div className="text-[11px] text-slate-500">
                  Prescribe antibiotics, analgesics, mouthwashes, and instructions.
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400">Quick Templates:</span>
                {RX_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-[11px] font-medium text-slate-700 border border-slate-200 cursor-pointer transition-colors"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Prescriptions Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <div className="divide-y divide-slate-200">
                {prescriptions.map((item, index) => (
                  <div key={item.id} className="p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Medicine Name (e.g. Augmentin 625mg)"
                        value={item.medicine}
                        onChange={(e) => handleUpdatePrescription(item.id, 'medicine', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-900 font-semibold"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Dose (1 tab)"
                        value={item.dosage}
                        onChange={(e) => handleUpdatePrescription(item.id, 'dosage', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder="Frequency (Twice daily 1-0-1)"
                        value={item.frequency}
                        onChange={(e) => handleUpdatePrescription(item.id, 'frequency', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Duration (5 days)"
                        value={item.duration}
                        onChange={(e) => handleUpdatePrescription(item.id, 'duration', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemovePrescription(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                        title="Remove medicine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleAddPrescription}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-teal-800 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine to Prescription</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Post-Op Advice & Doctor Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Post-Operative Instructions for Patient
              </label>
              <textarea
                rows={2}
                value={postOpAdvice}
                onChange={(e) => setPostOpAdvice(e.target.value)}
                placeholder="e.g. Do not chew on treated tooth for 24 hours. Gentle warm salt water gargles from tomorrow."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Private Doctor Remarks / Clinical Prognosis
              </label>
              <textarea
                rows={2}
                value={doctorRemarks}
                onChange={(e) => setDoctorRemarks(e.target.value)}
                placeholder="e.g. Good primary seal. Review crown margin fit next Tuesday. Guarded prognosis if oral hygiene neglected."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Documenting as: <strong className="text-slate-800">{doctorName || CLINIC_INFO.doctorName}</strong>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Clinical Notes & Rx</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

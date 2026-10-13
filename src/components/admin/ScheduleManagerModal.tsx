import React, { useState } from 'react';
import { X, Calendar, Clock, Plus, Trash2, Save, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

interface ScheduleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleManagerModal: React.FC<ScheduleManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    scheduleSettings,
    updateScheduleSettings,
    addBlockedSlot,
    removeBlockedSlot,
    toggleBlockedDate,
  } = useClinic();

  const [morningStart, setMorningStart] = useState(scheduleSettings.morningShiftStart);
  const [morningEnd, setMorningEnd] = useState(scheduleSettings.morningShiftEnd);
  const [eveningStart, setEveningStart] = useState(scheduleSettings.eveningShiftStart);
  const [eveningEnd, setEveningEnd] = useState(scheduleSettings.eveningShiftEnd);
  const [slotDuration, setSlotDuration] = useState(scheduleSettings.slotDurationMinutes);
  const [openSunday, setOpenSunday] = useState(scheduleSettings.isOpenSunday);
  const [clinicNotice, setClinicNotice] = useState(scheduleSettings.clinicNotice);

  // New blocked slot form state
  const todayStr = new Date().toISOString().split('T')[0];
  const [blockDate, setBlockDate] = useState(todayStr);
  const [blockTime, setBlockTime] = useState('01:00 PM');
  const [blockReason, setBlockReason] = useState('Doctor in Surgery / Lunch Break');

  // New blocked entire date state
  const [dateToBlock, setDateToBlock] = useState(todayStr);

  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveHours = (e: React.FormEvent) => {
    e.preventDefault();
    updateScheduleSettings({
      morningShiftStart: morningStart,
      morningShiftEnd: morningEnd,
      eveningShiftStart: eveningStart,
      eveningShiftEnd: eveningEnd,
      slotDurationMinutes: Number(slotDuration),
      isOpenSunday: openSunday,
      clinicNotice: clinicNotice.trim(),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate || !blockTime) return;
    addBlockedSlot(blockDate, blockTime, blockReason);
    setBlockReason('');
  };

  const handleToggleHoliday = () => {
    if (!dateToBlock) return;
    toggleBlockedDate(dateToBlock);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center">
              <Clock className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif">
                Direct Clinic Schedule Management
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Adjust consultation shifts, block appointment slots, and set clinic holidays directly.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto space-y-7">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Clinic schedule parameters updated successfully and synced with patient booking system!</span>
            </div>
          )}

          {/* Section 1: Shifts & Hours Settings */}
          <form onSubmit={handleSaveHours} className="space-y-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Daily Shift Timings & Slot Duration
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {/* Morning Shift */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Morning Shift Hours
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={morningStart}
                    onChange={(e) => setMorningStart(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900"
                  />
                  <span className="text-xs text-slate-500">to</span>
                  <input
                    type="time"
                    value={morningEnd}
                    onChange={(e) => setMorningEnd(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Default: 10:00 to 14:00</span>
              </div>

              {/* Evening Shift */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Evening Shift Hours
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={eveningStart}
                    onChange={(e) => setEveningStart(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900"
                  />
                  <span className="text-xs text-slate-500">to</span>
                  <input
                    type="time"
                    value={eveningEnd}
                    onChange={(e) => setEveningEnd(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Default: 18:00 to 22:00</span>
              </div>

              {/* Slot Duration */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Consultation Duration
                </label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900"
                >
                  <option value={15}>15 Minutes per patient</option>
                  <option value={30}>30 Minutes (Recommended)</option>
                  <option value={45}>45 Minutes (Surgical & Implants)</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              {/* Sunday Operation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sunday Bookings
                </label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs text-slate-800">
                  <input
                    type="checkbox"
                    checked={openSunday}
                    onChange={(e) => setOpenSunday(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300"
                  />
                  <span>Allow online Sunday bookings (10 AM - 1 PM)</span>
                </label>
              </div>

              {/* Notice */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinic Announcement Notice for Booking Patients
                </label>
                <input
                  type="text"
                  value={clinicNotice}
                  onChange={(e) => setClinicNotice(e.target.value)}
                  placeholder="e.g. Standard sterilisation and digital OPG protocol in effect."
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Timings & Settings</span>
              </button>
            </div>
          </form>

          {/* Section 2: Block Specific Time Slots */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Block Specific Time Slots (Doctor Break / Surgery)
                </div>
                <div className="text-[11px] text-slate-500">
                  Patients booking on the public website will see these slots marked unavailable.
                </div>
              </div>
            </div>

            {/* Block Slot Add Form */}
            <form onSubmit={handleAddBlock} className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Time Slot</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 01:30 PM"
                  value={blockTime}
                  onChange={(e) => setBlockTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Reason</label>
                <input
                  type="text"
                  placeholder="e.g. OPG Maintenance"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-1.5 px-3 rounded-md bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Block Slot
                </button>
              </div>
            </form>

            {/* Active Blocked Slots List */}
            {scheduleSettings.blockedSlots.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                No specific time slots are currently blocked.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                {scheduleSettings.blockedSlots.map((bs) => (
                  <div key={bs.id} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">{bs.date}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700 font-medium">
                        {bs.timeSlot}
                      </span>
                      <span className="text-slate-500 italic">"{bs.reason}"</span>
                    </div>

                    <button
                      onClick={() => removeBlockedSlot(bs.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 cursor-pointer"
                      title="Unblock slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Block Entire Date (Clinic Holiday / Vacation) */}
          <div className="border-t border-slate-200 pt-6 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Block Entire Dates (Clinic Closed / Doctor Leave)
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="date"
                value={dateToBlock}
                onChange={(e) => setDateToBlock(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
              />
              <button
                type="button"
                onClick={handleToggleHoliday}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium cursor-pointer"
              >
                {scheduleSettings.blockedDates.includes(dateToBlock)
                  ? 'Re-Open Date (Remove Holiday)'
                  : 'Mark Date as Clinic Holiday'}
              </button>
            </div>

            {scheduleSettings.blockedDates.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {scheduleSettings.blockedDates.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium"
                  >
                    <span>{d} (Closed)</span>
                    <button
                      onClick={() => toggleBlockedDate(d)}
                      className="text-red-500 hover:text-red-800 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Check,
  Search,
  Filter,
  Plus,
  Settings,
  Printer,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Sparkles,
  UserPlus,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment, AppointmentStatus, ClinicalNotes } from '../../types/clinic';
import { CLINIC_INFO } from '../../data/clinicData';
import { ClinicalNotesModal } from './ClinicalNotesModal';
import { ScheduleManagerModal } from './ScheduleManagerModal';
import { WalkInModal } from './WalkInModal';
import { VisitSlipModal } from './VisitSlipModal';

export const DentistDashboard: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    saveClinicalNotes,
    deleteAppointment,
    currentUser,
    scheduleSettings,
  } = useClinic();

  // Active Date Filter (defaults to today's date in local YYYY-MM-DD format)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Active view tab: 'queue' (Daily Visits) | 'clinical-records' (Notes Archive)
  const [activeTab, setActiveTab] = useState<'queue' | 'clinical-records'>('queue');

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [shiftFilter, setShiftFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [activeNotesAppointment, setActiveNotesAppointment] = useState<Appointment | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [activeSlipAppointment, setActiveSlipAppointment] = useState<Appointment | null>(null);

  // Filter appointments for selected date
  const dateAppointments = appointments.filter((apt) => apt.date === selectedDate);

  // Filtered list based on search and filters
  const filteredAppointments = dateAppointments.filter((apt) => {
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    if (shiftFilter !== 'all' && apt.shift !== shiftFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.patientName.toLowerCase().includes(q);
      const matchPhone = apt.patientPhone.toLowerCase().includes(q);
      const matchService = apt.service.toLowerCase().includes(q);
      const matchRef = apt.referenceCode.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchService && !matchRef) return false;
    }
    return true;
  });

  // Calculate Daily Visit Summary metrics
  const totalVisits = dateAppointments.length;
  const inChairApt = dateAppointments.find((a) => a.status === 'In-Chair');
  const upcomingCount = dateAppointments.filter((a) => a.status === 'Upcoming').length;
  const completedCount = dateAppointments.filter((a) => a.status === 'Completed').length;
  const morningCount = dateAppointments.filter((a) => a.shift === 'morning').length;
  const eveningCount = dateAppointments.filter((a) => a.shift === 'evening').length;
  const notesRecordedCount = dateAppointments.filter((a) => Boolean(a.clinicalNotes)).length;

  // Next upcoming patient
  const nextPatient = dateAppointments.find((a) => a.status === 'Upcoming');

  const handleNextDate = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handlePrevDate = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleQuickStatusChange = (id: string, newStatus: AppointmentStatus) => {
    updateAppointmentStatus(id, newStatus);
  };

  // Format date display
  const isToday = selectedDate === todayStr;
  const dateDisplay = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Bar & Direct Schedule Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold shadow-xs">
            <Stethoscope className="w-6 h-6 text-teal-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                {currentUser?.name || CLINIC_INFO.doctorName}
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Clinic Live
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser?.title || CLINIC_INFO.doctorDegree} · Central Dental Clinic & Hospital Kalyan
            </p>
          </div>
        </div>

        {/* Action Controls for Dentist */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsWalkInModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Walk-In Patient</span>
          </button>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-teal-200" />
            <span>Manage Clinic Schedule</span>
          </button>
        </div>
      </div>

      {/* Date Navigator Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDate}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-900 text-base sm:text-lg">
              {dateDisplay}
            </span>
            {isToday && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                TODAY
              </span>
            )}
          </div>

          <button
            onClick={handleNextDate}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="text-xs text-teal-700 font-semibold hover:underline ml-2 cursor-pointer"
            >
              Jump to Today
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
            <span>Date Picker:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-medium bg-white text-slate-800"
          />
        </div>
      </div>

      {/* SUMMARY KPI CARDS OF UPCOMING DAILY VISITS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Metric 1: Total Visits Today */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Visits
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-1">
            {totalVisits}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
            <span>{morningCount} Morning</span>
            <span>·</span>
            <span>{eveningCount} Evening</span>
          </div>
        </div>

        {/* Metric 2: Next Up Patient */}
        <div className="bg-teal-50/80 rounded-xl border border-teal-200 p-4 shadow-xs col-span-2 lg:col-span-1">
          <div className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>Next In Line</span>
          </div>
          {nextPatient ? (
            <div className="mt-1">
              <div className="text-base font-bold text-slate-900 truncate">
                {nextPatient.patientName}
              </div>
              <div className="text-xs font-semibold text-teal-700">
                {nextPatient.timeSlot} · {nextPatient.service.split('&')[0]}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 mt-2">No upcoming patient in queue</div>
          )}
        </div>

        {/* Metric 3: Active in Chair */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>In-Chair (Active)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-700 mt-1">
            {inChairApt ? 1 : 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">
            {inChairApt ? inChairApt.patientName : 'Dental chair available'}
          </div>
        </div>

        {/* Metric 4: Completed */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Completed
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-700 mt-1">
            {completedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalVisits > 0 ? `${Math.round((completedCount / totalVisits) * 100)}% of daily load` : '0%'}
          </div>
        </div>

        {/* Metric 5: Clinical Notes Documented */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Clinical Notes
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-teal-800 mt-1">
            {notesRecordedCount} <span className="text-xs font-normal text-slate-400">/ {totalVisits}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Charted with diagnoses & Rx
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('queue')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'queue'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Today's Patient Queue ({totalVisits})</span>
        </button>

        <button
          onClick={() => setActiveTab('clinical-records')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'clinical-records'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Clinical Notes & Chart Archive ({appointments.filter(a => a.clinicalNotes).length})</span>
        </button>
      </div>

      {/* TAB 1: DAILY VISITS QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient, phone, reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Shift Filter */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
                <button
                  onClick={() => setShiftFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                    shiftFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All Shifts
                </button>
                <button
                  onClick={() => setShiftFilter('morning')}
                  className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                    shiftFilter === 'morning' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Morning (10-2)
                </button>
                <button
                  onClick={() => setShiftFilter('evening')}
                  className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                    shiftFilter === 'evening' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Evening (6-10)
                </button>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="In-Chair">In-Chair (Active)</option>
                <option value="Completed">Completed</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Appointments Queue List */}
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-base">
                No Appointments for {dateDisplay}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                There are no scheduled patient visits matching the selected date and filters. You can register walk-ins or adjust schedule timings.
              </p>
              <button
                onClick={() => setIsWalkInModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Walk-In Patient</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((apt) => {
                const hasNotes = Boolean(apt.clinicalNotes);

                return (
                  <div
                    key={apt.id}
                    className={`bg-white rounded-xl border p-4 sm:p-5 transition-all shadow-xs ${
                      apt.status === 'In-Chair'
                        ? 'border-amber-300 ring-2 ring-amber-100'
                        : apt.status === 'Completed'
                        ? 'border-slate-200 opacity-90'
                        : 'border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Time & Patient Information */}
                      <div className="flex items-start gap-4">
                        {/* Time Slot Badge */}
                        <div className="text-center shrink-0 w-24 p-2 rounded-lg bg-slate-100 border border-slate-200">
                          <div className="text-xs font-bold text-slate-900 font-mono">
                            {apt.timeSlot}
                          </div>
                          <div className="text-[10px] uppercase font-semibold text-slate-500 mt-0.5">
                            {apt.shift === 'morning' ? 'Morning' : 'Evening'}
                          </div>
                          {apt.isWalkIn && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded mt-1 block">
                              WALK-IN
                            </span>
                          )}
                        </div>

                        {/* Patient Core Details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 text-base font-serif">
                              {apt.patientName}
                            </h4>
                            {apt.patientAge && (
                              <span className="text-xs text-slate-500">({apt.patientAge} yrs)</span>
                            )}
                            <span className="text-[11px] font-mono text-slate-400">
                              #{apt.referenceCode}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                            <a
                              href={`tel:${apt.patientPhone}`}
                              className="flex items-center gap-1 hover:text-teal-700 font-medium"
                            >
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{apt.patientPhone}</span>
                            </a>
                            <span>·</span>
                            <span className="font-semibold text-teal-800">{apt.service}</span>
                          </div>

                          {apt.symptoms && (
                            <div className="text-xs text-slate-600 italic bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 max-w-xl">
                              "Symptoms: {apt.symptoms}"
                            </div>
                          )}

                          {/* Clinical Notes Summary Snippet if charted */}
                          {hasNotes && (
                            <div className="text-xs text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 px-2.5 py-1 rounded-md flex items-center gap-2 mt-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>
                                <strong>Diagnosis:</strong> {apt.clinicalNotes?.diagnosis} ·{' '}
                                {apt.clinicalNotes?.prescriptions?.length || 0} Rx items prescribed
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Status and Clinical Actions */}
                      <div className="flex flex-wrap items-center gap-2.5 lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0">
                        {/* Status Dropdown */}
                        <select
                          value={apt.status}
                          onChange={(e) =>
                            handleQuickStatusChange(apt.id, e.target.value as AppointmentStatus)
                          }
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer ${
                            apt.status === 'In-Chair'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : apt.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : apt.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-900 border-rose-300'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="Upcoming">Upcoming</option>
                          <option value="In-Chair">In-Chair (Active)</option>
                          <option value="Completed">Completed</option>
                          <option value="Rescheduled">Rescheduled</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        {/* Open Clinical Notes Modal */}
                        <button
                          onClick={() => setActiveNotesAppointment(apt)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            hasNotes
                              ? 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                              : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{hasNotes ? 'Edit Clinical Notes' : 'Add Clinical Notes & Rx'}</span>
                        </button>

                        {/* Print / View Slip */}
                        <button
                          onClick={() => setActiveSlipAppointment(apt)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                          title="Print Patient Visit Slip / Rx"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* WhatsApp reminder trigger */}
                        <a
                          href={`https://wa.me/${apt.patientPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(apt.patientName)},%20this%20is%20Dr.%20Mahesh%20Deokar's%20Central%20Dental%20Clinic%20Kalyan.%20Your%20appointment%20is%20scheduled%20for%20${apt.date}%20at%20${encodeURIComponent(apt.timeSlot)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg border border-emerald-200 hover:bg-emerald-50"
                          title="WhatsApp patient"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLINICAL NOTES & PATIENT RECORDS ARCHIVE */}
      {activeTab === 'clinical-records' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-serif font-bold text-slate-900 text-base">
              Patient Clinical History & Treatment Charts
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive diagnostic records, rotary canal notes, implant torque notes, and prescriptions logged across all visits.
            </p>
          </div>

          <div className="space-y-4">
            {appointments
              .filter((a) => Boolean(a.clinicalNotes))
              .map((apt) => {
                const notes = apt.clinicalNotes!;
                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-teal-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold font-serif text-slate-900 text-base">
                            {apt.patientName}
                          </h4>
                          <span className="text-xs font-mono text-slate-400">
                            #{apt.referenceCode}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {apt.date} ({apt.timeSlot})
                          </span>
                        </div>
                        <div className="text-xs text-teal-800 font-medium mt-0.5">
                          Treatment: {apt.service}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveNotesAppointment(apt)}
                          className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold cursor-pointer"
                        >
                          Edit Chart
                        </button>
                        <button
                          onClick={() => setActiveSlipAppointment(apt)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Rx Slip</span>
                        </button>
                      </div>
                    </div>

                    {/* Chart Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                          Diagnosis:
                        </span>
                        <p className="text-slate-900 font-semibold mt-0.5 bg-slate-50 p-2 rounded border border-slate-200">
                          {notes.diagnosis || 'None entered'}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                          Chief Complaint:
                        </span>
                        <p className="text-slate-700 mt-0.5 bg-slate-50 p-2 rounded border border-slate-200">
                          {notes.chiefComplaint || 'None'}
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                          Treatment Procedure Performed:
                        </span>
                        <p className="text-slate-800 mt-0.5 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
                          {notes.treatmentDone}
                        </p>
                      </div>

                      {/* Prescribed Medications */}
                      {notes.prescriptions && notes.prescriptions.length > 0 && (
                        <div className="md:col-span-2">
                          <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px] mb-1">
                            Prescriptions (Rx):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {notes.prescriptions.map((p, i) => (
                              <span
                                key={p.id || i}
                                className="px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium"
                              >
                                <strong>{p.medicine}</strong> ({p.dosage} · {p.frequency} · {p.duration})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {notes.nextFollowUpDate && (
                        <div>
                          <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                            Next Follow-Up Recommended:
                          </span>
                          <span className="text-teal-800 font-bold">{notes.nextFollowUpDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Clinical Notes Editor Modal */}
      {activeNotesAppointment && (
        <ClinicalNotesModal
          appointment={activeNotesAppointment}
          isOpen={Boolean(activeNotesAppointment)}
          onClose={() => setActiveNotesAppointment(null)}
          onSave={(notes) => saveClinicalNotes(activeNotesAppointment.id, notes)}
          onPrintSlip={(apt) => {
            setActiveNotesAppointment(null);
            setActiveSlipAppointment(apt);
          }}
          doctorName={currentUser?.name || CLINIC_INFO.doctorName}
        />
      )}

      {/* Direct Schedule Management Modal */}
      <ScheduleManagerModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {/* Walk-in Modal */}
      <WalkInModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        defaultDate={selectedDate}
      />

      {/* Printable Visit Slip Modal */}
      <VisitSlipModal
        appointment={activeSlipAppointment}
        isOpen={Boolean(activeSlipAppointment)}
        onClose={() => setActiveSlipAppointment(null)}
      />
    </div>
  );
};

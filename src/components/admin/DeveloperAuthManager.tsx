import React, { useState } from 'react';
import {
  KeyRound,
  UserPlus,
  ShieldCheck,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  Stethoscope,
  RefreshCw,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { DoctorCredential } from '../../types/clinic';

interface DeveloperAuthManagerProps {
  onSwitchToDoctorView: (doctorId?: string) => void;
}

export const DeveloperAuthManager: React.FC<DeveloperAuthManagerProps> = ({
  onSwitchToDoctorView,
}) => {
  const {
    doctors,
    addDoctorCredential,
    updateDoctorCredential,
    deleteDoctorCredential,
  } = useClinic();

  // Form state to add new login
  const [doctorName, setDoctorName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('Chief Dental Surgeon (B.D.S.)');
  const [role, setRole] = useState<'dentist' | 'specialist'>('dentist');
  const [shiftAssignment, setShiftAssignment] = useState<'both' | 'morning' | 'evening'>('both');
  const [contactPhone, setContactPhone] = useState('+91 96647 89347');

  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editPasswordValue, setEditPasswordValue] = useState<string>('');

  const toggleRevealPassword = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !email.trim() || !password.trim()) {
      setStatusMessage('Please fill in doctor name, email, and password.');
      return;
    }

    addDoctorCredential({
      doctorName: doctorName.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role,
      title: title.trim(),
      contactPhone: contactPhone.trim(),
      shiftAssignment,
      isActive: true,
    });

    setDoctorName('');
    setEmail('');
    setPassword('');
    setStatusMessage('New doctor login credential provisioned successfully!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleUpdatePassword = (id: string) => {
    if (!editPasswordValue.trim()) return;
    updateDoctorCredential(id, { password: editPasswordValue.trim() });
    setEditingDocId(null);
    setEditPasswordValue('');
    setStatusMessage('Doctor password updated successfully!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleToggleActive = (doc: DoctorCredential) => {
    updateDoctorCredential(doc.id, { isActive: !doc.isActive });
  };

  return (
    <div className="space-y-8">
      {/* Notice Banner explaining the developer's restricted role */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-teal-950 text-teal-300 text-xs font-semibold border border-teal-800">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Agency Developer Credential Authority</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif">
              Doctor Login Provisioning & Access Control
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              As the web developer, you hold exclusive rights to generate, update, or revoke login credentials for your dental client. When Dr. Mahesh Deokar logs in using these credentials, he is strictly restricted to managing appointments, clinic schedules, and recording clinical notes.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onSwitchToDoctorView(doctors[0]?.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <span>View Client (Dentist) Experience</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Grid: Form to Add New Login + Current Active Logins */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form to Add Login Details */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif">
                Add New Doctor Login Credentials
              </h3>
              <p className="text-[11px] text-slate-500">
                Create login details for your client or associate dental staff.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateCredential} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Doctor Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Mahesh S. Deokar"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Doctor Login Email *
              </label>
              <input
                type="email"
                required
                placeholder="doctor@centraldental.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Set Account Password *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CentralDental2026!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Clinical Title / Qualifications
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="B.D.S., Implantologist"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Doctor Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'dentist' | 'specialist')}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                >
                  <option value="dentist">Lead Dentist</option>
                  <option value="specialist">Consultant Specialist</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Shift Duty
                </label>
                <select
                  value={shiftAssignment}
                  onChange={(e) => setShiftAssignment(e.target.value as 'both' | 'morning' | 'evening')}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                >
                  <option value="both">Both Shifts (10-2 & 6-10)</option>
                  <option value="morning">Morning Shift</option>
                  <option value="evening">Evening Shift</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Doctor Phone Number
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 96647 89347"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <KeyRound className="w-4 h-4" />
                <span>Save & Provision Doctor Credential</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Existing Doctor Credentials */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-serif">
              Active Client / Doctor Login Accounts ({doctors.length})
            </h3>
            <span className="text-xs text-slate-500">
              Your client logs in with any of these profiles
            </span>
          </div>

          <div className="space-y-4">
            {doctors.map((doc) => {
              const isRevealed = revealedPasswords[doc.id];
              const isEditing = editingDocId === doc.id;

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 text-teal-800 flex items-center justify-center font-bold text-base">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base font-serif">
                            {doc.doctorName}
                          </h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                              doc.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {doc.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">{doc.title}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSwitchToDoctorView(doc.id)}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors cursor-pointer"
                        title="Simulate login as this doctor"
                      >
                        Launch as Doctor
                      </button>
                      <button
                        onClick={() => handleToggleActive(doc)}
                        className={`text-xs px-2.5 py-1.5 rounded-md border font-medium cursor-pointer ${
                          doc.isActive
                            ? 'text-amber-700 border-amber-200 hover:bg-amber-50'
                            : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {doc.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>

                  {/* Credentials Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Email / Login Username:</span>
                      <strong className="text-slate-900 font-mono text-xs">{doc.email}</strong>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Password:</span>
                        <button
                          type="button"
                          onClick={() => toggleRevealPassword(doc.id)}
                          className="text-[11px] text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{isRevealed ? 'Hide' : 'Reveal'}</span>
                        </button>
                      </div>
                      <div className="font-mono text-xs text-slate-800 font-semibold mt-0.5">
                        {isRevealed ? doc.password : '••••••••••••'}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Shift Assignment:</span>
                      <span className="capitalize font-medium text-slate-800">
                        {doc.shiftAssignment === 'both' ? 'Morning & Evening Shifts' : `${doc.shiftAssignment} shift`}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Last Clinic Login:</span>
                      <span className="text-slate-700 font-medium">
                        {doc.lastLogin ? new Date(doc.lastLogin).toLocaleString() : 'Never logged in yet'}
                      </span>
                    </div>
                  </div>

                  {/* Password Quick Reset Drawer */}
                  {isEditing ? (
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter new password"
                        value={editPasswordValue}
                        onChange={(e) => setEditPasswordValue(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono flex-1 text-slate-900"
                      />
                      <button
                        onClick={() => handleUpdatePassword(doc.id)}
                        className="px-3 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-medium cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingDocId(null)}
                        className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() => {
                          setEditingDocId(doc.id);
                          setEditPasswordValue(doc.password);
                        }}
                        className="text-teal-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Change Password</span>
                      </button>

                      {doctors.length > 1 && (
                        <button
                          onClick={() => deleteDoctorCredential(doc.id)}
                          className="text-rose-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete Login</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Stethoscope,
  LogOut,
  X,
  ArrowLeft,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { DeveloperAuthManager } from './DeveloperAuthManager';
import { DentistDashboard } from './DentistDashboard';
import { CLINIC_INFO } from '../../data/clinicData';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    loginAsDeveloper,
    loginAsDoctor,
    logout,
    quickLoginAsDoctor,
    quickLoginAsDeveloper,
    doctors,
  } = useClinic();

  // Login Form States
  const [loginMode, setLoginMode] = useState<'dentist' | 'developer'>('dentist');
  const [docEmail, setDocEmail] = useState('doctor@centraldental.com');
  const [docPassword, setDocPassword] = useState('CentralDental2026!');
  const [devPassword, setDevPassword] = useState('MasterDev2026!');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginAsDoctor(docEmail, docPassword);
    if (!res.success) {
      setErrorMessage(res.message || 'Invalid credentials.');
    }
  };

  const handleDeveloperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const ok = loginAsDeveloper(devPassword);
    if (!ok) {
      setErrorMessage('Incorrect developer master key. Use "MasterDev2026!"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-between overflow-y-auto">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Clinic Website</span>
          </button>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base font-serif">
              Central Dental Clinic Kalyan
            </span>
            <span className="text-xs text-teal-400 font-mono hidden md:inline">
              [Authorized Portal]
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-slate-400">Signed in as:</span>
              <span className="font-semibold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700 flex items-center gap-1.5">
                {currentUser.role === 'developer' ? (
                  <>
                    <KeyRound className="w-3 h-3 text-teal-400" />
                    <span>Agency Webmaster</span>
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-3 h-3 text-emerald-400" />
                    <span>{currentUser.name}</span>
                  </>
                )}
              </span>

              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Container Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!currentUser ? (
          /* AUTHENTICATION SCREEN */
          <div className="max-w-md mx-auto my-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white flex items-center justify-center mx-auto shadow-md">
                <Shield className="w-7 h-7 text-teal-200" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-white">
                Clinic & Staff Administration
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Separated access control for the web developer and clinic dentist.
              </p>
            </div>

            {/* Role Tab Selector */}
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('dentist');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  loginMode === 'dentist'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Dentist (Client) Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('developer');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  loginMode === 'developer'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Developer Credential Admin</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Dentist Login Form */}
            {loginMode === 'dentist' && (
              <form
                onSubmit={handleDoctorSubmit}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl"
              >
                <div className="border-b border-slate-800 pb-3">
                  <div className="text-sm font-bold text-white">Dentist Portal Login</div>
                  <div className="text-xs text-slate-400">
                    Your client only sees appointments, daily visit summaries, and manages clinic schedules.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Doctor Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={docEmail}
                      onChange={(e) => setDocEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={docPassword}
                      onChange={(e) => setDocPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-md"
                >
                  Sign In as Dentist
                </button>

                {/* Instant Quick Demo Switcher */}
                <div className="pt-2 border-t border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => quickLoginAsDoctor()}
                    className="text-xs text-teal-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Quick Demo: Sign in as Dr. Mahesh Deokar</span>
                  </button>
                </div>
              </form>
            )}

            {/* Developer Login Form */}
            {loginMode === 'developer' && (
              <form
                onSubmit={handleDeveloperSubmit}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl"
              >
                <div className="border-b border-slate-800 pb-3">
                  <div className="text-sm font-bold text-white">Developer / Webmaster Access</div>
                  <div className="text-xs text-slate-400">
                    Use your developer master pass to provision and manage doctor login credentials.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Developer Master Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={devPassword}
                      onChange={(e) => setDevPassword(e.target.value)}
                      placeholder="MasterDev2026!"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-teal-500 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-md"
                >
                  Enter Developer Credential Panel
                </button>

                {/* Instant Quick Demo Switcher */}
                <div className="pt-2 border-t border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={quickLoginAsDeveloper}
                    className="text-xs text-teal-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Quick Demo: Sign in as Developer</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : currentUser.role === 'developer' ? (
          /* DEVELOPER VIEW: ONLY ADDS AND MANAGES LOGIN DETAILS */
          <div className="space-y-6">
            <DeveloperAuthManager
              onSwitchToDoctorView={(docId) => quickLoginAsDoctor(docId)}
            />
          </div>
        ) : (
          /* CLIENT (DENTIST) VIEW: ONLY SEES APPOINTMENTS & MANAGES CLINIC SCHEDULE DIRECTLY */
          <div className="space-y-6">
            <DentistDashboard />
          </div>
        )}
      </div>

      {/* Portal Footer Notice */}
      <div className="bg-slate-900 border-t border-slate-800 text-slate-500 text-xs px-4 py-3 text-center shrink-0">
        Central Dental Clinic Kalyan Management Portal · Dedicated System for Dr. Mahesh S. Deokar
      </div>
    </div>
  );
};

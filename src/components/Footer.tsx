import React from 'react';
import { Stethoscope, Phone, Mail, MapPin, Shield, Calendar, Heart } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onNavigateSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenAdmin,
  onNavigateSection,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs sm:text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-teal-200" />
              </div>
              <div>
                <div className="font-bold font-serif text-white text-base">
                  {CLINIC_INFO.name}
                </div>
                <div className="text-xs text-teal-400 font-medium">
                  {CLINIC_INFO.tagline}
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Dedicated center for dental implants, digital OPG panoramic imaging, single-sitting painless root canals, and cosmetic smile designs under {CLINIC_INFO.doctorName}. Serving Kalyan and Thane district since 2009.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div><strong className="text-slate-300">Reg Address:</strong> Shop No. 3, Padmalaya Tower, Karnik Road, Kalyan (W) - 421301</div>
              <div><strong className="text-slate-300">Emergency Phone:</strong> {CLINIC_INFO.phone1}</div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Clinical Specialities
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateSection('treatments')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Dental Implants & Basal Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('opg-tech')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  In-House Digital OPG Full Mouth Scan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('treatments')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Single-Sitting Rotary Root Canal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('treatments')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  CAD/CAM Zirconia Crowns & Bridges
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('treatments')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Orthodontics & Clear Aligners
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('gallery')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Class-B Autoclave Sterilization Suite
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours & Portal */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Consultation Shifts
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Morning Shift:</span>
                <span className="font-semibold text-white">{CLINIC_INFO.timings.morning}</span>
              </div>
              <div className="flex justify-between">
                <span>Evening Shift:</span>
                <span className="font-semibold text-white">{CLINIC_INFO.timings.evening}</span>
              </div>
              <div className="flex justify-between text-teal-400 pt-1 border-t border-slate-700">
                <span>Open Days:</span>
                <span>Mon to Sat (Sun by Appt)</span>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap gap-2">
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={onOpenAdmin}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span>Doctor / Admin Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Developer Admin Badge */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Central Dental Clinic & Hospital Kalyan. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Karnik Road, Kalyan West, Maharashtra</span>
            <span>·</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-teal-300 transition-colors cursor-pointer"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

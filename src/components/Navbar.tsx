import React, { useState } from 'react';
import { Phone, Clock, MapPin, Calendar, Shield, User, Menu, X, Stethoscope, ChevronRight } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onNavigateSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenAdmin,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useClinic();

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Utility Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Karnik Road, Near Holy Cross School, Kalyan (W)</span>
            </div>
            <span className="hidden md:inline text-slate-600">|</span>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>10:00 AM – 2:00 PM & 6:00 PM – 10:00 PM (Mon–Sat)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <a
              href={`tel:${CLINIC_INFO.phone1}`}
              className="flex items-center gap-1.5 text-teal-300 hover:text-teal-200 font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Clinic: {CLINIC_INFO.phone1}</span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Doctor & Credential Management Portal"
            >
              {currentUser ? (
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <User className="w-3 h-3" />
                  {currentUser.role === 'dentist' ? currentUser.name : 'Webmaster Panel'}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-slate-400" />
                  <span>Doctor Portal</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-center shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform">
              <div className="relative">
                <Stethoscope className="w-6 h-6 text-teal-200" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-teal-900"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight font-serif group-hover:text-teal-800 transition-colors">
                  Central Dental Clinic & Hospital
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium tracking-wide">
                <span className="text-teal-700 font-semibold">Dental Implants & OPG Centre</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="hidden sm:inline">Kalyan (W)</span>
                <span aria-hidden="true" className="hidden sm:inline text-slate-300">·</span>
                <span className="hidden md:inline text-slate-600">Est. 2009</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('treatments')}
              className="hover:text-teal-700 transition-colors cursor-pointer py-1"
            >
              Treatments & Implants
            </button>
            <button
              onClick={() => handleNavClick('opg-tech')}
              className="hover:text-teal-700 transition-colors cursor-pointer py-1 flex items-center gap-1.5"
            >
              Digital OPG
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
            </button>
            <button
              onClick={() => handleNavClick('gallery')}
              className="hover:text-teal-700 transition-colors cursor-pointer py-1"
            >
              Clinic Gallery
            </button>
            <button
              onClick={() => handleNavClick('doctor')}
              className="hover:text-teal-700 transition-colors cursor-pointer py-1"
            >
              Dr. Mahesh Deokar
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="hover:text-teal-700 transition-colors cursor-pointer py-1"
            >
              Patient Reviews
            </button>
            <button
              onClick={() => handleNavClick('location')}
              className="hover:text-teal-700 transition-colors cursor-pointer py-1"
            >
              Contact & Hours
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-medium text-sm shadow-sm transition-all hover:shadow-md cursor-pointer group"
            >
              <Calendar className="w-4 h-4 text-teal-200 group-hover:scale-110 transition-transform" />
              <span>Book Appointment</span>
            </button>

            {currentUser ? (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium cursor-pointer border border-slate-200"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{currentUser.role === 'dentist' ? 'Doctor Portal' : 'Webmaster'}</span>
              </button>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="p-2 rounded-lg bg-teal-700 text-white text-xs font-medium"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('treatments')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-teal-50 hover:text-teal-800 flex items-center justify-between"
            >
              <span>Treatments & Implants</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('opg-tech')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-teal-50 hover:text-teal-800 flex items-center justify-between"
            >
              <span>In-House Digital OPG Suite</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('gallery')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-teal-50 hover:text-teal-800 flex items-center justify-between"
            >
              <span>Clinic Office & Gallery</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('doctor')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-teal-50 hover:text-teal-800 flex items-center justify-between"
            >
              <span>About Dr. Mahesh S. Deokar</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-teal-50 hover:text-teal-800 flex items-center justify-between"
            >
              <span>Patient Testimonials</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('location')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-teal-50 hover:text-teal-800 flex items-center justify-between"
            >
              <span>Location, Directions & Timings</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-lg bg-teal-700 text-white font-medium text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Online</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-center flex items-center justify-center gap-2 text-sm"
            >
              <Shield className="w-4 h-4 text-slate-500" />
              <span>Doctor / Staff Portal Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

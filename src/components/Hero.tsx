import React from 'react';
import { Calendar, ShieldCheck, Star, Award, Clock, ArrowRight, MessageSquare, ScanLine } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface HeroProps {
  onOpenBooking: () => void;
  onViewGallery: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onViewGallery }) => {
  return (
    <section id="hero" className="relative bg-gradient-to-b from-slate-100 via-slate-50 to-white pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-slate-200">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Clinic Hero Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Status and Accreditation Header */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200/80 rounded-md text-teal-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                <span>Open in Kalyan West · Padmalaya Tower</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span className="font-semibold text-slate-700">4.9</span>
                <span>(380+ Google Reviews)</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-serif leading-[1.18]">
                Advanced Dental Implants & <span className="text-teal-700 underline decoration-teal-300 decoration-wavy decoration-1 underline-offset-6">Digital OPG Centre</span> in Kalyan
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Led by <strong className="text-slate-800 font-semibold">{CLINIC_INFO.doctorName}</strong> with 16+ years of surgical expertise. Specializing in immediate dental implants, single-sitting painless root canals, and in-house digital panoramic X-rays.
              </p>
            </div>

            {/* Quick Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700 pt-1">
              <div className="flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-teal-600 shrink-0" />
                <span>In-House Digital OPG (Full Mouth Scan)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Basal & Conventional Dental Implants</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Rotary Endodontics (Painless 1-Visit RCT)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Open till 10:00 PM for Working Patients</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-medium text-sm sm:text-base shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <Calendar className="w-5 h-5 text-teal-200 group-hover:scale-110 transition-transform" />
                <span>Book Doctor Appointment</span>
                <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onViewGallery}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm sm:text-base border border-slate-300 shadow-xs transition-colors cursor-pointer"
              >
                <span>View Clinic Office & OPG</span>
              </button>

              <a
                href={`https://wa.me/${CLINIC_INFO.whatsapp}?text=Hello%20Central%20Dental%20Clinic,%20I%20would%20like%20to%20inquire%20about%20an%20appointment`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium text-sm border border-emerald-200 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Clinic Operational Shift Info */}
            <div className="p-3.5 bg-slate-100/90 rounded-lg border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-slate-800">Clinic Timings Today:</span> Morning 10:00 AM – 2:00 PM & Evening 6:00 PM – 10:00 PM
              </div>
              <div className="text-teal-700 font-medium shrink-0">
                Karnik Road, Kalyan (W)
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composite & Verified Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Clinic Operatory Photo Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80"
                  alt="Central Dental Clinic Operatory Kalyan"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                {/* Overlaid Information */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                    Central Dental Clinic & Hospital
                  </div>
                  <div className="text-base sm:text-lg font-bold font-serif leading-snug">
                    State-of-the-Art Implant & Diagnostic Facility
                  </div>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                    Shop No. 3, Padmalaya Tower, Karnik Road, Kalyan West
                  </p>
                </div>
              </div>

              {/* Floating Floating Stat Badge 1: Experience */}
              <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 bg-white rounded-xl shadow-lg border border-slate-200/80 p-3 sm:p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                  16+
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Years of Care</div>
                  <div className="text-[11px] text-slate-500">Established 2009</div>
                </div>
              </div>

              {/* Floating Stat Badge 2: In-House OPG Suite */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 bg-white rounded-xl shadow-lg border border-slate-200/80 p-3 sm:p-4 flex items-center gap-3 max-w-xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Digital OPG Centre</div>
                  <div className="text-[11px] text-slate-500">Immediate panoramic x-rays</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

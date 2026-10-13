import React from 'react';
import { Award, GraduationCap, Clock, CheckCircle, Calendar, Phone, ShieldCheck } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface DoctorProfileProps {
  onOpenBooking: () => void;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({ onOpenBooking }) => {
  return (
    <section id="doctor" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Doctor Portrait / Photo Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80"
                  alt="Dr. Mahesh S. Deokar"
                  className="w-full h-96 sm:h-[460px] object-cover object-top group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-xl sm:text-2xl font-bold font-serif">{CLINIC_INFO.doctorName}</div>
                  <div className="text-teal-300 text-xs sm:text-sm font-medium mt-0.5">
                    {CLINIC_INFO.doctorDegree}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-2">
                    <span>Chief Dental Surgeon</span>
                    <span>·</span>
                    <span>Practicing in Kalyan since 2009</span>
                  </div>
                </div>
              </div>

              {/* Verified Clinical Credentials Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-slate-200 p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">B.D.S. & Implantology</div>
                  <div className="text-[11px] text-slate-500">16+ Years Clinical Excellence</div>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Biography & Clinical Approach */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-2">
                Lead Practitioner & Chief Implantologist
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-slate-900 tracking-tight">
                Meet Dr. Mahesh S. Deokar
              </h2>
              <p className="text-sm font-medium text-slate-600 mt-1">
                Founder of Central Dental Clinic & Hospital Kalyan (Est. 2009)
              </p>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Dr. Mahesh S. Deokar has been a trusted pioneer in dental implantology and restorative dentistry for over 16 years across Kalyan and Thane district. Known for his calm, communicative bedside manner and precision surgical techniques, Dr. Deokar ensures every patient experiences pain-free, comfortable, and long-lasting dental outcomes.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Under his leadership, Central Dental Clinic was equipped with Kalyan's dedicated in-house digital OPG imaging machine and computer-assisted implant guides, allowing complex tooth replacements and single-sitting root canals to be performed reliably in one convenient setting.
            </p>

            {/* Specialties Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Conventional & Basal Dental Implants</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Single-Visit Rotary Root Canal Therapy</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Digital OPG Panoramic Radiography</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Trauma-Free Wisdom Tooth Extractions</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>CAD/CAM Zirconia Aesthetic Crowns</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Full Mouth Rehabilitation & Bite Reconstruction</span>
              </div>
            </div>

            {/* Timings & Booking Callout */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation with Dr. Mahesh</span>
              </button>

              <a
                href={`tel:${CLINIC_INFO.phone1}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-500" />
                <span>Call {CLINIC_INFO.phone1}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

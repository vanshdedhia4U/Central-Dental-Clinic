import React from 'react';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';
import { TESTIMONIALS, CLINIC_INFO } from '../data/clinicData';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-2">
              Verified Patient Experiences
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-slate-900 tracking-tight">
              What Our Kalyan Patients Say
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Real feedback from local residents who received dental implants, painless root canals, OPG scans, and smile makeovers at our clinic.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4 self-start md:self-auto">
            <div className="w-12 h-12 rounded-lg bg-teal-50 border border-teal-100 text-teal-800 flex flex-col items-center justify-center font-bold">
              <span className="text-base leading-none">4.9</span>
              <span className="text-[10px] text-teal-600">/ 5.0</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                ))}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Over <strong className="text-slate-900">380+ reviews</strong> on Google Maps
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span>{item.name}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {item.locality} · <span className="text-teal-700 font-medium">{item.service}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

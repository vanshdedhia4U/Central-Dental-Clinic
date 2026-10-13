import React, { useState } from 'react';
import {
  ShieldCheck,
  ScanLine,
  Activity,
  Sparkles,
  Smile,
  HeartPulse,
  Wand2,
  Baby,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { SERVICES } from '../data/clinicData';
import { ServiceItem } from '../types/clinic';

interface ServicesSectionProps {
  onSelectServiceToBook: (serviceTitle: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-teal-700" />,
  ScanLine: <ScanLine className="w-5 h-5 text-teal-700" />,
  Activity: <Activity className="w-5 h-5 text-teal-700" />,
  Sparkles: <Sparkles className="w-5 h-5 text-teal-700" />,
  Smile: <Smile className="w-5 h-5 text-teal-700" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-teal-700" />,
  Wand2: <Wand2 className="w-5 h-5 text-teal-700" />,
  Baby: <Baby className="w-5 h-5 text-teal-700" />,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceToBook }) => {
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);

  return (
    <section id="treatments" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-2">
            Comprehensive Dental Specialities
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-slate-900 tracking-tight">
            Specialized Care for Your Teeth, Gums & Smile
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From single-sitting rotary root canals to precision basal dental implants and in-house digital OPG full-mouth scans, all treatments are executed with hospital-grade sterilization in Kalyan West.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => {
            return (
              <div
                key={service.id}
                className="group flex flex-col justify-between bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all p-6 relative"
              >
                <div>
                  {/* Top Bar with Icon and Optional Badge */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {iconMap[service.iconName] || <Activity className="w-5 h-5 text-teal-700" />}
                    </div>
                    {service.badge && (
                      <span className="text-[11px] font-semibold text-teal-800 bg-teal-100/60 px-2.5 py-0.5 rounded-md">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Short Desc */}
                  <h3 className="text-lg font-bold font-serif text-slate-900 group-hover:text-teal-800 transition-colors mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {service.shortDesc}
                  </p>

                  {/* Key Benefits List */}
                  <div className="space-y-1.5 mb-5 pt-2 border-t border-slate-200/60">
                    {service.keyBenefits.slice(0, 3).map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{service.duration}</span>
                  </div>

                  <button
                    onClick={() => onSelectServiceToBook(service.title)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>Book Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

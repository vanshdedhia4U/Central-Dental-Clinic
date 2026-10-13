import React from 'react';
import { ScanLine, Check, Zap, Eye, ShieldCheck, ArrowRight } from 'lucide-react';

interface OPGFeatureProps {
  onBookOPG: () => void;
}

export const OPGFeatureSection: React.FC<OPGFeatureProps> = ({ onBookOPG }) => {
  return (
    <section id="opg-tech" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Technology Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-950/80 border border-teal-500/30 rounded-md text-teal-300 text-xs font-semibold">
              <ScanLine className="w-3.5 h-3.5 text-teal-400" />
              <span>Diagnostic Excellence Centre</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-white leading-tight">
              In-House Digital OPG Suite: Instant Full-Mouth Panoramic Radiography
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              No more taking trips to third-party imaging labs or waiting days for results. Our clinic features an in-house digital Orthopantomogram (OPG) unit, enabling Dr. Mahesh Deokar to visualize your full jaw, mandibular nerve canals, sinuses, and impacted teeth in under three minutes.
            </p>

            {/* Key Advantages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm mb-1">
                  <Zap className="w-4 h-4" />
                  <span>3-Minute Turnaround</span>
                </div>
                <p className="text-xs text-slate-300">
                  Instant digital display on dental operatory screens for real-time patient consultation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Ultra-Low Radiation</span>
                </div>
                <p className="text-xs text-slate-300">
                  Advanced CMOS digital sensors reduce radiation dosage by up to 80% compared to legacy film X-rays.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm mb-1">
                  <Eye className="w-4 h-4" />
                  <span>Precision Implant Planning</span>
                </div>
                <p className="text-xs text-slate-300">
                  Accurate assessment of vertical alveolar bone height, sinus cavity, and nerve canal margins.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm mb-1">
                  <Check className="w-4 h-4" />
                  <span>Impacted Wisdom Mapping</span>
                </div>
                <p className="text-xs text-slate-300">
                  Clear view of angulation and root morphology for trauma-free surgical extractions.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onBookOPG}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm transition-colors cursor-pointer shadow-md"
              >
                <span>Schedule OPG Scan / Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual OPG Display */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-3 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80"
                alt="In-House Digital OPG Unit"
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Digital Sensor: High-Definition Panoramic</span>
                  <span className="text-emerald-400 font-mono">STATUS: READY</span>
                </div>
                <div className="text-sm font-semibold text-white">
                  Central Dental Clinic In-House OPG & Digital Radiography Wing
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Dedicated lead-shielded diagnostic room at Shop No. 3, Padmalaya Tower, Karnik Road.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

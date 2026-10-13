import React from 'react';
import { MapPin, Phone, Clock, Mail, Navigation, ExternalLink, Calendar, MessageSquare } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface LocationHoursProps {
  onOpenBooking: () => void;
}

export const LocationHours: React.FC<LocationHoursProps> = ({ onOpenBooking }) => {
  return (
    <section id="location" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-2">
            Visit & Contact Us
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-slate-900 tracking-tight">
            Convenient Location in Kalyan West
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Situated on Karnik Road right near Holy Cross School in Padmalaya Tower. Open 6 days a week with convenient morning and late-evening shifts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Clinic Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinic Address</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    {CLINIC_INFO.name}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {CLINIC_INFO.address}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-teal-700 font-medium">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Landmark: Near Holy Cross School / Karnik Rd</span>
                  </div>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consultation Hours</div>
                  <div className="text-xs sm:text-sm text-slate-800 space-y-1 mt-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-slate-700">Morning Shift:</span>
                      <span className="font-semibold text-slate-900">{CLINIC_INFO.timings.morning}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-slate-700">Evening Shift:</span>
                      <span className="font-semibold text-slate-900">{CLINIC_INFO.timings.evening}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-slate-500 text-xs pt-1">
                      <span>Working Days:</span>
                      <span>Monday to Saturday</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-slate-500 text-xs">
                      <span>Sunday:</span>
                      <span>{CLINIC_INFO.timings.sunday}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Contacts */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Clinic Line</div>
                  <div className="mt-1 space-y-1">
                    <a
                      href={`tel:${CLINIC_INFO.phone1}`}
                      className="block text-sm font-bold text-teal-800 hover:text-teal-900"
                    >
                      {CLINIC_INFO.phone1}
                    </a>
                    <a
                      href={`tel:${CLINIC_INFO.phone2}`}
                      className="block text-xs font-medium text-slate-600 hover:text-slate-800"
                    >
                      {CLINIC_INFO.phone2} (Secondary line)
                    </a>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={CLINIC_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Navigation className="w-4 h-4 text-teal-400" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href={`https://wa.me/${CLINIC_INFO.whatsapp}?text=Hello%20Central%20Dental%20Clinic,%20I%20need%20assistance%20finding%20the%20location`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Map Display & Directions Guide */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              {/* Google Maps Visual Interactive Frame */}
              <div className="relative aspect-16/10 bg-slate-100">
                <iframe
                  title="Central Dental Clinic Kalyan Map"
                  src="https://maps.google.com/maps?q=Central%20Dental%20Clinic%20Hospital%20Kalyan%20Karnik%20Road&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                ></iframe>

                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-md text-xs font-medium text-slate-800 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-700" />
                  <span>Central Dental Clinic & Hospital Kalyan</span>
                </div>
              </div>

              {/* Transit Tips */}
              <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-bold text-slate-800 mb-1">From Kalyan Railway Station:</div>
                  <p className="text-slate-600 leading-relaxed">
                    Approximately 7 minutes by Auto-rickshaw or taxi. Ask for Holy Cross School or Karnik Road, Padmalaya Tower.
                  </p>
                </div>
                <div>
                  <div className="font-bold text-slate-800 mb-1">Parking & Accessibility:</div>
                  <p className="text-slate-600 leading-relaxed">
                    Ground floor access with accessible ramps, wheelchair-friendly entry, and street parking along Karnik Road.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

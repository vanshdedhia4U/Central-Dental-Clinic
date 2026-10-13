/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { OPGFeatureSection } from './components/OPGFeatureSection';
import { ClinicGallery } from './components/ClinicGallery';
import { DoctorProfile } from './components/DoctorProfile';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationHours } from './components/LocationHours';
import { Footer } from './components/Footer';
import { BookingSystem } from './components/BookingSystem';
import { AdminPortal } from './components/admin/AdminPortal';
import { Phone, Calendar, Shield, ScanLine, Clock, Award } from 'lucide-react';
import { CLINIC_INFO } from './data/clinicData';

function MainApp() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(undefined);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  const handleOpenBooking = (service?: string) => {
    setSelectedServiceForBooking(service);
    setIsBookingOpen(true);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-teal-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Public Website Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onViewGallery={() => handleNavigateSection('gallery')}
        />

        {/* Quick Highlights Strip */}
        <section className="bg-teal-900 text-white py-6 border-y border-teal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold font-serif text-teal-200">16+ Years</div>
                <div className="text-xs text-teal-300">Clinical Trust in Kalyan (Est. 2009)</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold font-serif text-teal-200">In-House OPG</div>
                <div className="text-xs text-teal-300">Instant Full Mouth Digital X-Rays</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold font-serif text-teal-200">3,200+</div>
                <div className="text-xs text-teal-300">Successful Implants & RCTs</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold font-serif text-teal-200">Till 10:00 PM</div>
                <div className="text-xs text-teal-300">Open Evening Shifts for Professionals</div>
              </div>
            </div>
          </div>
        </section>

        {/* Treatments & Services */}
        <ServicesSection
          onSelectServiceToBook={(serviceTitle) => handleOpenBooking(serviceTitle)}
        />

        {/* In-House Digital OPG Feature Showcase */}
        <OPGFeatureSection
          onBookOPG={() => handleOpenBooking('In-House Digital OPG Scan')}
        />

        {/* Office & Clinic Gallery */}
        <ClinicGallery
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Doctor Biography & Credentials */}
        <DoctorProfile
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Patient Reviews & Google Ratings */}
        <ReviewsSection />

        {/* Location, Directions & Contact Hours */}
        <LocationHours
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Floating Action Badge for Fast Patient Booking / Emergency Call */}
      <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2">
        <a
          href={`tel:${CLINIC_INFO.phone1}`}
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-lg border border-slate-200 transition-all hover:scale-105"
        >
          <Phone className="w-3.5 h-3.5 text-teal-700" />
          <span>{CLINIC_INFO.phone1}</span>
        </a>

        <button
          onClick={() => handleOpenBooking()}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-xl transition-all hover:scale-105 cursor-pointer ring-2 ring-white"
        >
          <Calendar className="w-4 h-4 text-teal-200" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Patient Booking Modal */}
      <BookingSystem
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedService={selectedServiceForBooking}
      />

      {/* Admin Portal (Developer Credential Management + Client Dentist Dashboard) */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ClinicProvider>
      <MainApp />
    </ClinicProvider>
  );
}

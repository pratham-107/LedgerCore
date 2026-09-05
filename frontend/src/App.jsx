import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InvoicesSection from './components/InvoicesSection';
import FinancesSection from './components/FinancesSection';
import PrivacySection from './components/PrivacySection';
import ToolkitSection from './components/ToolkitSection';
import CtaFooterSection from './components/CtaFooterSection';
import LiveAppModal from './components/LiveAppModal';

export default function App() {
  const [isAppOpen, setIsAppOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1a1a19] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Banner & Navigation */}
      <Navbar onOpenApp={() => setIsAppOpen(true)} />

      {/* Hero Section with Notion Mockup */}
      <main className="flex-1">
        <HeroSection onOpenApp={() => setIsAppOpen(true)} />
        <InvoicesSection />
        <FinancesSection />
        <PrivacySection />
        <ToolkitSection />
      </main>

      {/* Bottom CTA with Floating 3D Beans & Footer */}
      <CtaFooterSection onOpenApp={() => setIsAppOpen(true)} />

      {/* Interactive Live Financial Engine Modal */}
      <LiveAppModal isOpen={isAppOpen} onClose={() => setIsAppOpen(false)} />
    </div>
  );
}

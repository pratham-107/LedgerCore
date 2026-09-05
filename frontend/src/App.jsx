import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InvoicesSection from './components/InvoicesSection';
import FinancesSection from './components/FinancesSection';
import PrivacySection from './components/PrivacySection';
import ToolkitSection from './components/ToolkitSection';
import CtaFooterSection from './components/CtaFooterSection';
import LiveAppModal from './components/LiveAppModal';
import AuthModal from './components/AuthModal';

function AppContent() {
  const [isAppOpen, setIsAppOpen] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleOpenWorkspace = () => {
    // If not authenticated, open auth modal or allow direct dashboard
    setIsAppOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a19] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Banner & Navigation */}
      <Navbar onOpenApp={() => setIsAppOpen(true)} />

      {/* Hero Section with Notion Mockup */}
      <main className="flex-1">
        <HeroSection onOpenApp={handleOpenWorkspace} />
        <InvoicesSection />
        <FinancesSection />
        <PrivacySection />
        <ToolkitSection />
      </main>

      {/* Bottom CTA with Floating 3D Shapes & Footer */}
      <CtaFooterSection onOpenApp={handleOpenWorkspace} />

      {/* Interactive Live Financial Engine Modal */}
      <LiveAppModal isOpen={isAppOpen} onClose={() => setIsAppOpen(false)} />

      {/* Authentication Modal (Sign In & Sign Up) */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

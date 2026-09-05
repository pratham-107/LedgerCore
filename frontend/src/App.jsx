import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InvoicesSection from './components/InvoicesSection';
import FinancesSection from './components/FinancesSection';
import PrivacySection from './components/PrivacySection';
import ToolkitSection from './components/ToolkitSection';
import CtaFooterSection from './components/CtaFooterSection';
import DashboardView from './components/DashboardView';
import AuthModal from './components/AuthModal';

function MainApp() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleOpenDashboard = () => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      openAuthModal('login');
    }
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is inside the Dashboard view and is authenticated
  if (currentView === 'dashboard' && isAuthenticated) {
    return (
      <DashboardView onBackToHome={handleBackToLanding} />
    );
  }

  // Home / Landing Page (Purely readable presentation showcase)
  return (
    <div className="min-h-screen bg-white text-[#1a1a19] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Banner & Navigation */}
      <Navbar onOpenApp={handleOpenDashboard} />

      {/* Main Landing Sections */}
      <main className="flex-1">
        <HeroSection onOpenApp={handleOpenDashboard} />
        <InvoicesSection />
        <FinancesSection />
        <PrivacySection />
        <ToolkitSection />
      </main>

      {/* Bottom CTA & Footer */}
      <CtaFooterSection onOpenApp={handleOpenDashboard} />

      {/* Authentication Modal */}
      <AuthModal onAuthSuccess={() => setCurrentView('dashboard')} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

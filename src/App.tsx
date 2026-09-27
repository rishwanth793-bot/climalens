/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VerificationProvider, useVerification } from './context/VerificationContext';
import { DemoModeBanner } from './components/DemoModeBanner';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SourcePanelModal } from './components/SourcePanelModal';
import { AdjustValueModal } from './components/AdjustValueModal';
import { ContextualPDFModal } from './components/ContextualPDFModal';
import { GeminiRegulatoryAssistant } from './components/GeminiRegulatoryAssistant';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { UploadPage } from './pages/UploadPage';
import { RawDataPage } from './pages/RawDataPage';
import { CleanDataPage } from './pages/CleanDataPage';
import { HistoryPage } from './pages/HistoryPage';
import { VerificationCenterPage } from './pages/VerificationCenterPage';
import { EnvironmentalContextPage } from './pages/EnvironmentalContextPage';
import { FlagInvestigationPage } from './pages/FlagInvestigationPage';
import { FinalReportPage } from './pages/FinalReportPage';
import { SettingsPage } from './pages/SettingsPage';

// Retain legacy page imports as fallbacks if needed
import { ExtractionPage } from './pages/ExtractionPage';
import { DataReviewPage } from './pages/DataReviewPage';
import { HistoricalAnalysisPage } from './pages/HistoricalAnalysisPage';
import { ReportHistoryPage } from './pages/ReportHistoryPage';

const MainLayout: React.FC = () => {
  const { activeView, toastMessage } = useVerification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewPage />;
      case 'upload':
        return <UploadPage />;
      case 'raw-data':
      case 'extraction':
        return <RawDataPage />;
      case 'clean-data':
      case 'review':
        return <CleanDataPage />;
      case 'history':
      case 'historical':
      case 'report-history':
        return <HistoryPage />;
      case 'verification':
        return <VerificationCenterPage />;
      case 'environmental-context':
        return <EnvironmentalContextPage />;
      case 'flags':
        return <FlagInvestigationPage />;
      case 'final-report':
        return <FinalReportPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F8FAFC] flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Demo Mode Banner */}
      <DemoModeBanner />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          isOpenMobile={mobileMenuOpen}
          setIsOpenMobile={setMobileMenuOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* Floating Modals */}
      <SourcePanelModal />
      <AdjustValueModal />
      <ContextualPDFModal />
      <GeminiRegulatoryAssistant />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#0D121F] text-slate-100 text-xs font-medium px-4 py-3 rounded-xl border border-[#1E293B] shadow-2xl flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <VerificationProvider>
      <MainLayout />
    </VerificationProvider>
  );
}

import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Layers,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  ExternalLink,
  Building2,
  ShieldCheck,
  FileCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useVerification, AppView } from '../context/VerificationContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    activeView,
    setActiveView,
    facilityProfile,
    settings,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    consolidateUnitReports,
    setChatOpen,
    isAiChecking,
    triggerAiReCheck,
    downloadDetailedPdfReport,
  } = useVerification();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const viewTitles: Record<AppView, { title: string; category: string }> = {
    overview: { title: 'Environmental Intelligence Overview', category: 'Overview' },
    upload: { title: 'Upload Environmental Report', category: 'Reports' },
    'raw-data': { title: 'Raw Corporate Environmental Report Data', category: 'Reports' },
    extraction: { title: 'Raw Corporate Environmental Report Data', category: 'Reports' },
    'clean-data': { title: 'Clean Standardized Environmental Data', category: 'Reports' },
    review: { title: 'Clean Standardized Environmental Data', category: 'Reports' },
    history: { title: 'Historical Environmental Trends & Archive', category: 'Reports' },
    'report-history': { title: 'Historical Environmental Trends & Archive', category: 'Reports' },
    historical: { title: 'Historical Environmental Trends & Archive', category: 'Reports' },
    verification: { title: 'Verification Center & Consistency Checks', category: 'Verification' },
    flags: { title: 'Potential Inconsistencies & Flag Investigation', category: 'Verification' },
    'environmental-context': { title: 'Regional Environmental Context & Zonal Correlation', category: 'Verification' },
    'final-report': { title: 'Consolidated Environmental Verification Dossier', category: 'Final Reports' },
    settings: { title: 'Verification System Settings', category: 'Settings' },
  };

  const current = viewTitles[activeView] || { title: 'Overview', category: 'ClimateLens' };

  return (
    <header className="sticky top-0 z-30 bg-[#0D121F]/90 backdrop-blur-md border-b border-[#1E293B] px-4 sm:px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Clean Breadcrumbs */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#0D121F] lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span>ClimateLens</span>
              <span>/</span>
              <span className="text-emerald-400 font-semibold">{current.category}</span>
            </div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight truncate font-industrial">
              {current.title}
            </h1>
          </div>
        </div>

        {/* Right: Essential Utilities & Verifier Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* ClimateLens AI Assistant Button */}
          <button
            onClick={() => setChatOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all cursor-pointer font-industrial shadow-xs group"
            title="Ask ClimateLens AI Assistant with Real-Time Regulatory Search Grounding"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-emerald-300">ClimateLens AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Notifications button with dark dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#0D121F] border border-transparent hover:border-[#1E293B] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0D121F] animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0D121F] border border-[#1E293B] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-[#1E293B] flex items-center justify-between bg-[#0B0F17]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">
                      Verification Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#1E293B]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.linkPage) {
                            setActiveView(notif.linkPage as AppView);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-3.5 text-xs cursor-pointer transition-colors hover:bg-[#1E293B]/60 ${
                          !notif.read ? 'bg-[#1E293B]/30' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                            {notif.type === 'alert' && (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            )}
                            {notif.type === 'warning' && (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                            {notif.type === 'info' && (
                              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            )}
                            {notif.type === 'success' && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                            <span>{notif.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {notif.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Verifier profile: Executive Verifier Avatar Monogram */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-[#1E293B]">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-mono font-bold text-xs flex items-center justify-center ring-1 ring-emerald-400/40 shadow-xs">
                {settings.reviewerName.charAt(0) || 'V'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0D121F]" />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-200 leading-none font-industrial flex items-center gap-1">
                <span>{settings.reviewerName}</span>
                <ShieldCheck className="w-3 h-3 text-emerald-400 inline shrink-0" />
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                {settings.reviewerRole}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

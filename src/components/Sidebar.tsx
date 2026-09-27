import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Database,
  History,
  ShieldCheck,
  CheckSquare,
  AlertTriangle,
  Globe2,
  Flag,
  FileCheck2,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronRight,
  Leaf,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { useVerification, AppView } from '../context/VerificationContext';
import { VISUAL_ASSETS } from '../data/visualAssets';

interface SidebarProps {
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, setIsOpenMobile }) => {
  const { activeView, setActiveView, flags, metrics, settings, facilityProfile } = useVerification();
  const [reportsOpen, setReportsOpen] = useState(true);
  const [verificationOpen, setVerificationOpen] = useState(true);

  const openFlagsCount = flags.filter((f) => f.status === 'Requires Review' || f.status === 'Investigating').length;

  const navigate = (view: AppView) => {
    setActiveView(view);
    setIsOpenMobile(false);
  };

  const isItemActive = (viewName: AppView) => {
    if (activeView === viewName) return true;
    if (viewName === 'raw-data' && activeView === 'extraction') return true;
    if (viewName === 'clean-data' && activeView === 'review') return true;
    if (viewName === 'history' && (activeView === 'historical' || activeView === 'report-history')) return true;
    return false;
  };

  const navItemClass = (viewName: AppView, isSub = false) => {
    const active = isItemActive(viewName);
    return `w-full flex items-center justify-between text-left text-xs font-medium py-2.5 transition-all rounded-xl ${
      isSub ? 'pl-8 pr-3' : 'px-3.5'
    } ${
      active
        ? 'bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30 shadow-xs'
        : 'text-slate-400 hover:text-slate-100 hover:bg-[#131B2E]'
    }`;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0D121F] border-r border-[#1E293B] flex flex-col transition-transform duration-200 lg:translate-x-0 shadow-2xl ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#0B0F17]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 ring-1 ring-emerald-400/40">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-sm text-slate-100 font-industrial">
                  CLIMATELENS
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded">
                  v2.6
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
                Environmental Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Simplified Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* 1. Overview */}
          <button
            onClick={() => navigate('overview')}
            className={navItemClass('overview')}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className={`w-4 h-4 ${isItemActive('overview') ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>Overview</span>
            </div>
          </button>

          {/* 2. Reports Group */}
          <div className="pt-2">
            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wider transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Reports</span>
              </div>
              {reportsOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {reportsOpen && (
              <div className="space-y-0.5 mt-0.5">
                {/* Upload */}
                <button
                  onClick={() => navigate('upload')}
                  className={navItemClass('upload', true)}
                >
                  <div className="flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </div>
                </button>

                {/* Raw Data (Only dense view) */}
                <button
                  onClick={() => navigate('raw-data')}
                  className={navItemClass('raw-data', true)}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Raw Data</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                    Dense
                  </span>
                </button>

                {/* Clean Data */}
                <button
                  onClick={() => navigate('clean-data')}
                  className={navItemClass('clean-data', true)}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Clean Data</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                    {metrics.length}
                  </span>
                </button>

                {/* History */}
                <button
                  onClick={() => navigate('history')}
                  className={navItemClass('history', true)}
                >
                  <div className="flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-sky-400" />
                    <span>History</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 3. Verification Group */}
          <div className="pt-2">
            <button
              onClick={() => setVerificationOpen(!verificationOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wider transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verification</span>
              </div>
              {verificationOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {verificationOpen && (
              <div className="space-y-0.5 mt-0.5">
                {/* Checks */}
                <button
                  onClick={() => navigate('verification')}
                  className={navItemClass('verification', true)}
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Checks</span>
                  </div>
                </button>

                {/* Flags */}
                <button
                  onClick={() => navigate('flags')}
                  className={navItemClass('flags', true)}
                >
                  <div className="flex items-center gap-2">
                    <Flag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Flags</span>
                  </div>
                  {openFlagsCount > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {openFlagsCount}
                    </span>
                  )}
                </button>

                {/* Environmental Context */}
                <button
                  onClick={() => navigate('environmental-context')}
                  className={navItemClass('environmental-context', true)}
                >
                  <div className="flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5 text-teal-400" />
                    <span>Environmental Context</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                    Zonal
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 4. Final Reports */}
          <div className="pt-2">
            <button
              onClick={() => navigate('final-report')}
              className={navItemClass('final-report')}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className={`w-4 h-4 ${isItemActive('final-report') ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>Final Reports</span>
              </div>
            </button>
          </div>

          {/* 5. Settings */}
          <div className="pt-1">
            <button
              onClick={() => navigate('settings')}
              className={navItemClass('settings')}
            >
              <div className="flex items-center gap-2.5">
                <SettingsIcon className={`w-4 h-4 ${isItemActive('settings') ? 'text-slate-300' : 'text-slate-400'}`} />
                <span>Settings</span>
              </div>
            </button>
          </div>
        </div>

        {/* Facility & Lead Verifier Card */}
        <div className="p-3.5 border-t border-[#1E293B] bg-[#0B0F17]">
          <div className="p-3 rounded-xl bg-[#131B2E] border border-[#1E293B] flex items-center gap-2.5">
            <img
              src={VISUAL_ASSETS.facilityHero}
              alt={facilityProfile.facilityName}
              className="w-9 h-9 rounded-lg object-cover border border-[#1E293B] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-slate-100 truncate font-industrial">
                {facilityProfile.facilityName}
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                <span>Verifier:</span>
                <span className="font-bold text-emerald-400">{settings.reviewerName}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

import React from 'react';
import { AlertCircle, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { useVerification } from '../context/VerificationContext';

export const DemoModeBanner: React.FC = () => {
  const { facilityProfile, resetToDemoData } = useVerification();

  return (
    <div className="bg-[#0B0F17] border-b border-[#1E293B] text-xs text-slate-400 px-4 sm:px-6 py-1.5 flex items-center justify-between gap-4 font-mono">
      <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
          Demo Audit Environment
        </span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span className="text-slate-300 truncate font-sans text-xs">
          {facilityProfile.companyName} — Fictional Cement Manufacturing Dataset
        </span>
        <span aria-hidden="true" className="text-slate-300 hidden md:inline">·</span>
        <span className="text-slate-400 hidden md:inline text-[11px]">
          Lead Verifier: <strong className="text-slate-200 font-semibold">RISHWANTH</strong>
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Cycle: <span className="text-emerald-400 font-semibold">{facilityProfile.reportingPeriod}</span>
        </span>
        <button
          onClick={resetToDemoData}
          className="flex items-center gap-1 text-[11px] font-sans font-medium text-slate-300 hover:text-white bg-[#0D121F] hover:bg-[#1E293B] px-2.5 py-0.5 rounded-lg transition-colors border border-[#1E293B] shadow-xs cursor-pointer"
          title="Reset to initial calibrated demo state"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
};

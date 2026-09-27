import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  FileText,
  Scale,
  Sparkles,
  Zap,
  Droplets,
  BookOpen,
  Check,
  X,
  Edit3,
  HelpCircle,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { VerificationFlag } from '../types';

export const VerificationCenterPage: React.FC = () => {
  const {
    flags,
    metrics,
    historicalData,
    arithmeticSummary,
    triggerContextualPdfView,
    updateFlagStatus,
    setAdjustingMetric,
    showToast,
    settings,
    isAiChecking,
    triggerAiReCheck,
    downloadDetailedPdfReport,
  } = useVerification();

  const [investigatingFlag, setInvestigatingFlag] = useState<VerificationFlag | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const openFlags = flags.filter((f) => f.status === 'Requires Review' || f.status === 'Investigating');
  const consistentCount = metrics.length - openFlags.length;
  const totalEvaluatedCount = metrics.length;

  // Highlighted mini SVG chart component for a finding
  const renderMiniHistoricalChart = (flag: VerificationFlag) => {
    // Find metric historical series if available (default to Scope 1 or Total GHG)
    const isScope1 = flag.metric.toLowerCase().includes('scope 1');
    const isScope2 = flag.metric.toLowerCase().includes('scope 2');

    const chartPoints = historicalData.map((d) => ({
      period: d.period,
      value: isScope1 ? d.scope1 : isScope2 ? d.scope2 : d.totalEmissions,
    }));

    const vals = chartPoints.map((p) => p.value);
    const min = Math.min(...vals) * 0.85;
    const max = Math.max(...vals) * 1.15;
    const w = 220;
    const h = 75;
    const pX = 25;
    const pY = 12;

    const getCoordY = (val: number) => h - pY - ((val - min) / (max - min || 1)) * (h - pY * 2);
    const getCoordX = (idx: number) => pX + (idx / (chartPoints.length - 1)) * (w - pX * 2);

    const pathString = chartPoints
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getCoordX(i)} ${getCoordY(pt.value)}`)
      .join(' ');

    return (
      <div className="bg-[#0B0F17] p-2.5 rounded-xl border border-[#1E293B]">
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
          <span>Multi-Cycle Trajectory</span>
          <span className="text-amber-400 font-bold">Affected Point Highlighted</span>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible select-none">
          <path d={pathString} fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="3 3" />
          {chartPoints.map((pt, i) => {
            const isTarget = i === chartPoints.length - 1;
            const x = getCoordX(i);
            const y = getCoordY(pt.value);

            return (
              <g key={pt.period}>
                <circle
                  cx={x}
                  cy={y}
                  r={isTarget ? 5.5 : 3.5}
                  fill={isTarget ? '#F59E0B' : '#0B0F17'}
                  stroke={isTarget ? '#FBBF24' : '#64748B'}
                  strokeWidth="2"
                />
                {isTarget && (
                  <circle cx={x} cy={y} r="9" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" />
                )}
                <text x={x} y={h - 2} textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="monospace">
                  {pt.period}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/80">
              Consistency Checks &amp; Verification Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-industrial">
            VERIFICATION CENTER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Cross-variable arithmetic consistency, historical variance limits, and regulatory alignment checks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => triggerAiReCheck()}
            disabled={isAiChecking}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-[#111726] hover:bg-[#182338] border border-[#1E293B] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isAiChecking ? 'animate-spin' : ''}`} />
            <span>{isAiChecking ? 'Checking...' : 'Re-Run Checks'}</span>
          </button>

          <button
            onClick={downloadDetailedPdfReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#0B0F17] bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-xs cursor-pointer font-industrial"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#0B0F17]" />
            <span>Download Dossier</span>
          </button>
        </div>
      </div>

      {/* 1. THREE SIMPLE STATUSES (Exact prompt requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status 1: CONSISTENT */}
        <div className="p-5 rounded-2xl bg-[#111726] border border-emerald-950/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>CONSISTENT</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">
              {consistentCount} Parameters
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
              Within expected tolerance limits
            </span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>

        {/* Status 2: CHECKED */}
        <div className="p-5 rounded-2xl bg-[#111726] border border-sky-950/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>CHECKED</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">
              {totalEvaluatedCount} Evaluated
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
              Energy, Water, GHG, Waste, Stack
            </span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
        </div>

        {/* Status 3: NEEDS REVIEW */}
        <div className="p-5 rounded-2xl bg-[#111726] border border-amber-900/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>NEEDS REVIEW</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">
              {openFlags.length} Findings
            </div>
            <span className="text-[11px] text-amber-300 font-mono mt-0.5 block">
              Potential inconsistencies flagged
            </span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        </div>
      </div>

      {/* 2. MOST IMPORTANT VERIFICATION FINDINGS (Exact prompt requirement) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Verification Findings Requiring Human Review
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            {openFlags.length} Action Items
          </span>
        </div>

        <div className="space-y-4">
          {flags.map((flag) => {
            return (
              <div
                key={flag.id}
                className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] hover:border-slate-700 transition-all shadow-sm space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                      {flag.id}
                    </span>
                    <span className="font-bold text-white text-sm">
                      {flag.metric}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-[#0B0F17] px-2 py-0.5 rounded border border-[#1E293B]">
                      {flag.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/80">
                      Status: {flag.status}
                    </span>
                  </div>
                </div>

                {/* Finding Details & Mini Historical Chart Highlight */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Left: Metric reported vs previous, change, explanation */}
                  <div className="lg:col-span-8 space-y-3 text-xs">
                    <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] font-mono">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block">Reported Value</span>
                        <span className="text-base font-bold text-white mt-0.5 block">{flag.reportedValue}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block">Previous Period</span>
                        <span className="text-base font-semibold text-slate-400 mt-0.5 block">{flag.referenceValue}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block">Calculated Change</span>
                        <span className="text-base font-extrabold text-amber-400 mt-0.5 block">{flag.variancePercent}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-slate-300 font-sans leading-relaxed">
                      <strong className="text-white">Observation: </strong>
                      {flag.explanation}
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <span>Source: {flag.sourceDocument}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">Page {flag.sourcePage}</span>
                    </div>
                  </div>

                  {/* Right: Historical graph with the affected point highlighted */}
                  <div className="lg:col-span-4">
                    {renderMiniHistoricalChart(flag)}
                  </div>
                </div>

                {/* Action Footer with INVESTIGATE button */}
                <div className="pt-3 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[10px] font-mono text-slate-400">
                    Logged: {flag.createdAt} • Non-accusatory verification finding
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerContextualPdfView(null, flag.sourcePage)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono text-sky-400 hover:text-sky-300 bg-[#0B0F17] border border-[#1E293B] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect PDF</span>
                    </button>

                    <button
                      onClick={() => setInvestigatingFlag(flag)}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold text-[#0B0F17] bg-amber-400 hover:bg-amber-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer font-industrial"
                    >
                      <span>INVESTIGATE</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0B0F17]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. INVESTIGATE SIDE PANEL / MODAL (Exact prompt requirement) */}
      {investigatingFlag && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl h-full bg-[#111726] border-l border-[#1E293B] shadow-2xl flex flex-col justify-between overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                    {investigatingFlag.id}
                  </span>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                    Audit Investigation Dossier
                  </span>
                </div>
                <button
                  onClick={() => setInvestigatingFlag(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {investigatingFlag.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {investigatingFlag.metric}
                </h2>
              </div>
            </div>

            {/* Structured 5 Answers Required by Prompt */}
            <div className="space-y-4 flex-1 text-xs">
              {/* Question 1: Why was this flagged? */}
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-1.5">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block tracking-wider">
                  1. Why was this flagged?
                </span>
                <p className="text-slate-200 text-xs leading-relaxed font-sans">
                  {investigatingFlag.explanation}
                </p>
              </div>

              {/* Question 2: What values were compared? */}
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-sky-400 block tracking-wider">
                  2. What values were compared?
                </span>
                <div className="grid grid-cols-3 gap-2 font-mono text-center">
                  <div className="p-2 rounded-lg bg-[#111726] border border-[#1E293B]">
                    <span className="text-[9px] text-slate-400 uppercase block">Reported</span>
                    <span className="font-bold text-white text-xs mt-0.5 block">{investigatingFlag.reportedValue}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#111726] border border-[#1E293B]">
                    <span className="text-[9px] text-slate-400 uppercase block">Baseline Ref</span>
                    <span className="font-semibold text-slate-400 text-xs mt-0.5 block">{investigatingFlag.referenceValue}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#111726] border border-[#1E293B]">
                    <span className="text-[9px] text-slate-400 uppercase block">Variance</span>
                    <span className="font-extrabold text-amber-400 text-xs mt-0.5 block">{investigatingFlag.variancePercent}</span>
                  </div>
                </div>
              </div>

              {/* Question 3: What source was used? */}
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block tracking-wider">
                  3. What source was used?
                </span>
                <div className="flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-slate-200 font-semibold block">{investigatingFlag.sourceDocument}</span>
                    <span className="text-[11px] text-slate-400">{investigatingFlag.sourceSection}</span>
                  </div>
                  <button
                    onClick={() => {
                      triggerContextualPdfView(null, investigatingFlag.sourcePage);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono text-sky-400 hover:text-sky-300 bg-[#111726] border border-[#1E293B] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Page {investigatingFlag.sourcePage}</span>
                  </button>
                </div>
              </div>

              {/* Question 4: What possible explanations exist? */}
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-300 block tracking-wider">
                  4. What possible explanations exist? (Non-Accusatory Hypotheses)
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 font-sans leading-relaxed">
                  {investigatingFlag.possibleCauses.map((cause, i) => (
                    <li key={i}>{cause}</li>
                  ))}
                </ul>
              </div>

              {/* Question 5: What should the reviewer check? */}
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-emerald-950/80 space-y-1.5">
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block tracking-wider">
                  5. What should the reviewer check?
                </span>
                <p className="text-emerald-200 font-semibold text-xs leading-relaxed font-sans">
                  {investigatingFlag.recommendedAction}
                </p>
              </div>

              {/* Ethical Guardrail Disclaimer */}
              <div className="p-3 rounded-xl bg-[#0B0F17]/60 border border-[#1E293B] text-[10px] text-slate-400 leading-relaxed font-sans">
                <strong className="text-slate-400">Ethical Governance Notice: </strong>
                ClimateLens identifies potential inconsistencies for qualified human review. It does not state or imply fraud or falsification. The determination belongs solely to Lead Verifier {settings.reviewerName}.
              </div>
            </div>

            {/* Actions for Reviewer */}
            <div className="pt-4 border-t border-[#1E293B] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    updateFlagStatus(
                      investigatingFlag.id,
                      'Verified - Explained',
                      'Human verifier reviewed technical documentation and confirmed operational root cause.'
                    );
                    setInvestigatingFlag(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0F17] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-industrial"
                >
                  <Check className="w-3.5 h-3.5 text-[#0B0F17]" />
                  <span>Verify with Note</span>
                </button>

                <button
                  onClick={() => {
                    updateFlagStatus(
                      investigatingFlag.id,
                      'Flagged - Follow Up',
                      `Formal engineering clarification requested by Lead Verifier ${settings.reviewerName}.`
                    );
                    setInvestigatingFlag(null);
                    showToast(`Dispatched clarification request for Flag ${investigatingFlag.id}.`);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                  <span>Request Clarification</span>
                </button>
              </div>

              <button
                onClick={() => {
                  triggerContextualPdfView(null, investigatingFlag.sourcePage);
                  setInvestigatingFlag(null);
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#0B0F17] hover:bg-[#1E293B] text-sky-400 border border-[#1E293B] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Source PDF (Page {investigatingFlag.sourcePage})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

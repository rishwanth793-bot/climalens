import React, { useState } from 'react';
import {
  Flag,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Eye,
  FileText,
  X,
  Check,
  HelpCircle,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { VerificationFlag } from '../types';

export const FlagInvestigationPage: React.FC = () => {
  const {
    flags,
    investigatingFlagId,
    setInvestigatingFlagId,
    updateFlagStatus,
    triggerContextualPdfView,
    showToast,
    settings,
  } = useVerification();

  const [selectedFlag, setSelectedFlag] = useState<VerificationFlag | null>(
    flags.find((f) => f.id === investigatingFlagId) || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [noteInput, setNoteInput] = useState('');

  const filteredFlags = flags.filter((f) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.id.toLowerCase().includes(q) ||
        f.metric.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleFlagClick = (flag: VerificationFlag) => {
    setSelectedFlag(flag);
    setInvestigatingFlagId(flag.id);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlag || !noteInput.trim()) return;
    updateFlagStatus(selectedFlag.id, selectedFlag.status, noteInput.trim());
    setSelectedFlag((prev) => (prev ? { ...prev, reviewerNote: noteInput.trim() } : null));
    setNoteInput('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/80">
              Audit Findings Queue
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-industrial">
            FLAGS &amp; INVESTIGATION
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Clean overview of all detected potential inconsistencies. Click any flag to view complete investigation details.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flag..."
            className="pl-8 pr-3 py-1.5 rounded-xl bg-[#111726] border border-[#1E293B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium w-48 sm:w-60"
          />
        </div>
      </div>

      {/* Clean Flags Table: Flag ID | Metric | Change | Severity | Status (Exact prompt requirement) */}
      <div className="bg-[#111726] border border-[#1E293B] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#0E1524] border-b border-[#1E293B] text-slate-400 font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-6 font-semibold">Flag ID</th>
              <th className="py-3.5 px-6 font-semibold">Metric</th>
              <th className="py-3.5 px-6 font-semibold text-right font-mono">Change</th>
              <th className="py-3.5 px-6 font-semibold text-center">Severity</th>
              <th className="py-3.5 px-6 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/70 font-sans">
            {filteredFlags.map((flag) => {
              const isSelected = selectedFlag?.id === flag.id;

              return (
                <tr
                  key={flag.id}
                  onClick={() => handleFlagClick(flag)}
                  className={`transition-colors cursor-pointer group ${
                    isSelected ? 'bg-[#182338]' : 'hover:bg-[#151D2F]'
                  }`}
                >
                  {/* Flag ID */}
                  <td className="py-4 px-6 font-mono font-bold text-amber-400 group-hover:text-amber-300">
                    {flag.id}
                  </td>

                  {/* Metric */}
                  <td className="py-4 px-6 font-semibold text-white">
                    <div>{flag.metric}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{flag.category}</div>
                  </td>

                  {/* Change */}
                  <td className="py-4 px-6 text-right font-mono font-bold text-amber-400 tabular-nums">
                    {flag.variancePercent}
                  </td>

                  {/* Severity */}
                  <td className="py-4 px-6 text-center font-mono">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        flag.severity === 'High'
                          ? 'bg-rose-950/60 text-rose-300 border-rose-800/80'
                          : flag.severity === 'Medium'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800/80'
                          : 'bg-sky-950/60 text-sky-300 border-sky-800/80'
                      }`}
                    >
                      {flag.severity}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 text-right font-mono">
                    <span className="text-slate-300 text-xs font-semibold">
                      {flag.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Investigation Side-over Drawer when a Flag is Clicked */}
      {selectedFlag && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg h-full bg-[#111726] border-l border-[#1E293B] shadow-2xl flex flex-col justify-between overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                    {selectedFlag.id}
                  </span>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                    Flag Details &amp; Root Cause
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFlag(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {selectedFlag.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {selectedFlag.metric}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 flex-1 text-xs">
              {/* Quantified Variance Box */}
              <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] font-mono text-center">
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block">Reported</span>
                  <span className="font-bold text-white text-xs mt-0.5 block">{selectedFlag.reportedValue}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block">Baseline</span>
                  <span className="font-semibold text-slate-400 text-xs mt-0.5 block">{selectedFlag.referenceValue}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block">Variance</span>
                  <span className="font-extrabold text-amber-400 text-xs mt-0.5 block">{selectedFlag.variancePercent}</span>
                </div>
              </div>

              {/* Observation */}
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
                  Observation
                </span>
                <p className="text-slate-200 text-xs leading-relaxed font-sans">
                  {selectedFlag.explanation}
                </p>
              </div>

              {/* Primary Source Trace */}
              <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-slate-200 font-semibold block">{selectedFlag.sourceDocument}</span>
                  <span className="text-[11px] text-slate-400">{selectedFlag.sourceSection}</span>
                </div>
                <button
                  onClick={() => triggerContextualPdfView(null, selectedFlag.sourcePage)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono text-sky-400 hover:text-sky-300 bg-[#111726] border border-[#1E293B] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Page {selectedFlag.sourcePage}</span>
                </button>
              </div>

              {/* Hypotheses */}
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
                  Possible Operational Explanations
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 font-sans leading-relaxed">
                  {selectedFlag.possibleCauses.map((cause, i) => (
                    <li key={i}>{cause}</li>
                  ))}
                </ul>
              </div>

              {/* Action recommended */}
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-emerald-950/80 space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block tracking-wider">
                  Recommended Verification Action
                </span>
                <p className="text-emerald-200 font-semibold text-xs leading-relaxed font-sans">
                  {selectedFlag.recommendedAction}
                </p>
              </div>

              {/* Existing note */}
              {selectedFlag.reviewerNote && (
                <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1">
                    Logged Verifier Note
                  </span>
                  <p className="text-slate-300 font-mono text-xs leading-relaxed">
                    &ldquo;{selectedFlag.reviewerNote}&rdquo;
                  </p>
                </div>
              )}

              {/* Add reviewer note */}
              <form onSubmit={handleAddNote} className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-bold text-slate-300">
                  Append Audit Finding Note:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Enter audit note..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#0B0F17] bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer font-industrial"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>

            {/* Decision Actions */}
            <div className="pt-4 border-t border-[#1E293B] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    updateFlagStatus(
                      selectedFlag.id,
                      'Verified - Explained',
                      'Verified by Lead Verifier with documented operational cause.'
                    );
                    setSelectedFlag(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0F17] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-industrial"
                >
                  <Check className="w-3.5 h-3.5 text-[#0B0F17]" />
                  <span>Verify with Note</span>
                </button>

                <button
                  onClick={() => {
                    updateFlagStatus(
                      selectedFlag.id,
                      'Flagged - Follow Up',
                      `Clarification requested by Lead Verifier ${settings.reviewerName}.`
                    );
                    setSelectedFlag(null);
                    showToast(`Dispatched clarification request for Flag ${selectedFlag.id}.`);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                  <span>Clarification</span>
                </button>
              </div>

              <button
                onClick={() => {
                  triggerContextualPdfView(null, selectedFlag.sourcePage);
                  setSelectedFlag(null);
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#0B0F17] hover:bg-[#1E293B] text-sky-400 border border-[#1E293B] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect in Source PDF (Page {selectedFlag.sourcePage})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

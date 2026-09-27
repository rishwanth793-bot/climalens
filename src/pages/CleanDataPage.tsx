import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  Edit3,
  Flag,
  Check,
  X,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { EnvironmentalMetric } from '../types';

export const CleanDataPage: React.FC = () => {
  const {
    metrics,
    verifyMetric,
    flagMetric,
    setAdjustingMetric,
    triggerContextualPdfView,
    canonicalMetrics,
    showToast,
    settings,
  } = useVerification();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked' | 'review'>('all');
  const [selectedMetric, setSelectedMetric] = useState<EnvironmentalMetric | null>(null);

  const filteredMetrics = metrics.filter((m) => {
    // Status filter
    const isChecked = m.verificationStatus === 'verified' || m.confidenceTier === 'high';
    if (statusFilter === 'checked' && !isChecked) return false;
    if (statusFilter === 'review' && isChecked) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.metricName.toLowerCase().includes(q) ||
        m.unit.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getMetricStatus = (metric: EnvironmentalMetric) => {
    if (metric.verificationStatus === 'verified') {
      return {
        label: 'Checked',
        type: 'checked',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
      };
    }
    if (metric.verificationStatus === 'adjusted') {
      return {
        label: 'Adjusted',
        type: 'adjusted',
        icon: <Check className="w-3.5 h-3.5 text-sky-400" />,
        badgeClass: 'bg-sky-950/60 text-sky-300 border-sky-800/80',
      };
    }
    if (metric.confidenceTier === 'needs_review' || metric.verificationStatus === 'flagged') {
      return {
        label: 'Review',
        type: 'review',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
        badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
      };
    }
    return {
      label: 'Checked',
      type: 'checked',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
      badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
    };
  };

  const selectedCanonical = selectedMetric
    ? canonicalMetrics.find((c) => c.legacyId === selectedMetric.id)
    : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/80">
              Standardized Environmental Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-industrial">
            CLEAN DATA
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Normalized, standardized, and checked environmental records. Click any row to view complete source traceability.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search metric..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#111726] border border-[#1E293B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium w-44 sm:w-56"
            />
          </div>

          <div className="inline-flex items-center bg-[#111726] border border-[#1E293B] rounded-xl p-1 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({metrics.length})
            </button>
            <button
              onClick={() => setStatusFilter('checked')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'checked'
                  ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Checked
            </button>
            <button
              onClick={() => setStatusFilter('review')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'review'
                  ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Review
            </button>
          </div>
        </div>
      </div>

      {/* The Simple Structured Table Required by Prompt */}
      <div className="bg-[#111726] border border-[#1E293B] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#0E1524] border-b border-[#1E293B] text-slate-400 font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-6 font-semibold">Metric</th>
              <th className="py-3.5 px-6 font-semibold text-right font-mono">Value</th>
              <th className="py-3.5 px-6 font-semibold font-mono">Unit</th>
              <th className="py-3.5 px-6 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/70 font-sans">
            {filteredMetrics.map((item) => {
              const status = getMetricStatus(item);
              const isSelected = selectedMetric?.id === item.id;

              return (
                <tr
                  key={item.id}
                  onClick={() => setSelectedMetric(item)}
                  className={`transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-[#182338]'
                      : 'hover:bg-[#151D2F]'
                  }`}
                >
                  {/* Metric Name */}
                  <td className="py-3.5 px-6 font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <span>{item.metricName}</span>
                      <span className="text-[10px] font-mono font-normal text-slate-500">
                        ({item.category})
                      </span>
                    </div>
                  </td>

                  {/* Value */}
                  <td className="py-3.5 px-6 text-right font-mono font-bold text-white tabular-nums text-sm">
                    {item.value}
                  </td>

                  {/* Unit */}
                  <td className="py-3.5 px-6 font-mono text-slate-400 text-xs">
                    {item.unit}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-6 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${status.badgeClass}`}
                    >
                      {status.icon}
                      <span>{status.label}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Slide-over Inspection Drawer when a Metric is Clicked */}
      {selectedMetric && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg h-full bg-[#111726] border-l border-[#1E293B] shadow-2xl flex flex-col justify-between overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                    Traceability &amp; Verification Card
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMetric(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  {selectedMetric.category} Metric
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {selectedMetric.metricName}
                </h2>
              </div>
            </div>

            {/* Structured Additional Information Requested by Prompt */}
            <div className="space-y-4 flex-1 text-xs">
              {/* Value Box */}
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Reported Value</span>
                  <span className="font-mono text-2xl font-bold text-white mt-0.5 block">
                    {selectedMetric.value}{' '}
                    <span className="text-xs text-slate-400 font-normal">{selectedMetric.unit}</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Review Status</span>
                  <span className="font-mono text-xs font-bold text-emerald-400 mt-1 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {selectedMetric.verificationStatus}
                  </span>
                </div>
              </div>

              {/* Traceability Grid */}
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                  <span className="text-[10px] uppercase text-slate-500 block">Source</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block truncate" title={selectedMetric.sourceDocument}>
                    {selectedMetric.sourceDocument}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                  <span className="text-[10px] uppercase text-slate-500 block">Page</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">
                    Page {selectedMetric.sourcePage}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                  <span className="text-[10px] uppercase text-slate-500 block">Reporting Period</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">
                    {selectedMetric.reportingPeriod}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                  <span className="text-[10px] uppercase text-slate-500 block">Confidence</span>
                  <span className="font-bold text-sky-400 mt-0.5 block">
                    {selectedMetric.confidenceScore}% ({selectedMetric.confidenceTier})
                  </span>
                </div>
              </div>

              {/* Section */}
              <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Section Citation</span>
                <span className="font-mono text-slate-300 text-[11px] block">
                  {selectedMetric.sourceSection}
                </span>
              </div>

              {/* Methodology / Standard Taxonomy */}
              <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Methodology &amp; Standards</span>
                <div className="font-mono text-slate-300 text-[11px]">
                  {selectedCanonical ? (
                    <div>
                      <span className="text-emerald-400 font-bold">{selectedCanonical.standardTaxonomyCode}</span>
                      <p className="text-slate-400 mt-1">SI Standard: {selectedCanonical.standardizedValue}</p>
                    </div>
                  ) : (
                    <span>GHG Protocol Corporate Standard / ISO 14064-1</span>
                  )}
                </div>
              </div>

              {/* Source Snippet */}
              <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Source Excerpt</span>
                <p className="font-mono text-slate-300 text-[11px] italic leading-relaxed">
                  &ldquo;{selectedMetric.sourceSnippet}&rdquo;
                </p>
              </div>

              {/* Ambiguity Reason if any */}
              {selectedMetric.ambiguityReason && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-200">Review Note:</strong>
                    <span className="text-[11px]">{selectedMetric.ambiguityReason}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions for Verifier */}
            <div className="pt-4 border-t border-[#1E293B] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    verifyMetric(selectedMetric.id);
                    setSelectedMetric(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0F17] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-industrial"
                >
                  <Check className="w-3.5 h-3.5 text-[#0B0F17]" />
                  <span>Confirm Value</span>
                </button>

                <button
                  onClick={() => {
                    setAdjustingMetric(selectedMetric);
                    setSelectedMetric(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Adjust Value</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerContextualPdfView(selectedMetric, selectedMetric.sourcePage);
                    setSelectedMetric(null);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#0B0F17] hover:bg-[#1E293B] text-sky-400 border border-[#1E293B] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect in Source PDF (Page {selectedMetric.sourcePage})</span>
                </button>

                <button
                  onClick={() => {
                    flagMetric(selectedMetric.id, 'Flagged from Clean Data review');
                    setSelectedMetric(null);
                  }}
                  className="py-2 px-3 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/80 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="Flag for further review"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { X, ExternalLink, ShieldCheck, Flag, Edit3, CheckCircle2, AlertTriangle, FileText, Check, Eye, Scale, BookOpen } from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { VISUAL_ASSETS } from '../data/visualAssets';

export const SourcePanelModal: React.FC = () => {
  const {
    selectedSourceMetric,
    setSelectedSourceMetric,
    verifyMetric,
    flagMetric,
    setAdjustingMetric,
    triggerContextualPdfView,
    canonicalMetrics,
  } = useVerification();

  if (!selectedSourceMetric) return null;

  const metric = selectedSourceMetric;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#0D121F] border border-[#1E293B] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#1E293B] flex items-center justify-between bg-[#0B0F17]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Source Reference Traceability
              </div>
              <h2 className="text-base font-bold text-slate-100">
                {metric.metricName}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setSelectedSourceMetric(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131B2E] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Document & Page info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-[#131B2E] border border-[#1E293B]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Source Document
              </span>
              <span className="text-xs font-semibold text-slate-200 truncate block mt-0.5" title={metric.sourceDocument}>
                {metric.sourceDocument}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#131B2E] border border-[#1E293B]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Page Number
              </span>
              <span className="text-xs font-mono font-bold text-sky-400 mt-0.5 block">
                Page {metric.sourcePage}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#131B2E] border border-[#1E293B]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Extracted Value
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5 block">
                {metric.value} {metric.unit}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#131B2E] border border-[#1E293B]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                AI Confidence
              </span>
              <span className="text-xs font-mono font-bold text-slate-200 mt-0.5 flex items-center gap-1.5">
                {metric.confidenceScore}%
                <span className={`w-2 h-2 rounded-full ${
                  metric.confidenceScore >= 90 ? 'bg-emerald-400' : metric.confidenceScore >= 75 ? 'bg-amber-400' : 'bg-rose-400'
                }`} />
              </span>
            </div>
          </div>

          {/* Section & Table reference */}
          <div className="p-3.5 rounded-xl bg-[#131B2E] border border-[#1E293B] text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold text-slate-200">
                Document Location:
              </span>
              {metric.tableReference && (
                <span className="font-mono text-sky-400 font-semibold text-[11px]">
                  {metric.tableReference}
                </span>
              )}
            </div>
            <p className="text-slate-300 font-mono text-[11px]">
              {metric.sourceSection}
            </p>
          </div>

          {/* Source Excerpt / Document Snippet */}
          <div>
            <div className="text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
              <span>Source Context Excerpt</span>
              <span className="text-[10px] text-slate-400 font-medium">
                Extracted via OCR &amp; Multi-table Parser
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs font-mono leading-relaxed text-slate-300 relative shadow-sm">
              <div className="absolute top-2.5 right-2.5 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Verifiable
              </div>
              <p className="pr-16 text-[12px] italic">
                &ldquo;{metric.sourceSnippet}&rdquo;
              </p>
            </div>
          </div>

          {/* Ambiguity Reason if any */}
          {metric.ambiguityReason && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-200">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>AI Reliability Note: Human Confirmation Recommended</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-300/90">
                {metric.ambiguityReason}
              </p>
            </div>
          )}

          {/* Canonical Taxonomy & Grounding Evaluations */}
          {(() => {
            const canonical = canonicalMetrics.find((cm) => cm.legacyId === metric.id);
            if (!canonical) return null;
            return (
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-white text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5" />
                      Canonical Data Model &amp; SI Normalization
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#131B2E] text-slate-300 border border-[#1E293B]">
                      {canonical.standardTaxonomyCode}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Category &amp; Scope</span>
                      <span className="font-semibold text-slate-200">{canonical.category} {canonical.ghgScope ? `(${canonical.ghgScope})` : ''}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">SI Standardized Value</span>
                      <span className="font-mono font-bold text-emerald-400">{canonical.standardizedValue}</span>
                    </div>
                  </div>
                  {canonical.unitConversionExplanation && (
                    <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-[#1E293B]">
                      Conversion factor: {canonical.unitConversionExplanation}
                    </div>
                  )}
                </div>

                {canonical.groundingEvaluations.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-[#131B2E] border border-emerald-500/20 text-xs space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase text-emerald-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      Statutory Regulatory Grounding Citations
                    </div>
                    {canonical.groundingEvaluations.map((ev, i) => (
                      <div key={i} className="bg-[#0B0F17] p-2.5 rounded-lg border border-[#1E293B] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 text-[11px]">{ev.title}</span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            ev.status === 'PASS'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                              : ev.status === 'OBSERVATION'
                              ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          }`}>
                            {ev.status}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">{ev.citation}</div>
                        <div className="text-[11px] text-slate-300 leading-snug">{ev.explanation}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Standardization */}
          {metric.standardizedValue && (
            <div className="text-xs bg-[#131B2E] p-3 rounded-xl border border-[#1E293B]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Standardized Representation
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {metric.standardizedValue}
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#1E293B] bg-[#0B0F17] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAdjustingMetric(metric);
                setSelectedSourceMetric(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-sky-400" />
              <span>Adjust</span>
            </button>

            <button
              onClick={() => {
                triggerContextualPdfView(metric, metric.sourcePage);
                setSelectedSourceMetric(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-colors cursor-pointer"
              title="Open full interactive PDF at citation page"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Inspect Source PDF (p.{metric.sourcePage})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                flagMetric(metric.id, 'Flagged from source traceability panel review');
                setSelectedSourceMetric(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Flag</span>
            </button>

            <button
              onClick={() => {
                verifyMetric(metric.id);
                setSelectedSourceMetric(null);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Verify &amp; Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  X,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flag,
  Check,
  Edit3,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { PDFDocumentViewer } from './PDFDocumentViewer';

export const ContextualPDFModal: React.FC = () => {
  const {
    isPdfModalOpen,
    setIsPdfModalOpen,
    pdfHighlightedMetric,
    activePdfPage,
    setActivePdfPage,
    verifyMetric,
    flagMetric,
    setAdjustingMetric,
    setActiveView,
    facilityProfile,
  } = useVerification();

  if (!isPdfModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#0D121F] border border-[#1E293B] rounded-2xl w-full max-w-6xl h-[92vh] max-h-[900px] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header Bar */}
        <div className="px-5 py-3 bg-[#0B0F17] text-white flex items-center justify-between shrink-0 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 tracking-tight">
                  Contextual Source Document Traceability
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D121F] text-emerald-300 border border-emerald-500/30">
                  Page {activePdfPage} of 28
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {facilityProfile.companyName} • {facilityProfile.reportingPeriod} Statutory Filing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsPdfModalOpen(false);
                setActiveView('raw-data');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors cursor-pointer"
              title="Open full raw data workspace"
            >
              <span>Raw Data Workspace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#0D121F] transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split between PDF Viewer and Contextual Metric Card */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#1E293B] overflow-hidden bg-[#0B0F17]">
          {/* Left / Center: Interactive PDF Document Viewer */}
          <div className="lg:col-span-8 h-full min-h-0 flex flex-col p-3 sm:p-4 overflow-hidden">
            <div className="h-full flex flex-col">
              <PDFDocumentViewer highlightMetric={pdfHighlightedMetric} compact={true} />
            </div>
          </div>

          {/* Right: Selected Data Point Verification Inspector */}
          <div className="lg:col-span-4 h-full min-h-0 flex flex-col bg-[#0D121F] overflow-y-auto p-5 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Active Audit Data Point
              </span>
              <h4 className="text-base font-bold text-slate-100 mt-1.5">
                {pdfHighlightedMetric ? pdfHighlightedMetric.metricName : 'Document Inspection Mode'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {pdfHighlightedMetric
                  ? `${pdfHighlightedMetric.category} • Disclosed on Page ${pdfHighlightedMetric.sourcePage}`
                  : 'Browsing corporate disclosure pages'}
              </p>
            </div>

            {pdfHighlightedMetric ? (
              <>
                {/* Metric Value & Confidence Pill */}
                <div className="p-4 rounded-xl bg-[#0D121F] border border-[#1E293B] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Disclosed Value:</span>
                    <span className="font-mono text-base font-bold text-emerald-400">
                      {pdfHighlightedMetric.value} {pdfHighlightedMetric.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#1E293B]">
                    <span className="text-slate-400">Extraction Confidence:</span>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full border ${
                        pdfHighlightedMetric.confidenceScore >= 90
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {pdfHighlightedMetric.confidenceScore}% (
                      {pdfHighlightedMetric.confidenceTier})
                    </span>
                  </div>

                  {pdfHighlightedMetric.varianceFromPrevious && (
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#1E293B]">
                      <span className="text-slate-400">Historical Variance:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {pdfHighlightedMetric.varianceFromPrevious > 0 ? '+' : ''}
                        {pdfHighlightedMetric.varianceFromPrevious}% vs FY25
                      </span>
                    </div>
                  )}
                </div>

                {/* Source Excerpt */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>OCR Table Excerpt</span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {pdfHighlightedMetric.tableReference || `Page ${pdfHighlightedMetric.sourcePage}`}
                    </span>
                  </div>
                  <div className="p-3 bg-[#0D121F] rounded-xl border border-[#1E293B] text-xs text-slate-300 font-mono italic leading-relaxed">
                    &ldquo;{pdfHighlightedMetric.sourceSnippet}&rdquo;
                  </div>
                </div>

                {/* Section & Audit Reason */}
                <div className="p-3 bg-[#0D121F] rounded-xl border border-[#1E293B] text-xs space-y-1">
                  <div className="font-semibold text-slate-200">Section Reference:</div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    {pdfHighlightedMetric.sourceSection}
                  </div>
                  {pdfHighlightedMetric.notes && (
                    <div className="pt-2 text-slate-400 border-t border-[#1E293B]">
                      <strong className="text-slate-200">Audit Finding: </strong>
                      {pdfHighlightedMetric.notes}
                    </div>
                  )}
                </div>

                {/* Quick Auditor Actions */}
                <div className="pt-3 border-t border-[#1E293B] space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Auditor Review Decisions
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        verifyMetric(pdfHighlightedMetric.id);
                        setIsPdfModalOpen(false);
                      }}
                      className="py-2 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify Metric</span>
                    </button>

                    <button
                      onClick={() => {
                        flagMetric(pdfHighlightedMetric.id, 'Flagged from contextual PDF modal review');
                        setIsPdfModalOpen(false);
                      }}
                      className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Flag for Review</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setAdjustingMetric(pdfHighlightedMetric);
                      setIsPdfModalOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#0D121F] hover:bg-[#1E293B] text-slate-200 border border-[#1E293B] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Adjust Reported Value</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 space-y-3 text-xs text-slate-400">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <p>
                  Use the page controls above to inspect any page of the disclosure report.
                </p>
                <div className="p-3 bg-[#0D121F] rounded-xl text-slate-300 border border-[#1E293B]">
                  Select any metric from the Clean Data or Verification Center pages to jump directly to its verified citation.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Flag,
  Edit3,
  XCircle,
  FileText,
  UserCheck,
  ExternalLink,
  History,
  ShieldAlert,
  Sparkles,
  Eye,
  Check,
  Info,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { EnvironmentalMetric } from '../types';
import { VISUAL_ASSETS } from '../data/visualAssets';

export const DataReviewPage: React.FC = () => {
  const {
    metrics,
    canonicalMetrics,
    auditLogs,
    verifyMetric,
    flagMetric,
    dismissMetric,
    setAdjustingMetric,
    setSelectedSourceMetric,
    triggerContextualPdfView,
    facilityProfile,
    settings,
  } = useVerification();

  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  const pendingReviewMetrics = metrics.filter(
    (m) => m.confidenceTier === 'needs_review' || m.confidenceTier === 'medium' || m.verificationStatus === 'pending'
  );

  const displayList = activeTab === 'pending' ? pendingReviewMetrics : metrics;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Visual Header Banner (Tata Style) */}
      <div className="relative rounded-2xl overflow-hidden border border-[#1E293B] shadow-xs bg-slate-900 text-white min-h-[140px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src={VISUAL_ASSETS.laboratoryInspection}
          alt="Laboratory Environmental Testing"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-2">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              Human-in-the-Loop Verification Desk
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Data Review &amp; Confirmation
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Lead Verifier <strong className="text-emerald-400 font-bold">RISHWANTH</strong> and engineering auditors review AI-extracted points against original disclosures.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-1 p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xs">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Requires Review ({pendingReviewMetrics.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-emerald-500 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All Extracted ({metrics.length})
            </button>
          </div>
        </div>
      </div>

      {/* Review Queue Cards */}
      <div className="space-y-3.5">
        {displayList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#1E293B] shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">
              All Pending Metrics Verified!
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              All extracted indicators meet the configured confidence threshold ({settings.confidenceThreshold}%).
            </p>
          </div>
        ) : (
          displayList.map((item) => {
            const isNeedsReview = item.confidenceTier === 'needs_review';
            const isMedium = item.confidenceTier === 'medium';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-white border transition-all shadow-xs ${
                  isNeedsReview
                    ? 'border-amber-300/80 hover:border-amber-400'
                    : isMedium
                    ? 'border-sky-300/80 hover:border-sky-400'
                    : 'border-[#1E293B] hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Metric Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {item.metricName}
                      </span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-300 border border-[#1E293B]">
                        {item.category}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                          isNeedsReview
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : isMedium
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        Confidence: {item.confidenceScore}%
                      </span>
                      {item.verificationStatus === 'verified' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Canonical Taxonomy and SI Standardization */}
                    {(() => {
                      const canonical = canonicalMetrics.find((cm) => cm.legacyId === item.id);
                      if (!canonical) return null;
                      return (
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                          <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-900 text-emerald-300 text-[10px]">
                            {canonical.standardTaxonomyCode}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-300 font-medium">
                            SI Standardized: <strong className="font-mono text-white">{canonical.standardizedValue}</strong>
                          </span>
                          {canonical.unitConversionExplanation && (
                            <span className="text-slate-400 text-[10px]">({canonical.unitConversionExplanation})</span>
                          )}
                          {canonical.groundingEvaluations.map((ev, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                ev.status === 'PASS'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : ev.status === 'OBSERVATION'
                                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                              title={`${ev.citation} — ${ev.explanation}`}
                            >
                              {ev.authority}: {ev.status}
                            </span>
                          ))}
                        </div>
                      );
                    })()}

                    {/* Reported Value and Unit */}
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Reported: </span>
                        {item.value === 'Not disclosed in source' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-mono text-xs font-semibold border border-amber-200">
                            <Info className="w-3.5 h-3.5 text-amber-600" />
                            Not disclosed in source
                          </span>
                        ) : (
                          <span className="font-mono text-base font-bold text-white">
                            {item.value} {item.unit}
                          </span>
                        )}
                      </div>
                      {item.previousPeriodValue ? (
                        <div>
                          <span className="text-slate-400">FY 2024–25 Baseline: </span>
                          <span className="font-mono text-slate-200 font-semibold">
                            {item.previousPeriodValue.toLocaleString()} {item.unit}
                          </span>
                        </div>
                      ) : null}
                      {item.varianceFromPrevious !== undefined && item.value !== 'Not disclosed in source' ? (
                        <div className="font-mono font-bold text-xs">
                          <span
                            className={
                              item.varianceFromPrevious > 0 ? 'text-amber-800' : 'text-emerald-800'
                            }
                          >
                            {item.varianceFromPrevious > 0 ? '+' : ''}
                            {item.varianceFromPrevious}% YoY
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Ambiguity Reason */}
                    {item.ambiguityReason ? (
                      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 mt-2">
                        <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                          <span>Reason for Verification Review:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-amber-900">
                          {item.ambiguityReason}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 line-clamp-1 italic">
                        &ldquo;{item.sourceSnippet}&rdquo;
                      </p>
                    )}

                    {/* Contextual PDF Traceability Link */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>
                        Source: {item.sourceDocument} •{' '}
                        <span className="text-sky-700 font-mono font-bold">
                          Page {item.sourcePage}
                        </span>
                      </span>

                      {/* Trigger Contextual PDF View */}
                      <button
                        onClick={() => triggerContextualPdfView(item)}
                        className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-bold bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        title="Open interactive source PDF document side-by-side"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-600" />
                        <span>Inspect in Source PDF</span>
                      </button>

                      <button
                        onClick={() => setSelectedSourceMetric(item)}
                        className="text-slate-300 hover:text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Source Traceability Card</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Reviewer Action Buttons */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 pt-2 lg:pt-0 shrink-0">
                    <button
                      onClick={() => verifyMetric(item.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Value</span>
                    </button>

                    <button
                      onClick={() => setAdjustingMetric(item)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                      <span>Adjust / Edit</span>
                    </button>

                    <button
                      onClick={() => flagMetric(item.id, 'Flagged from human confirmation review')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Mark for Review</span>
                    </button>

                    <button
                      onClick={() => dismissMetric(item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Dismiss as non-material"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reviewer Audit Log Trail */}
      <div className="p-6 rounded-2xl bg-white border border-[#1E293B] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-white">
              Verified Audit Decision Trail
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Lead Verifier: {settings.reviewerName}
          </span>
        </div>

        <div className="space-y-2.5">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{log.metricName}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded border ${
                      log.action === 'Verify'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : log.action === 'Flag'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-sky-50 text-sky-800 border-sky-200'
                    }`}
                  >
                    {log.action}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  <strong className="text-slate-200">Audit Justification: </strong>
                  {log.reason}
                </p>
              </div>

              <div className="text-right shrink-0 text-[11px] text-slate-400 font-mono">
                <div>{log.reviewer}</div>
                <div>{log.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

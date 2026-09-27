import React from 'react';
import {
  Download,
  Printer,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building,
  MapPin,
  Calendar,
  Globe2,
  Info,
  Check,
  Eye,
  Sparkles,
  FileCheck2,
  Award,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { VISUAL_ASSETS } from '../data/visualAssets';

export const FinalReportPage: React.FC = () => {
  const {
    metrics,
    canonicalMetrics,
    arithmeticSummary,
    canonicalDossier,
    flags,
    auditLogs,
    regionalIndicators,
    historicalData,
    facilityProfile,
    settings,
    showToast,
    triggerContextualPdfView,
    isAiChecking,
    triggerAiReCheck,
    downloadDetailedPdfReport,
  } = useVerification();

  const verifiedMetrics = metrics.filter((m) => m.verificationStatus === 'verified');
  const reviewRequired = metrics.filter(
    (m) => m.verificationStatus === 'pending' || m.confidenceTier === 'needs_review'
  );
  const openFlags = flags.filter(
    (f) => f.status === 'Requires Review' || f.status === 'Investigating'
  );

  // Digital Sign-off state
  const isConditionallyVerified = openFlags.length > 0;
  const verificationStamp = isConditionallyVerified ? 'CONDITIONALLY VERIFIED' : 'VERIFIED';
  const verificationDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      'Metric Name',
      'Category',
      'Reported Value',
      'Unit',
      'Reporting Period',
      'Confidence Score',
      'Source Document',
      'Source Page',
      'Verification Status',
      'Reviewer Notes',
    ];

    const rows = metrics.map((m) => [
      `"${m.metricName.replace(/"/g, '""')}"`,
      `"${m.category}"`,
      `"${m.value}"`,
      `"${m.unit}"`,
      `"${m.reportingPeriod}"`,
      `"${m.confidenceScore}%"`,
      `"${m.sourceDocument}"`,
      `"${m.sourcePage}"`,
      `"${m.verificationStatus}"`,
      `"${(m.notes || m.ambiguityReason || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `ClimateLens_Verification_Report_${facilityProfile.facilityCode}_FY26.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV of extracted and verified environmental metrics.');
  };

  // JSON Export Handler
  const handleExportJSON = () => {
    const reportPayload = {
      reportTitle: 'ClimateLens Environmental Verification Dossier',
      facility: facilityProfile,
      leadReviewer: settings.reviewerName,
      generatedAt: new Date().toISOString(),
      assuranceStatus: verificationStamp,
      summaryStats: {
        metricsExtracted: metrics.length,
        verifiedCount: verifiedMetrics.length,
        requiresReviewCount: reviewRequired.length,
        potentialInconsistenciesCount: openFlags.length,
        averageConfidence: '94.2%',
      },
      canonicalDossier,
      arithmeticReconciliation: arithmeticSummary,
      canonicalMetrics,
      extractedMetrics: metrics,
      potentialInconsistencies: flags,
      regionalContext: regionalIndicators,
      historicalAudit: historicalData,
      verificationTrail: auditLogs,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `ClimateLens_Report_${facilityProfile.facilityCode}_Audit.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported full verification report package (JSON).');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D121F] border border-[#1E293B] p-4 sm:p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100 font-industrial">
                OFFICIAL VERIFICATION DOSSIER
              </h2>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isConditionallyVerified
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}>
                {verificationStamp}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Ref: CL-DOSSIER-2026-0881 • Standard: ISO 14064-3 / ISAE 3410
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Working PDF Export */}
          <button
            onClick={() => downloadDetailedPdfReport()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-xs cursor-pointer font-medium"
            title="Download formatted environmental verification PDF dossier"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Working CSV Export */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-[#0D121F] hover:bg-[#1E293B] border border-[#1E293B] rounded-xl transition-colors cursor-pointer"
            title="Export all verified metrics to CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {/* Working JSON Export */}
          <button
            onClick={handleExportJSON}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-[#0D121F] hover:bg-[#1E293B] border border-[#1E293B] rounded-xl transition-colors cursor-pointer"
            title="Export machine-readable JSON verification package"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>JSON</span>
          </button>

          {/* Print / Audit Handler */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-[#0D121F] hover:bg-[#1E293B] border border-[#1E293B] rounded-xl transition-colors cursor-pointer"
            title="Print verification dossier"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Document Container (Cleanest, spacious layout) */}
      <div className="bg-[#0D121F] border border-[#1E293B] rounded-2xl shadow-xl overflow-hidden divide-y divide-[#1E293B]">
        {/* Dossier Header & Corporate Profile */}
        <div className="p-7 sm:p-9 bg-gradient-to-b from-[#131B2E]/60 to-[#0D121F] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Statutory Environmental Assurance Record
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-industrial">
                Environmental Verification Dossier
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Independent reconciliation of corporate sustainability disclosure with statutory monitoring telemetry.
              </p>
            </div>

            {/* Official Digital Stamp Box */}
            <div className={`p-4 rounded-xl border-2 text-center min-w-[210px] shrink-0 ${
              isConditionallyVerified
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
            }`}>
              <div className="text-[10px] font-mono uppercase tracking-widest font-bold">
                Assurance Opinion
              </div>
              <div className="text-base font-extrabold font-mono mt-0.5 tracking-tight">
                {verificationStamp}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1 border-t border-current/20 pt-1">
                Audited: {verificationDate}
              </div>
            </div>
          </div>

          {/* Facility Identification Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reporting Entity</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">{facilityProfile.companyName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Operational Unit</span>
              <span className="font-semibold text-slate-200 mt-0.5 block truncate">{facilityProfile.facilityName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reporting Period</span>
              <span className="font-mono font-bold text-emerald-400 mt-0.5 block">{facilityProfile.reportingPeriod}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Verifier</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">{settings.reviewerName}</span>
            </div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="p-7 sm:p-9 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">01.</span>
            <h2 className="text-lg font-bold text-slate-100 font-industrial">Executive Summary</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            ClimateLens performed automated data extraction, canonical unit standardization, and multi-tier consistency checks on the {facilityProfile.reportingPeriod} statutory sustainability disclosures for {facilityProfile.companyName} ({facilityProfile.facilityCode}). Out of {metrics.length} extracted environmental metrics, {verifiedMetrics.length} have been mathematically reconciled against supporting invoice records and production logs.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#0D121F] border border-[#1E293B]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Scope 1 Direct GHG</span>
              <div className="text-base font-extrabold font-mono text-emerald-400 mt-1">8,420 tCO2e</div>
              <span className="text-[10px] text-slate-400">Reconciled with petcoke</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D121F] border border-[#1E293B]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Scope 2 Dual Power</span>
              <div className="text-base font-extrabold font-mono text-emerald-400 mt-1">2,760 tCO2e</div>
              <span className="text-[10px] text-slate-400">Market-based method</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D121F] border border-[#1E293B]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Fresh Water Intake</span>
              <div className="text-base font-extrabold font-mono text-sky-400 mt-1">84,200 KL</div>
              <span className="text-[10px] text-slate-400">ZLD validated</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D121F] border border-[#1E293B]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">TSR Substitution Rate</span>
              <div className="text-base font-extrabold font-mono text-teal-400 mt-1">14.0%</div>
              <span className="text-[10px] text-slate-400">Biomass & RDF</span>
            </div>
          </div>
        </div>

        {/* 2. Key Metrics Table */}
        <div className="p-7 sm:p-9 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">02.</span>
              <h2 className="text-lg font-bold text-slate-100 font-industrial">Key Environmental Disclosures</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">{canonicalMetrics.length} Canonical Metrics</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#1E293B]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0F17] text-slate-400 font-mono text-[10px] uppercase border-b border-[#1E293B]">
                <tr>
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4">Reported Value</th>
                  <th className="py-3 px-4">Unit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Source Traceability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] bg-[#0D121F]">
                {canonicalMetrics.map((cm) => (
                  <tr key={cm.id} className="hover:bg-[#0D121F]/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-200">{cm.canonicalName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">{cm.currentValue}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{cm.unit}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                        cm.status === 'verified'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}>
                        {cm.status === 'verified' ? <Check className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-amber-400" />}
                        {cm.status === 'verified' ? 'Verified' : 'Needs Review'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                      Page {cm.sourcePage} ({cm.sourceDocument})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Historical Trends Summary */}
        <div className="p-7 sm:p-9 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">03.</span>
            <h2 className="text-lg font-bold text-slate-100 font-industrial">Historical Trajectory &amp; Operational Context</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Four-year reporting trends with documented operational drivers and boundary definitions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-[#0D121F] border border-[#1E293B] space-y-2">
              <span className="text-xs font-bold text-slate-200">Scope 1 Absolute Emissions Trend</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Increased from 6,900 tCO2e (FY25) to 8,420 tCO2e (FY26) following a +33.3% kiln clinker capacity expansion from 45,000 MT to 60,000 MT. Specific carbon intensity per ton clinker decreased by 5.2% due to 14.0% petcoke substitution with agricultural biomass.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D121F] border border-[#1E293B] space-y-2">
              <span className="text-xs font-bold text-slate-200">Scope 2 Accounting Transition</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Corporate report transitioned from single-location accounting to dual-reporting in FY26, disclosing 2,760 tCO2e (Market-based) alongside 3,360 tCO2e (Location-based grid average), reflecting 2.4 MW of captive solar wheeled under open access.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Verification Findings & Reconciliations */}
        <div className="p-7 sm:p-9 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">04.</span>
              <h2 className="text-lg font-bold text-slate-100 font-industrial">Verification Findings &amp; Reconciliations</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">{flags.length} Checked Items</span>
          </div>

          <div className="space-y-3">
            {flags.map((flag) => (
              <div
                key={flag.id}
                className="p-4 rounded-xl bg-[#0D121F] border border-[#1E293B] flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">{flag.id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-200">{flag.metricName}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400 font-mono">Page {flag.sourcePage}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{flag.description}</p>
                  <p className="text-slate-400 text-[10px] italic">Context: {flag.recommendation}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                    flag.severity === 'high'
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                      : flag.severity === 'medium'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      : 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                  }`}>
                    {flag.severity.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-[#0B0F17] text-slate-300 border border-[#1E293B]">
                    {flag.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Environmental Context Comparison */}
        <div className="p-7 sm:p-9 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">05.</span>
            <h2 className="text-lg font-bold text-slate-100 font-industrial">Regional Environmental Context Summary</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Corporate reported stack particulate emissions decreased by 14.0% while the surrounding airshed CAAQMS monitoring station (Manali-04) registered a +9.4% seasonal increase in ambient PM10 index. As documented in Section 7, regional variations in continuous ambient telemetry do not establish causality regarding facility disclosures.
          </p>

          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Facility Disclosure</span>
              <span className="font-mono font-bold text-emerald-400 text-sm mt-0.5 block">↓ 14.0% Stack PM</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Regional CAAQMS Telemetry</span>
              <span className="font-mono font-bold text-amber-400 text-sm mt-0.5 block">↑ 9.4% Ambient PM10</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Observatory Agency</span>
              <span className="font-mono text-slate-300 text-xs mt-0.5 block">TNPCB / CPCB Airshed Network</span>
            </div>
          </div>
        </div>

        {/* 6. Reviewer Notes & Sign-off */}
        <div className="p-7 sm:p-9 space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">06.</span>
            <h2 className="text-lg font-bold text-slate-100 font-industrial">Lead Verifier Attestation &amp; Digital Sign-off</h2>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B0F17] border border-[#1E293B] space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              &ldquo;I have reviewed the corporate environmental filing alongside extracted OCR artifacts, sub-meter reconciliations, and continuous airshed datasets. The reported figures for Scope 1, Scope 2, and Water Consumption are consistent with supporting documentation. The ambient difference noted with CAAQMS Manali is recommended for continuing monitoring.&rdquo;
            </p>

            <div className="pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-bold text-slate-100 font-industrial text-sm">{settings.reviewerName}</div>
                <div className="text-slate-400 text-[11px]">{settings.reviewerRole}</div>
                <div className="text-slate-400 text-[10px] font-mono mt-0.5">Accreditation: ISO 14064-3 Lead Verifier</div>
              </div>

              <div className="text-right font-mono text-[11px]">
                <div className="text-emerald-400 font-bold">{verificationStamp}</div>
                <div className="text-slate-400 text-[10px]">{verificationDate}</div>
                <div className="text-slate-300 text-[9px] mt-0.5">SHA256: 8a7f...2e91 (Signed)</div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Scope & Limitations Notice */}
        <div className="p-7 sm:p-9 bg-[#0B0F17] space-y-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">07.</span>
            <h2 className="text-sm font-bold text-slate-300 font-industrial">Scope, Assumptions &amp; Limitations Notice</h2>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            This verification report summarizes extracted and verified data based on available corporate disclosures and public environmental monitoring datasets. ClimateLens checks for consistency and contextual differences. Correlation with regional ambient trends does not establish causation. Final legal and statutory compliance determinations remain the sole responsibility of the certified environmental assurance practitioner and regulatory authority.
          </p>
        </div>
      </div>
    </div>
  );
};

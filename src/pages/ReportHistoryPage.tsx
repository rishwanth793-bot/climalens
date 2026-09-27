import React from 'react';
import {
  History,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Building2,
  Download,
  ShieldCheck,
  Search,
  Eye,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { ReportItem } from '../types';
import { VISUAL_ASSETS } from '../data/visualAssets';

export const ReportHistoryPage: React.FC = () => {
  const { reports, setActiveView, consolidateUnitReports, showToast, triggerContextualPdfView } = useVerification();

  const getStatusBadge = (status: ReportItem['status']) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Requires Review':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Completed':
        return 'bg-slate-100 text-slate-200 border-[#1E293B]';
      case 'Processing':
        return 'bg-sky-50 text-sky-800 border-sky-200 animate-pulse';
      default:
        return 'bg-slate-100 text-slate-200 border-[#1E293B]';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Document Archive & Sub-Units
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Corporate & Unit Report History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Audit trail of ingested sustainability reports, unit environmental sub-disclosures, and historical comparisons.
          </p>
        </div>

        <button
          onClick={consolidateUnitReports}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 shadow-2xs transition-colors cursor-pointer"
        >
          <Layers className="w-4 h-4 text-sky-600" />
          <span>Consolidate 3 Sub-Unit Reports</span>
        </button>
      </div>

      {/* Visual Sub-Unit Processing Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-sky-50 border border-[#1E293B]/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-[#1E293B] flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
            <img src={VISUAL_ASSETS.dataAnalytics} alt="Analytics" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Multi-Unit Report Harmonization</h4>
            <p className="text-xs text-slate-400">
              ClimateLens automatically aggregates separate unit disclosures (Kiln operations, Clinker cooling, and captive solar) into a unified enterprise ESG profile.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white border border-emerald-200 px-3 py-1.5 rounded-lg shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> 3 Units Reconciled
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-[#1E293B]/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-[#1E293B] text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Report & Document Name</th>
                <th className="py-3 px-3">Organization</th>
                <th className="py-3 px-3">Facility</th>
                <th className="py-3 px-3">Period</th>
                <th className="py-3 px-3">Ingested</th>
                <th className="py-3 px-3 text-center">Metrics</th>
                <th className="py-3 px-3 text-center">Flags</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{report.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{report.fileName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-200 font-medium">{report.companyName}</td>
                  <td className="py-3.5 px-3 text-slate-300">{report.facilityName}</td>
                  <td className="py-3.5 px-3 text-slate-300 font-mono">{report.reportingPeriod}</td>
                  <td className="py-3.5 px-3 text-slate-400">{report.uploadedAt}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-100">
                    {report.detectedMetricsCount}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {report.flagsCount > 0 ? (
                      <span className="inline-flex items-center gap-1 font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        {report.flagsCount}
                      </span>
                    ) : (
                      <span className="font-mono text-slate-400">0</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                        report.status
                      )}`}
                    >
                      {report.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          triggerContextualPdfView(null, 1);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
                        title="Inspect source PDF document"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-600" />
                        <span>Inspect PDF</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveView('extraction');
                          showToast(`Loaded ${report.title} extracted data.`);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        title="View Extracted Metrics"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveView('final-report');
                          showToast(`Opened verification audit for ${report.title}.`);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-50 hover:bg-slate-100 border border-[#1E293B] rounded-lg transition-colors cursor-pointer"
                      >
                        Audit Dossier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

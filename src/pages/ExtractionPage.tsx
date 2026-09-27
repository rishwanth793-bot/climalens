import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flag,
  Edit3,
  Check,
  Info,
  Layers,
  ArrowRight,
  FileText,
  Columns,
  Table as TableIcon,
  Eye,
  Sparkles,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { EnvironmentalMetric, MetricCategory } from '../types';
import { PDFDocumentViewer } from '../components/PDFDocumentViewer';

export const ExtractionPage: React.FC = () => {
  const {
    metrics,
    selectedSourceMetric,
    setSelectedSourceMetric,
    verifyMetric,
    flagMetric,
    setAdjustingMetric,
    setActiveView,
    activePdfPage,
    setActivePdfPage,
    facilityProfile,
    showToast,
  } = useVerification();

  const [searchQuery, setSearchQuery] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | 'high' | 'medium' | 'needs_review'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewLayout, setViewLayout] = useState<'split' | 'table_only' | 'pdf_only'>('split');

  // Currently focused metric for PDF highlight sync
  const [focusedMetric, setFocusedMetric] = useState<EnvironmentalMetric | null>(
    metrics.find((m) => m.metricName.includes('Scope 1')) || metrics[0] || null
  );

  const filteredMetrics = useMemo(() => {
    return metrics.filter((m) => {
      // Confidence filter
      if (confidenceFilter === 'high' && m.confidenceScore < 90) return false;
      if (confidenceFilter === 'medium' && (m.confidenceScore < 75 || m.confidenceScore >= 90)) return false;
      if (confidenceFilter === 'needs_review' && m.confidenceScore >= 75) return false;

      // Category filter
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.metricName.toLowerCase().includes(q) ||
          m.unit.toLowerCase().includes(q) ||
          m.sourceSection.toLowerCase().includes(q) ||
          String(m.sourcePage).includes(q)
        );
      }
      return true;
    });
  }, [metrics, confidenceFilter, categoryFilter, searchQuery]);

  const categories = ['all', 'Emissions', 'Energy', 'Water', 'Waste', 'Production', 'Intensity'];

  const handleMetricRowClick = (metric: EnvironmentalMetric) => {
    setFocusedMetric(metric);
    setActivePdfPage(metric.sourcePage);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            AI Traceability Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            AI Environmental Data Extraction
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Side-by-side verification: Source PDF document on the left, standardized tabular metrics on the right.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs text-xs font-semibold">
            <button
              onClick={() => setViewLayout('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewLayout === 'split'
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split (PDF + Metrics)</span>
            </button>
            <button
              onClick={() => setViewLayout('table_only')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewLayout === 'table_only'
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Metrics Table Only</span>
            </button>
            <button
              onClick={() => setViewLayout('pdf_only')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewLayout === 'pdf_only'
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Source PDF Only</span>
            </button>
          </div>

          <button
            onClick={() => setActiveView('verification')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <span>Proceed to Consistency Checks</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Extracted Metrics
          </span>
          <span className="text-xl font-extrabold font-mono text-slate-900 block mt-0.5">
            {metrics.length}
          </span>
          <span className="text-[10px] text-slate-400">Standardized across GHG scopes</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">
            High Confidence (&gt;90%)
          </span>
          <span className="text-xl font-extrabold font-mono text-emerald-700 block mt-0.5">
            {metrics.filter((m) => m.confidenceScore >= 90).length}
          </span>
          <span className="text-[10px] text-emerald-600">Exact OCR tabular extraction</span>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">
            Requires Review (&lt;75%)
          </span>
          <span className="text-xl font-extrabold font-mono text-amber-700 block mt-0.5">
            {metrics.filter((m) => m.confidenceScore < 75).length}
          </span>
          <span className="text-[10px] text-amber-600">Footnotes / Ambiguous units</span>
        </div>

        <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200">
          <span className="text-[10px] uppercase font-bold text-sky-800 block">
            Active PDF Source Page
          </span>
          <span className="text-xl font-extrabold font-mono text-sky-700 block mt-0.5">
            Page {activePdfPage} of 28
          </span>
          <span className="text-[10px] text-sky-600">Click any row to jump</span>
        </div>
      </div>

      {/* Main Split Layout: Left = PDF Viewer, Right = Extracted Metrics Table */}
      <div
        className={`grid gap-6 ${
          viewLayout === 'split'
            ? 'grid-cols-1 lg:grid-cols-12'
            : 'grid-cols-1'
        }`}
      >
        {/* Left Column: PDF Document Viewer */}
        {(viewLayout === 'split' || viewLayout === 'pdf_only') && (
          <div className={`${viewLayout === 'split' ? 'lg:col-span-6 xl:col-span-6' : 'w-full'}`}>
            <PDFDocumentViewer
              highlightMetric={focusedMetric}
              onSelectMetric={(m) => setFocusedMetric(m)}
            />
          </div>
        )}

        {/* Right Column: Extracted Metrics Table with Filters */}
        {(viewLayout === 'split' || viewLayout === 'table_only') && (
          <div
            className={`space-y-4 ${
              viewLayout === 'split' ? 'lg:col-span-6 xl:col-span-6' : 'w-full'
            }`}
          >
            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search metric, unit, page number..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>

                {/* Confidence filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setConfidenceFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      confidenceFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setConfidenceFilter('high')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      confidenceFilter === 'high'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    &gt;90%
                  </button>
                  <button
                    onClick={() => setConfidenceFilter('needs_review')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      confidenceFilter === 'needs_review'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Needs Review
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1 scrollbar-none">
                <span className="text-slate-400 font-mono uppercase text-[10px] shrink-0">
                  Category:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics List / Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                <div className="font-bold text-slate-800">
                  Showing {filteredMetrics.length} of {metrics.length} Disclosed Metrics
                </div>
                <div className="text-[11px] text-slate-500">
                  Tip: Click any row to jump PDF to source page
                </div>
              </div>

              <div className="divide-y divide-slate-100 max-h-[680px] overflow-y-auto">
                {filteredMetrics.map((metric) => {
                  const isSelected = focusedMetric?.id === metric.id;
                  return (
                    <div
                      key={metric.id}
                      onClick={() => handleMetricRowClick(metric)}
                      className={`p-3.5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-50/50 border-l-4 border-emerald-600 shadow-2xs'
                          : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                      }`}
                    >
                      {/* Metric Name and Value */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs truncate">
                            {metric.metricName}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                            {metric.category}
                          </span>
                          {metric.verificationStatus === 'verified' && (
                            <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5 shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                          )}
                        </div>

                        {/* Value and Source Badge */}
                        <div className="flex flex-wrap items-center gap-2.5 text-xs">
                          {metric.value === 'Not disclosed in source' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 font-mono text-xs font-semibold border border-amber-200">
                              <Info className="w-3.5 h-3.5 text-amber-600" />
                              Not disclosed in source
                            </span>
                          ) : (
                            <div className="font-mono font-black text-slate-900 text-sm">
                              {metric.value}{' '}
                              <span className="font-normal text-xs text-slate-500 font-sans">
                                {metric.unit}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <span>•</span>
                            <span className="font-mono font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Page {metric.sourcePage}
                            </span>
                            <span className="text-slate-400 truncate max-w-[160px]">
                              {metric.sourceSection}
                            </span>
                          </div>
                        </div>

                        {/* Snippet / Footnote */}
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                          "{metric.sourceSnippet}"
                        </p>
                      </div>

                      {/* Right side: Confidence, View in PDF, Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {/* Confidence score pill */}
                        <div className="text-right">
                          <span
                            className={`inline-block font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                              metric.confidenceScore >= 90
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : metric.confidenceScore >= 75
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {metric.confidenceScore}%
                          </span>
                        </div>

                        {/* Locate in PDF button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMetricRowClick(metric);
                            showToast(`Navigated PDF to Page ${metric.sourcePage} for ${metric.metricName}.`);
                          }}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                          title={`Jump to Page ${metric.sourcePage}`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Modal Inspector button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSourceMetric(metric);
                          }}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                          title="Open Full Traceability Modal"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Verify button */}
                        {metric.verificationStatus !== 'verified' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              verifyMetric(metric.id);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                            title="Confirm & Verify Metric"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

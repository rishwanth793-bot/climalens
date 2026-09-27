import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Columns,
  Table as TableIcon,
  Eye,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  CornerDownRight,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Hash,
  Database,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { EnvironmentalMetric } from '../types';
import { PDFDocumentViewer } from '../components/PDFDocumentViewer';

export const RawDataPage: React.FC = () => {
  const {
    metrics,
    setSelectedSourceMetric,
    verifyMetric,
    flagMetric,
    setActiveView,
    activePdfPage,
    setActivePdfPage,
    facilityProfile,
    showToast,
  } = useVerification();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScope, setSelectedScope] = useState<string>('all');
  const [selectedTable, setSelectedTable] = useState<string>('all');
  const [viewLayout, setViewLayout] = useState<'split' | 'matrix_only' | 'pdf_only'>('split');
  const [expandedFootnotes, setExpandedFootnotes] = useState<Record<string, boolean>>({
    'fn-01': true,
    'fn-02': false,
    'fn-03': false,
  });

  const [focusedMetric, setFocusedMetric] = useState<EnvironmentalMetric | null>(
    metrics.find((m) => m.metricName.includes('Scope 1')) || metrics[0] || null
  );

  const toggleFootnote = (fnId: string) => {
    setExpandedFootnotes((prev) => ({ ...prev, [fnId]: !prev[fnId] }));
  };

  const filteredMetrics = useMemo(() => {
    return metrics.filter((m) => {
      if (selectedScope !== 'all' && m.category !== selectedScope) return false;
      if (selectedTable !== 'all' && m.tableReference && !m.tableReference.includes(selectedTable)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.metricName.toLowerCase().includes(q) ||
          m.unit.toLowerCase().includes(q) ||
          m.sourceSection.toLowerCase().includes(q) ||
          String(m.sourcePage).includes(q) ||
          (m.sourceSnippet && m.sourceSnippet.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [metrics, selectedScope, selectedTable, searchQuery]);

  const handleMetricSelect = (metric: EnvironmentalMetric) => {
    setFocusedMetric(metric);
    setActivePdfPage(metric.sourcePage);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Dense Raw Report Header Banner */}
      <div className="p-6 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/80">
                Intentionally Dense Area · Raw Report Intake
              </span>
              <span className="text-slate-500 font-mono text-xs">•</span>
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                SAMPLE REPORT / DEMO DATA (FICTIONAL FACILITY)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-industrial">
              RAW REPORT
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Complex environmental information extracted from the source corporate report. Demonstrates the unstructured tables, varied units, dispersed footnotes, and reporting boundary overlaps found in corporate disclosures.
            </p>
          </div>

          {/* Action button to proceed to Transformation & Clean Data */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="inline-flex items-center bg-[#0B0F17] border border-[#1E293B] rounded-xl p-1 text-xs font-semibold">
              <button
                onClick={() => setViewLayout('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewLayout === 'split'
                    ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
              <button
                onClick={() => setViewLayout('matrix_only')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewLayout === 'matrix_only'
                    ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Raw Table</span>
              </button>
              <button
                onClick={() => setViewLayout('pdf_only')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewLayout === 'pdf_only'
                    ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Source PDF</span>
              </button>
            </div>

            <button
              onClick={() => setActiveView('clean-data')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0F17] bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-xs cursor-pointer font-industrial"
            >
              <span>View Cleaned Dataset</span>
              <ArrowRight className="w-4 h-4 text-[#0B0F17]" />
            </button>
          </div>
        </div>

        {/* 4-Item Dense Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#1E293B]">
          <div className="p-3 rounded-xl bg-[#0B0F17]/70 border border-[#1E293B]/90">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Source Report Size</span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 block">184 Pages</span>
            <span className="text-[10px] text-slate-400 font-mono">Integrated ESG Filing (PDF)</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0B0F17]/70 border border-[#1E293B]/90">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Total Data Points</span>
            <span className="text-xl font-bold font-mono text-sky-400 mt-0.5 block">1,248 Data Points</span>
            <span className="text-[10px] text-slate-400 font-mono">Narratives, Footnotes, Logs</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0B0F17]/70 border border-[#1E293B]/90">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Extracted Tables</span>
            <span className="text-xl font-bold font-mono text-amber-400 mt-0.5 block">37 Tables</span>
            <span className="text-[10px] text-slate-400 font-mono">Unstructured Tabular Layouts</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0B0F17]/70 border border-[#1E293B]/90">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Environmental Values</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">96 Disclosures</span>
            <span className="text-[10px] text-slate-400 font-mono">Energy, Water, GHG, Waste</span>
          </div>
        </div>
      </div>

      {/* The Visual Transformation Pipeline Banner */}
      <div className="p-4 rounded-xl bg-[#0E1524] border border-[#1E293B] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-slate-200">The ClimateLens Transformation:</span>
          <span className="text-slate-400 hidden sm:inline">Raw Report → AI Extraction → Standardization → Data Check → Clean Data</span>
        </div>
        <button
          onClick={() => setActiveView('clean-data')}
          className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
        >
          <span>See Clean Data Table</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Split Layout: Left PDF Viewer, Right Dense Raw Tables */}
      <div
        className={`grid gap-6 ${
          viewLayout === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
        }`}
      >
        {/* Left Column: Source PDF Viewer */}
        {(viewLayout === 'split' || viewLayout === 'pdf_only') && (
          <div className={`${viewLayout === 'split' ? 'lg:col-span-6' : 'w-full'}`}>
            <PDFDocumentViewer
              highlightMetric={focusedMetric}
              onSelectMetric={(m) => setFocusedMetric(m)}
            />
          </div>
        )}

        {/* Right Column: Intentionally Dense Raw Extracted Matrix */}
        {(viewLayout === 'split' || viewLayout === 'matrix_only') && (
          <div className={`space-y-4 ${viewLayout === 'split' ? 'lg:col-span-6' : 'w-full'}`}>
            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search raw disclosure, footnote, table reference..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedScope}
                    onChange={(e) => setSelectedScope(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs text-slate-300 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">All Disclosed Scopes</option>
                    <option value="Emissions">Emissions (Scopes 1, 2, 3)</option>
                    <option value="Energy">Energy (Grid, Solar, Fossil)</option>
                    <option value="Water">Water (Intake, Recycling)</option>
                    <option value="Waste">Waste (Hazardous, Slag)</option>
                    <option value="Production">Production &amp; Output</option>
                  </select>
                </div>
              </div>

              {/* Informative Note about Raw Complexity */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#1E293B]">
                <span className="flex items-center gap-1.5 font-mono">
                  <Hash className="w-3 h-3 text-slate-500" />
                  Showing {filteredMetrics.length} unstandardized data points from Tables 1.1 through 7.2
                </span>
                <span className="text-amber-400 font-mono text-[10px]">
                  Click row to sync PDF source
                </span>
              </div>
            </div>

            {/* Dense Data Matrix List */}
            <div className="rounded-2xl bg-[#111726] border border-[#1E293B] overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-[#0E1524] border-b border-[#1E293B] flex items-center justify-between text-xs">
                <div className="font-bold text-slate-300 font-mono text-[11px] uppercase tracking-wider">
                  Raw Environmental Disclosures Matrix (Unfiltered)
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Includes ambiguous units &amp; boundary notes
                </div>
              </div>

              <div className="divide-y divide-[#1E293B] max-h-[640px] overflow-y-auto">
                {filteredMetrics.map((metric) => {
                  const isSelected = focusedMetric?.id === metric.id;

                  return (
                    <div
                      key={metric.id}
                      onClick={() => handleMetricSelect(metric)}
                      className={`p-3.5 transition-all cursor-pointer text-xs space-y-2 ${
                        isSelected
                          ? 'bg-[#142033] border-l-4 border-emerald-400'
                          : 'hover:bg-[#141B2D] border-l-4 border-transparent'
                      }`}
                    >
                      {/* Metric Name & Category Tag */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs truncate">
                              {metric.metricName}
                            </span>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded bg-[#0B0F17] text-slate-400 border border-[#1E293B] shrink-0">
                              {metric.category}
                            </span>
                            {metric.tableReference && (
                              <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-1.5 py-0.2 rounded border border-sky-800/60 shrink-0">
                                {metric.tableReference}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                            <span className="text-emerald-400 font-bold">Page {metric.sourcePage}</span>
                            <span>•</span>
                            <span className="truncate max-w-[280px]">{metric.sourceSection}</span>
                          </div>
                        </div>

                        {/* Reported Raw Value Pill */}
                        <div className="text-right shrink-0">
                          <div className="font-mono font-extrabold text-sm text-white">
                            {metric.value}{' '}
                            <span className="font-mono text-xs text-slate-400 font-normal">
                              {metric.unit}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                            Conf: <strong className={metric.confidenceScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}>{metric.confidenceScore}%</strong>
                          </div>
                        </div>
                      </div>

                      {/* Dense Raw Excerpt with Footnotes & Boundary Scope */}
                      <div className="p-2.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-[11px] font-mono text-slate-300 leading-relaxed">
                        <span className="text-slate-500 select-none">&ldquo;</span>
                        {metric.sourceSnippet}
                        <span className="text-slate-500 select-none">&rdquo;</span>
                      </div>

                      {/* Technical Footnote / Ambiguity Warning if present */}
                      {metric.ambiguityReason && (
                        <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/60 text-[10px] text-amber-300 flex items-start gap-1.5 leading-snug">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-amber-200">Footnote / Boundary Note: </strong>
                            {metric.ambiguityReason}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-slate-500 font-mono text-[10px]">
                          Period: {metric.reportingPeriod}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMetricSelect(metric);
                              showToast(`Jumped PDF to Page ${metric.sourcePage} for ${metric.metricName}.`);
                            }}
                            className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-mono text-[10px] cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Locate in PDF</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSourceMetric(metric);
                            }}
                            className="text-slate-400 hover:text-white inline-flex items-center gap-1 font-mono text-[10px] cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dense Dispersed Footnotes Section (Typical of real annual reports) */}
            <div className="p-4 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider font-mono text-[10px]">
                  Disclosed Reporting Caveats &amp; Footnotes (Dispersed Across Pages)
                </span>
                <span className="text-[10px] font-mono text-slate-500">3 Footnotes</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-[11px] space-y-1">
                  <div
                    onClick={() => toggleFootnote('fn-01')}
                    className="flex items-center justify-between font-bold text-slate-300 cursor-pointer"
                  >
                    <span>[Note 1] Dual Scope 2 Boundary (Page 22, Footnote 4)</span>
                    {expandedFootnotes['fn-01'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                  {expandedFootnotes['fn-01'] && (
                    <p className="text-slate-400 font-mono text-[10px] leading-relaxed pt-1">
                      Scope 2 location-based factor applied from CEA CO2 Baseline Database v19 (0.71 tCO2e/MWh). Market-based accounting utilizes bilateral captive solar open-access green tariffs via TANGEDCO.
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-[11px] space-y-1">
                  <div
                    onClick={() => toggleFootnote('fn-02')}
                    className="flex items-center justify-between font-bold text-slate-300 cursor-pointer"
                  >
                    <span>[Note 2] Petcoke vs Alternative Fuel Mix (Page 21, Note 2b)</span>
                    {expandedFootnotes['fn-02'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                  {expandedFootnotes['fn-02'] && (
                    <p className="text-slate-400 font-mono text-[10px] leading-relaxed pt-1">
                      Direct calcination stoichiometry includes 14% thermal substitution rate (TSR) with hazardous industrial slag and refuse-derived fuels (RDF) co-processing.
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-[11px] space-y-1">
                  <div
                    onClick={() => toggleFootnote('fn-03')}
                    className="flex items-center justify-between font-bold text-slate-300 cursor-pointer"
                  >
                    <span>[Note 3] Zero Liquid Discharge Boundary (Page 16, Flowsheet Note)</span>
                    {expandedFootnotes['fn-03'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                  {expandedFootnotes['fn-03'] && (
                    <p className="text-slate-400 font-mono text-[10px] leading-relaxed pt-1">
                      Treated effluent from reverse osmosis plant (22,400 KL) recycled into clinker cooling circuit. Zero water discharged beyond perimeter wall boundary.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

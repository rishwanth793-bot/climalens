import React, { useState, useEffect } from 'react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  Search,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { EnvironmentalMetric } from '../types';

interface PDFDocumentViewerProps {
  highlightMetric?: EnvironmentalMetric | null;
  onSelectMetric?: (metric: EnvironmentalMetric) => void;
  compact?: boolean;
}

export const PDFDocumentViewer: React.FC<PDFDocumentViewerProps> = ({
  highlightMetric,
  onSelectMetric,
  compact = false,
}) => {
  const {
    activePdfPage,
    setActivePdfPage,
    uploadedPdfFile,
    uploadedPdfUrl,
    documentBlob,
    documentUrl,
    facilityProfile,
    showToast,
    metrics,
  } = useVerification();

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [viewerMode, setViewerMode] = useState<'interactive' | 'native'>('interactive');

  const activeDocumentUrl = documentUrl || uploadedPdfUrl;

  const totalPages = 28;

  // Sync to metric page when highlightMetric changes
  useEffect(() => {
    if (highlightMetric?.sourcePage) {
      setActivePdfPage(highlightMetric.sourcePage);
    }
  }, [highlightMetric, setActivePdfPage]);

  const handleNextPage = () => {
    if (activePdfPage < totalPages) {
      setActivePdfPage(activePdfPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (activePdfPage > 1) {
      setActivePdfPage(activePdfPage - 1);
    }
  };

  const handleJumpToPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      setActivePdfPage(val);
    }
  };

  // Section bookmark jump
  const sectionBookmarks = [
    { title: 'Cover', page: 1 },
    { title: 'Governance', page: 3 },
    { title: 'Production', page: 4 },
    { title: 'Energy', page: 7 },
    { title: 'Renewables', page: 11 },
    { title: 'Water & ZLD', page: 16 },
    { title: 'Scope 1 Stack', page: 21 },
    { title: 'Scope 2 Power', page: 22 },
    { title: 'Waste Co-Proc', page: 26 },
  ];

  return (
    <div
      className={`bg-[#0D121F] border border-[#1E293B] rounded-2xl flex flex-col shadow-sm transition-all duration-200 overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-[#0D121F]' : 'h-full min-h-[580px]'
      }`}
    >
      {/* Top PDF Controls Toolbar */}
      <div className="bg-[#0B0F17] border-b border-[#1E293B] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Document Identifier */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-200 truncate text-[11px] sm:text-xs">
              {uploadedPdfFile ? uploadedPdfFile.name : 'northstar_environmental_report_FY2025-26.pdf'}
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>PDF 1.7</span>
              <span>•</span>
              <span>2.4 MB</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> OCR Verified
              </span>
            </div>
          </div>
        </div>

        {/* Pager and Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Page Nav */}
          <div className="flex items-center bg-[#0D121F] border border-[#1E293B] rounded-lg p-0.5 shadow-xs">
            <button
              onClick={handlePrevPage}
              disabled={activePdfPage <= 1}
              className="p-1 text-slate-400 hover:text-slate-100 hover:bg-[#1E293B] disabled:opacity-30 disabled:hover:bg-transparent rounded cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="px-1.5 flex items-center gap-1 text-[11px] font-mono text-slate-300">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={activePdfPage}
                onChange={handleJumpToPage}
                className="w-7 text-center font-bold text-slate-100 bg-transparent focus:outline-hidden focus:ring-1 focus:ring-emerald-500 rounded"
              />
              <span className="text-slate-400">/</span>
              <span>{totalPages}</span>
            </div>
            <button
              onClick={handleNextPage}
              disabled={activePdfPage >= totalPages}
              className="p-1 text-slate-400 hover:text-slate-100 hover:bg-[#1E293B] disabled:opacity-30 disabled:hover:bg-transparent rounded cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-[#0D121F] border border-[#1E293B] rounded-lg p-0.5 shadow-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
              className="p-1 text-slate-400 hover:text-slate-100 hover:bg-[#1E293B] rounded cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-medium px-1 text-slate-300">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              className="p-1 text-slate-400 hover:text-slate-100 hover:bg-[#1E293B] rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Native if uploaded */}
          {activeDocumentUrl && (
            <button
              onClick={() => setViewerMode(viewerMode === 'interactive' ? 'native' : 'interactive')}
              className={`px-2 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                viewerMode === 'native'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-[#0D121F] border-[#1E293B] text-slate-400 hover:text-slate-200'
              }`}
            >
              {viewerMode === 'native' ? 'Parsed View' : 'Native PDF'}
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-[#0D121F] border border-[#1E293B] rounded-lg transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Section Bookmarks Bar */}
      <div className="bg-[#0B0F17]/90 border-b border-[#1E293B] px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-1">
          Sections:
        </span>
        {sectionBookmarks.map((b) => (
          <button
            key={b.page}
            onClick={() => setActivePdfPage(b.page)}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-colors shrink-0 cursor-pointer ${
              activePdfPage === b.page
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0D121F]'
            }`}
          >
            {b.title} <span className="text-[9px] opacity-75 font-mono">p.{b.page}</span>
          </button>
        ))}
      </div>

      {/* Active Metric Jump Banner */}
      {highlightMetric && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>
              <strong>Side-by-Side Highlight:</strong> {highlightMetric.metricName} (
              {highlightMetric.value} {highlightMetric.unit}) on Page {highlightMetric.sourcePage}
            </span>
          </div>
          <span className="text-[10px] font-mono bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full text-amber-300 font-bold">
            {highlightMetric.confidenceScore}% Confidence
          </span>
        </div>
      )}

      {/* Main Document Content Canvas */}
      <div className="flex-1 bg-slate-200/70 p-4 sm:p-6 overflow-auto flex justify-center">
        {viewerMode === 'native' && activeDocumentUrl ? (
          <iframe
            src={`${activeDocumentUrl}#page=${activePdfPage}`}
            title="Source PDF Document"
            className="w-full h-full min-h-[500px] border border-slate-300 rounded-lg shadow-xl bg-white"
          />
        ) : (
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-[750px] min-h-[850px] bg-white rounded-lg shadow-xl border border-slate-300 p-8 sm:p-12 text-slate-100 transition-transform duration-150 flex flex-col justify-between"
          >
            {/* Render Content Based on Active Page */}
            {activePdfPage === 1 && (
              <div className="space-y-8 flex-1 flex flex-col justify-between">
                <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
                  <div>
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                      Corporate Sustainability Disclosure Series
                    </div>
                    <h1 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
                      NORTHSTAR CEMENT INDUSTRIES
                    </h1>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Chennai Industrial Zone, Tamil Nadu • Corporate CIN: L26942TN1995PLC031400
                    </p>
                  </div>
                  <div className="border border-slate-300 px-3 py-1.5 rounded text-right bg-slate-50 font-mono text-[10px]">
                    <div>DOC REF: NSTAR-ENV-2026</div>
                    <div className="text-emerald-700 font-bold">STATUS: PUBLISHED</div>
                  </div>
                </div>

                <div className="my-auto space-y-4 py-8 text-center">
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200 mb-2">
                    SEBI BRSR Core &amp; ISO 14064-1 Compliant
                  </div>
                  <h2 className="text-3xl font-extrabold text-white">
                    Annual Environmental &amp; GHG Inventory Report
                  </h2>
                  <p className="text-sm text-slate-300 font-mono">
                    Financial Reporting Period: 1 April 2025 – 31 March 2026 (FY 2025–26)
                  </p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto pt-2">
                    Comprehensive reporting of stationary combustion (Scope 1), purchased grid electricity (Scope 2), process water balance, captive solar generation, and co-processed alternative fuels.
                  </p>
                </div>

                <div className="border-t border-[#1E293B] pt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Facility: Northstar Unit 1 (Chennai)</span>
                  <span>Clinker Capacity: 420,000 TPA</span>
                  <span>Page 1 of 28</span>
                </div>
              </div>
            )}

            {activePdfPage === 4 && (
              <div className="space-y-6 flex-1">
                <div className="border-b border-[#1E293B] pb-3 flex justify-between text-xs text-slate-400 font-mono">
                  <span>SECTION 2: FACILITY PROFILE &amp; PRODUCTION</span>
                  <span>PAGE 4</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">2.1 Operational Clinker &amp; Cement Production</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    The Chennai manufacturing facility operates a 6-stage preheater rotary kiln line equipped with inline calciner and waste heat recovery power generation system (WHRB).
                  </p>
                </div>

                <div className="border border-slate-300 rounded-lg overflow-hidden my-4">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 border-b border-slate-300 text-slate-200 font-bold">
                      <tr>
                        <th className="py-2 px-3 text-left">Production Parameter</th>
                        <th className="py-2 px-3 text-right">FY 2024–25</th>
                        <th className="py-2 px-3 text-right">FY 2025–26 (Current)</th>
                        <th className="py-2 px-3 text-left">Measurement Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-white">
                        <td className="py-2 px-3 font-medium">Clinker Production</td>
                        <td className="py-2 px-3 text-right font-mono">310,000 tonnes</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-white">328,000 tonnes</td>
                        <td className="py-2 px-3 text-slate-400">Weigh-feeder telemetry</td>
                      </tr>
                      <tr className="bg-emerald-50/50">
                        <td className="py-2 px-3 font-semibold text-emerald-950">Finished Cement Dispatched</td>
                        <td className="py-2 px-3 text-right font-mono">395,000 tonnes</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-800">420,000 tonnes</td>
                        <td className="py-2 px-3 text-slate-400">Automated packing plant loadcells</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-2 px-3 font-medium">Kiln Operating Days</td>
                        <td className="py-2 px-3 text-right font-mono">312 days</td>
                        <td className="py-2 px-3 text-right font-mono">324 days</td>
                        <td className="py-2 px-3 text-slate-400">DCS logbook record</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-[#1E293B] text-xs text-slate-300">
                  <strong>Footnote 2.1:</strong> Capacity utilization averaged 94.2% across the reporting fiscal year following the scheduled maintenance turnaround in September 2025.
                </div>
              </div>
            )}

            {activePdfPage === 7 && (
              <div className="space-y-6 flex-1">
                <div className="border-b border-[#1E293B] pb-3 flex justify-between text-xs text-slate-400 font-mono">
                  <span>SECTION 3: ENERGY BALANCE &amp; ELECTRICITY</span>
                  <span>PAGE 7</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">3.2 Electrical &amp; Thermal Energy Consumption</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Energy audit metrics reconciled across captive substation meters, utility tariff bills (TANGEDCO), and calibrated fuel weigh-feeders.
                  </p>
                </div>

                <div className="border border-slate-300 rounded-lg overflow-hidden my-4">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 border-b border-slate-300 text-slate-200 font-bold">
                      <tr>
                        <th className="py-2 px-3 text-left">Energy Vector</th>
                        <th className="py-2 px-3 text-right">Consumption Value</th>
                        <th className="py-2 px-3 text-left">Unit</th>
                        <th className="py-2 px-3 text-left">Verification Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-sky-50/60 border-l-4 border-sky-600">
                        <td className="py-2.5 px-3 font-bold text-white">Total Facility Energy</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-sky-800">12,450</td>
                        <td className="py-2.5 px-3 font-mono font-semibold">MWh</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-medium">Reconciled with utility bills</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-2 px-3 font-medium">Grid Purchased Electricity</td>
                        <td className="py-2 px-3 text-right font-mono">8,600</td>
                        <td className="py-2 px-3 font-mono">MWh</td>
                        <td className="py-2 px-3 text-slate-300">Substation 110 kV feeder</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-2 px-3 font-medium">Captive Solar Generation</td>
                        <td className="py-2 px-3 text-right font-mono">3,850</td>
                        <td className="py-2 px-3 font-mono">MWh</td>
                        <td className="py-2 px-3 text-slate-300">4.2 MW rooftop string inverters</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activePdfPage === 16 && (
              <div className="space-y-6 flex-1">
                <div className="border-b border-[#1E293B] pb-3 flex justify-between text-xs text-slate-400 font-mono">
                  <span>SECTION 5: WATER RESOURCES &amp; ZERO-EFFLUENT</span>
                  <span>PAGE 16</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">5.1 Freshwater Intake &amp; Effluent Recycling</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Water balance summary verified under TNPCB consent-to-operate parameters.
                  </p>
                </div>

                <div className="border border-slate-300 rounded-lg overflow-hidden my-4">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 border-b border-slate-300 text-slate-200 font-bold">
                      <tr>
                        <th className="py-2 px-3 text-left">Water Stream</th>
                        <th className="py-2 px-3 text-right">Volume</th>
                        <th className="py-2 px-3 text-left">Unit</th>
                        <th className="py-2 px-3 text-left">Source Agency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-emerald-50/60 border-l-4 border-emerald-600">
                        <td className="py-2.5 px-3 font-bold text-white">Freshwater Withdrawal</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">84,200</td>
                        <td className="py-2.5 px-3 font-mono font-semibold">KL</td>
                        <td className="py-2.5 px-3 text-slate-300">SIPCOT Industrial Supply Pipeline</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-2 px-3 font-medium">Cooling Tower Recirculation</td>
                        <td className="py-2 px-3 text-right font-mono">31,400</td>
                        <td className="py-2 px-3 font-mono">KL</td>
                        <td className="py-2 px-3 text-slate-300">Closed-loop filtration plant</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activePdfPage === 21 && (
              <div className="space-y-6 flex-1">
                <div className="border-b border-[#1E293B] pb-3 flex justify-between text-xs text-slate-400 font-mono">
                  <span>SECTION 6: GREENHOUSE GAS EMISSIONS (SCOPE 1)</span>
                  <span>PAGE 21</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">6.1 Direct GHG Emissions (Scope 1) — Stationary Combustion</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Direct stack emissions calculated in accordance with the GHG Protocol Corporate Accounting and Reporting Standard and IPCC 2006 Guidelines for National Greenhouse Gas Inventories.
                  </p>
                </div>

                {/* Highlighted Bounding Box Table on Page 21 */}
                <div className="relative border-2 border-emerald-500 bg-emerald-50/20 rounded-xl p-3 shadow-xs">
                  <div className="absolute -top-3 right-4 bg-emerald-700 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-200" />
                    MATCHED BY AI EXTRACTION (CONFIDENCE: 96%)
                  </div>

                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 border-b border-slate-300 text-slate-200 font-bold">
                      <tr>
                        <th className="py-2 px-3 text-left">Emissions Category</th>
                        <th className="py-2 px-3 text-right">Disclosed Value</th>
                        <th className="py-2 px-3 text-left">Unit</th>
                        <th className="py-2 px-3 text-left">Emission Factors Applied</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-amber-50/70 border-l-4 border-amber-500">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">Direct GHG Emissions (Scope 1)</div>
                          <div className="text-[11px] text-slate-400">Rotary Kiln calcination &amp; fuel firing</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-extrabold text-amber-900 text-sm">
                          8,420
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-200">tCO2e</td>
                        <td className="py-3 px-3 text-slate-300 text-[11px]">
                          Tier 2 Mass-balance calcination factor (0.525 tCO2/t clinker)
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-2 px-3 font-medium">Kiln Calcination Process</td>
                        <td className="py-2 px-3 text-right font-mono">7,150</td>
                        <td className="py-2 px-3 font-mono">tCO2e</td>
                        <td className="py-2 px-3 text-slate-400">Lab XRF CaCO3 stoichiometry</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-2 px-3 font-medium">Fuel Combustion (Petcoke/AFR)</td>
                        <td className="py-2 px-3 text-right font-mono">1,120</td>
                        <td className="py-2 px-3 font-mono">tCO2e</td>
                        <td className="py-2 px-3 text-slate-400">IPCC default NCV &amp; carbon fraction</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-2 px-3 font-medium">Mobile Equipment &amp; Quarry Fleet</td>
                        <td className="py-2 px-3 text-right font-mono">150</td>
                        <td className="py-2 px-3 font-mono">tCO2e</td>
                        <td className="py-2 px-3 text-slate-400">High-speed diesel invoices</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-[#1E293B] text-xs text-slate-300 space-y-1">
                  <div>
                    <strong>Verification Footnote 6.1:</strong> Baseline Scope 1 emissions in FY 2024–25 were reported as 10,250 tCO2e. The current year reduction of 17.9% is attributed to the substitution of petcoke with 14% alternative refuse-derived fuel (RDF) and waste heat recovery.
                  </div>
                  <div className="text-[11px] font-mono text-emerald-800">
                    Source Document Code: NSTAR-ENV-2026-CH • Table 4.2 • Page 21
                  </div>
                </div>
              </div>
            )}

            {activePdfPage === 22 && (
              <div className="space-y-6 flex-1">
                <div className="border-b border-[#1E293B] pb-3 flex justify-between text-xs text-slate-400 font-mono">
                  <span>SECTION 6: GREENHOUSE GAS EMISSIONS (SCOPE 2)</span>
                  <span>PAGE 22</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">6.2 Indirect GHG Emissions (Scope 2) — Purchased Electricity</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Evaluated under market-based and location-based methods per GHG Protocol Scope 2 Guidance.
                  </p>
                </div>

                <div className="border-2 border-emerald-500 bg-emerald-50/10 rounded-xl p-3">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 border-b border-slate-300 text-slate-200 font-bold">
                      <tr>
                        <th className="py-2 px-3 text-left">Accounting Method</th>
                        <th className="py-2 px-3 text-right">Value</th>
                        <th className="py-2 px-3 text-left">Unit</th>
                        <th className="py-2 px-3 text-left">Grid Emission Factor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-sky-50/70 border-l-4 border-sky-600">
                        <td className="py-2.5 px-3 font-bold text-white">
                          Scope 2 (Market-based)
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-sky-800">2,140</td>
                        <td className="py-2.5 px-3 font-mono font-semibold">tCO2e</td>
                        <td className="py-2.5 px-3 text-slate-300">Net of 3,850 MWh captive solar</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-2 px-3 font-medium">Scope 2 (Location-based)</td>
                        <td className="py-2 px-3 text-right font-mono">6,106</td>
                        <td className="py-2 px-3 font-mono">tCO2e</td>
                        <td className="py-2 px-3 text-slate-400">CEA Southern Grid 0.71 kg CO2/kWh</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-amber-900">
                  <strong>Auditor Flag Note:</strong> Disclosed market-based value of 2,140 tCO2e requires verification of contractual REC retirement certificate series to corroborate zero-emission attribute claim.
                </div>
              </div>
            )}

            {activePdfPage === 26 && (
              <div className="space-y-6 flex-1">
                <div className="border-b border-[#1E293B] pb-3 flex justify-between text-xs text-slate-400 font-mono">
                  <span>SECTION 7: CIRCULAR ECONOMY &amp; WASTE CO-PROCESSING</span>
                  <span>PAGE 26</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">7.1 Solid Waste &amp; By-product Utilization</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Fly ash from North Chennai Thermal Power Station and chemical gypsum utilized in blended cement production.
                  </p>
                </div>

                <div className="border border-slate-300 rounded-lg overflow-hidden my-4">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 border-b border-slate-300 text-slate-200 font-bold">
                      <tr>
                        <th className="py-2 px-3 text-left">Waste Stream</th>
                        <th className="py-2 px-3 text-right">Quantity</th>
                        <th className="py-2 px-3 text-left">Unit</th>
                        <th className="py-2 px-3 text-left">Fate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-emerald-50/50">
                        <td className="py-2 px-3 font-bold text-white">Total Waste Generated</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-white">2,840</td>
                        <td className="py-2 px-3 font-mono">tonnes</td>
                        <td className="py-2 px-3 text-emerald-700 font-medium">94.1% Diverted from landfill</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Default page fallback for pages without bespoke text */}
            {![1, 4, 7, 16, 21, 22, 26].includes(activePdfPage) && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="border-b border-[#1E293B] pb-3 flex justify-between text-xs text-slate-400 font-mono">
                  <span>NORTHSTAR CEMENT INDUSTRIES • FY 2025–26 DISCLOSURE</span>
                  <span>PAGE {activePdfPage} OF 28</span>
                </div>

                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-[#1E293B] mx-auto flex items-center justify-center text-slate-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-100">
                    Document Section Page {activePdfPage}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Full page textual stream and structured financial-environmental tables. Use the bookmark bar above or click any metric in the extraction table to jump to verified sections.
                  </p>
                </div>

                <div className="border-t border-[#1E293B] pt-4 flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Report ID: NSTAR-ENV-2026</span>
                  <span>Page {activePdfPage}</span>
                </div>
              </div>
            )}

            {/* Document Footer */}
            <div className="border-t border-[#1E293B] pt-4 mt-6 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Northstar Cement Industries • Chennai Industrial Zone</span>
              <span className="text-emerald-700 font-semibold">ClimateLens Traceability Link: Active</span>
              <span>Page {activePdfPage} of {totalPages}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

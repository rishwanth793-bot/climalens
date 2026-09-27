import React, { useState } from 'react';
import {
  FileText,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Building2,
  MapPin,
  Calendar,
  Globe2,
  Leaf,
  Droplet,
  Flame,
  Zap,
  Eye,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { StatCard } from '../components/StatCard';

export const OverviewPage: React.FC = () => {
  const {
    setActiveView,
    facilityProfile,
    metrics,
    flags,
    historicalData,
    triggerContextualPdfView,
    settings,
    isAiChecking,
    triggerAiReCheck,
    downloadDetailedPdfReport,
    setInvestigatingFlagId,
  } = useVerification();

  const [activeTrendMetric, setActiveTrendMetric] = useState<'emissions' | 'energy' | 'water' | 'waste'>('emissions');

  const openFlags = flags.filter((f) => f.status === 'Requires Review' || f.status === 'Investigating');
  const verifiedCount = metrics.filter((m) => m.verificationStatus === 'verified').length;
  const verifiedPercent = Math.round((verifiedCount / metrics.length) * 100);

  // Trend configurations for the single primary chart
  const trendConfigs = {
    emissions: {
      name: 'Gross GHG Emissions (Scopes 1 & 2)',
      unit: 'tCO2e',
      color: '#10B981',
      dataKey: 'totalEmissions' as const,
      insight: 'Reported emissions increased 22.0% compared with the previous period (8,420 tCO2e Scope 1 vs 6,900 tCO2e baseline).',
      sourcePage: 21,
    },
    energy: {
      name: 'Total Electrical Energy Consumption',
      unit: 'MWh',
      color: '#38BDF8',
      dataKey: 'energyMWh' as const,
      insight: 'Total electrical consumption increased 5.5% YoY (12,450 MWh) alongside a 29.2% expansion in captive solar generation.',
      sourcePage: 7,
    },
    water: {
      name: 'Total Freshwater Intake',
      unit: 'KL',
      color: '#0EA5E9',
      dataKey: 'waterKL' as const,
      insight: 'Freshwater withdrawal decreased 2.7% YoY with 22,400 KL (26.6%) closed-loop zero-liquid discharge effluent recovery.',
      sourcePage: 16,
    },
    waste: {
      name: 'Total Industrial Waste Generated',
      unit: 'tonnes',
      color: '#EC4899',
      dataKey: 'wasteTonnes' as const,
      insight: 'Industrial waste generation increased 3.3% YoY (2,840 tonnes), with 98.4% recycled or co-processed in kiln calcination.',
      sourcePage: 26,
    },
  };

  const currentTrend = trendConfigs[activeTrendMetric];

  // SVG Chart math for the primary chart
  const chartWidth = 720;
  const chartHeight = 240;
  const padding = { top: 30, right: 35, bottom: 40, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const chartValues = historicalData.map((d) => d[currentTrend.dataKey] as number);
  const minVal = Math.min(...chartValues) * 0.88;
  const maxVal = Math.max(...chartValues) * 1.12;

  const getY = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    return chartHeight - padding.bottom - ratio * innerHeight;
  };

  const getX = (index: number) => {
    return padding.left + (index / (historicalData.length - 1)) * innerWidth;
  };

  const trendPathD = historicalData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[currentTrend.dataKey] as number)}`)
    .join(' ');

  const currentMetricVal = chartValues[chartValues.length - 1];
  const prevMetricVal = chartValues[chartValues.length - 2];
  const deltaPercent = (((currentMetricVal - prevMetricVal) / prevMetricVal) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Clean Platform Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/80">
              AI Environmental Verification &amp; Intelligence
            </span>
            <span className="text-slate-600 font-mono text-xs">•</span>
            <span className="text-[10px] font-mono font-semibold text-slate-400">
              SAMPLE REPORT / DEMO DATA (FICTIONAL FACILITY)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-industrial">
            CLIMATELENS OVERVIEW
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Converting complex corporate environmental reports into structured, understandable, and reviewable intelligence.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => triggerAiReCheck()}
            disabled={isAiChecking}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-[#111726] hover:bg-[#182338] border border-[#1E293B] transition-colors cursor-pointer disabled:opacity-50"
            title="Run multi-pass AI re-check"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isAiChecking ? 'animate-spin' : ''}`} />
            <span>{isAiChecking ? 'Auditing...' : 'Run AI Re-Check'}</span>
          </button>

          <button
            onClick={() => triggerContextualPdfView(null, 21)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-[#1E293B] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Inspect Source PDF</span>
          </button>

          <button
            onClick={downloadDetailedPdfReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#0B0F17] bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-xs cursor-pointer font-industrial"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#0B0F17]" />
            <span>Download Dossier</span>
          </button>
        </div>
      </div>

      {/* 1. TOP 4 METRICS ONLY (Exact prompt requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: REPORTS PROCESSED */}
        <div
          onClick={() => setActiveView('history')}
          className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] hover:border-slate-700 transition-all cursor-pointer shadow-sm group"
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            REPORTS PROCESSED
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-1.5 tabular-nums">
            12
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between font-mono">
            <span>1 Corporate + 11 Units</span>
            <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </div>

        {/* Metric 2: DATA POINTS */}
        <div
          onClick={() => setActiveView('raw-data')}
          className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] hover:border-slate-700 transition-all cursor-pointer shadow-sm group"
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            DATA POINTS
          </div>
          <div className="text-3xl font-extrabold font-mono text-sky-400 mt-1.5 tabular-nums">
            1,248
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between font-mono">
            <span>Standardized Scopes</span>
            <span className="text-sky-400 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </div>

        {/* Metric 3: AI CONFIDENCE */}
        <div
          onClick={() => setActiveView('clean-data')}
          className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] hover:border-slate-700 transition-all cursor-pointer shadow-sm group"
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            AI CONFIDENCE
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1.5 tabular-nums">
            94.2%
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between font-mono">
            <span>42 High / 6 Review</span>
            <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </div>

        {/* Metric 4: NEEDS REVIEW */}
        <div
          onClick={() => setActiveView('verification')}
          className="p-5 rounded-2xl bg-[#111726] border border-amber-900/60 hover:border-amber-700 transition-all cursor-pointer shadow-sm group"
        >
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-mono">
            NEEDS REVIEW
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1.5 tabular-nums">
            {openFlags.length}
          </div>
          <div className="text-xs text-amber-300 mt-2 flex items-center justify-between font-mono">
            <span>Potential Inconsistencies</span>
            <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </div>
      </div>

      {/* 2. ONE LARGE PRIMARY ENVIRONMENTAL TREND GRAPH (Exact prompt requirement) */}
      <div className="p-6 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-sm space-y-6">
        {/* Metric Switcher Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">
              Primary Environmental Trend
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {currentTrend.name}
            </h2>
          </div>

          {/* Switcher Buttons: Emissions, Energy, Water, Waste */}
          <div className="inline-flex items-center bg-[#0B0F17] border border-[#1E293B] rounded-xl p-1 text-xs font-semibold">
            {(['emissions', 'energy', 'water', 'waste'] as const).map((key) => {
              const isActive = activeTrendMetric === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTrendMetric(key)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs capitalize transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-[#0B0F17] font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>

        {/* Large SVG Trend Graph */}
        <div className="w-full overflow-x-auto bg-[#0B0F17] p-5 rounded-2xl border border-[#1E293B] flex justify-center">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full max-w-[720px] h-auto overflow-visible select-none"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = chartHeight - padding.bottom - pct * innerHeight;
              const gridVal = minVal + pct * (maxVal - minVal);
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="#1E293B"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 3}
                    fill="#64748B"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {Math.round(gridVal).toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* Shaded Area */}
            <path
              d={`${trendPathD} L ${getX(historicalData.length - 1)} ${
                chartHeight - padding.bottom
              } L ${getX(0)} ${chartHeight - padding.bottom} Z`}
              fill={currentTrend.color}
              fillOpacity="0.08"
            />

            {/* Trend Line */}
            <path
              d={trendPathD}
              fill="none"
              stroke={currentTrend.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {historicalData.map((d, i) => {
              const val = d[currentTrend.dataKey] as number;
              const x = getX(i);
              const y = getY(val);
              const isLatest = i === historicalData.length - 1;

              return (
                <g key={d.period}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isLatest ? '6' : '4.5'}
                    fill="#0B0F17"
                    stroke={currentTrend.color}
                    strokeWidth="2.5"
                  />
                  <text
                    x={x}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    {d.period}
                  </text>
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {val.toLocaleString()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 3. Short AI / Data Insight Below Graph (Exact prompt requirement) */}
        <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block tracking-wider">
              AI Verification Insight
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              &ldquo;{currentTrend.insight}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* 4. VISUAL STORY OF THE TRANSFORMATION ROADMAP */}
      <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">The ClimateLens Transformation</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            From Messy Report To Clear Environmental Data
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          {[
            { step: '01', title: 'Raw Report', desc: 'Dense unstandardized input', view: 'raw-data' as const },
            { step: '02', title: 'AI Extraction', desc: 'Identifies environmental values', view: 'raw-data' as const },
            { step: '03', title: 'Standardization', desc: 'Converts units & taxonomy', view: 'clean-data' as const },
            { step: '04', title: 'Data Check', desc: 'Arithmetic & boundary checks', view: 'verification' as const },
            { step: '05', title: 'Clean Data', desc: 'Structured simple table', view: 'clean-data' as const },
            { step: '06', title: 'Verification', desc: 'Focused potential flags', view: 'verification' as const },
            { step: '07', title: 'Context', desc: 'Regional indicator overlay', view: 'environmental-context' as const },
            { step: '08', title: 'Final Report', desc: 'Clean assurance dossier', view: 'final-report' as const },
          ].map((item, idx) => (
            <button
              key={item.step}
              onClick={() => setActiveView(item.view)}
              className="p-2.5 rounded-xl bg-[#0B0F17] hover:bg-[#182338] border border-[#1E293B] transition-all text-left group cursor-pointer"
            >
              <div className="text-[9px] font-mono text-slate-500 font-bold group-hover:text-emerald-400 transition-colors">
                {item.step}
              </div>
              <div className="text-[11px] font-bold text-slate-200 mt-0.5 truncate">
                {item.title}
              </div>
              <div className="text-[9px] text-slate-500 mt-1 leading-snug truncate">
                {item.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. ONLY THE MOST IMPORTANT REVIEW ITEMS (Exact prompt requirement) */}
      <div className="p-6 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Priority Items Requiring Human Review ({openFlags.length})
            </h3>
          </div>
          <button
            onClick={() => setActiveView('verification')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Open Verification Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {flags.slice(0, 4).map((flag) => (
            <div
              key={flag.id}
              className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] hover:border-slate-700 transition-all text-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                    {flag.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {flag.category}
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-400 text-xs">
                  {flag.variancePercent}
                </span>
              </div>

              <div>
                <div className="font-bold text-white text-xs">
                  {flag.metric}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {flag.explanation}
                </p>
              </div>

              <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  Page {flag.sourcePage} • {flag.status}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerContextualPdfView(null, flag.sourcePage)}
                    className="text-[10px] font-mono text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>p.{flag.sourcePage}</span>
                  </button>

                  <button
                    onClick={() => {
                      setInvestigatingFlagId(flag.id);
                      setActiveView('flags');
                    }}
                    className="text-[10px] font-mono font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

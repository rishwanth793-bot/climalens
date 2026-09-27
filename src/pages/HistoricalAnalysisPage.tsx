import React, { useState } from 'react';
import {
  TrendingUp,
  Filter,
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  Eye,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { HistoricalDataPoint } from '../types';
import { VISUAL_ASSETS } from '../data/visualAssets';

export const HistoricalAnalysisPage: React.FC = () => {
  const { historicalData, facilityProfile, setActiveView, triggerContextualPdfView, settings } = useVerification();

  const [selectedMetric, setSelectedMetric] = useState<keyof HistoricalDataPoint>('scope1');

  const metricConfigs: Record<
    string,
    { label: string; unit: string; category: string; color: string; sourcePage: number }
  > = {
    scope1: { label: 'Scope 1 Direct GHG Emissions', unit: 'tCO2e', category: 'Emissions', color: '#059669', sourcePage: 21 },
    scope2: { label: 'Scope 2 Purchased Power Emissions', unit: 'tCO2e', category: 'Emissions', color: '#0284C7', sourcePage: 22 },
    totalEmissions: { label: 'Total Gross GHG Emissions', unit: 'tCO2e', category: 'Emissions', color: '#7C3AED', sourcePage: 21 },
    energyMWh: { label: 'Total Electrical Energy Consumption', unit: 'MWh', category: 'Energy', color: '#D97706', sourcePage: 7 },
    waterKL: { label: 'Total Freshwater Withdrawal', unit: 'KL', category: 'Water', color: '#0EA5E9', sourcePage: 16 },
    wasteTonnes: { label: 'Total Industrial Waste Generated', unit: 'tonnes', category: 'Waste', color: '#DB2777', sourcePage: 26 },
    productionTonnes: { label: 'Cement Dispatch Output', unit: 'tonnes', category: 'Production', color: '#059669', sourcePage: 4 },
    carbonIntensity: { label: 'Specific Carbon Intensity', unit: 'tCO2e/t cement', category: 'Intensity', color: '#E11D48', sourcePage: 21 },
    renewableShare: { label: 'Renewable Power Share', unit: '%', category: 'Energy', color: '#059669', sourcePage: 11 },
  };

  const currentConfig = metricConfigs[selectedMetric as string] || metricConfigs.scope1;

  // Chart math
  const values = historicalData.map((d) => d[selectedMetric] as number);
  const minVal = Math.min(...values) * 0.9;
  const maxVal = Math.max(...values) * 1.1;

  const chartWidth = 640;
  const chartHeight = 240;
  const padding = { top: 30, right: 30, bottom: 40, left: 55 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const getY = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    return chartHeight - padding.bottom - ratio * innerHeight;
  };

  const getX = (index: number) => {
    return padding.left + (index / (historicalData.length - 1)) * innerWidth;
  };

  // Generate SVG path for line chart
  const pathD = historicalData
    .map((d, i) => {
      const val = d[selectedMetric] as number;
      const x = getX(i);
      const y = getY(val);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Variance between last two periods
  const currentVal = values[values.length - 1];
  const prevVal = values[values.length - 2];
  const deltaPercent = (((currentVal - prevVal) / prevVal) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Visual Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 text-white min-h-[140px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src={VISUAL_ASSETS.facilityCampus}
          alt="Modern Sustainable Campus"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Multi-Period Longitudinal Audit Trajectory
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-industrial">
              Historical Environmental Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Cross-period trend tracking for <strong className="text-white font-bold">{facilityProfile.facilityName}</strong> across 4 fiscal cycles (FY23 – FY26), overseen by Lead Verifier <strong className="text-emerald-400 font-bold">{settings.reviewerName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerContextualPdfView(null, currentConfig.sourcePage)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-sky-600" />
              <span>Inspect Source PDF (p.{currentConfig.sourcePage})</span>
            </button>
            <button
              onClick={() => setActiveView('verification')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
            >
              <span>View Detected Variances</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Metric:
          </span>
          {Object.entries(metricConfigs).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedMetric === key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cfg.label.split(' ')[0]} {cfg.label.split(' ')[1] || ''}
            </button>
          ))}
        </div>

        <button
          onClick={() => triggerContextualPdfView(null, currentConfig.sourcePage)}
          className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Jump to Disclosure Table (Page {currentConfig.sourcePage})</span>
        </button>
      </div>

      {/* Main Grid: Chart & Trend Analysis on Left, Hypothesis Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Trend Chart & Data Table */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {currentConfig.category} Indicator
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {currentConfig.label}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Latest (FY 2025–26)
                </span>
                <span className="text-xl font-extrabold font-mono text-slate-900">
                  {currentVal.toLocaleString()} {currentConfig.unit}
                </span>
              </div>
              <div className="text-right border-l border-slate-200 pl-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  YoY Shift
                </span>
                <span
                  className={`text-sm font-extrabold font-mono ${
                    Number(deltaPercent) > 0 ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {Number(deltaPercent) > 0 ? '+' : ''}
                  {deltaPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* SVG Trend Line Chart */}
          <div className="w-full overflow-x-auto bg-slate-50/60 p-4 rounded-xl border border-slate-100 flex justify-center">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full max-w-[640px] h-auto overflow-visible select-none"
            >
              {/* Grid Lines */}
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
                      stroke="#E2E8F0"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 3}
                      fill="#94A3B8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {Math.round(gridVal).toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* Connecting Area Shade */}
              <path
                d={`${pathD} L ${getX(historicalData.length - 1)} ${
                  chartHeight - padding.bottom
                } L ${getX(0)} ${chartHeight - padding.bottom} Z`}
                fill={currentConfig.color}
                fillOpacity="0.08"
              />

              {/* Main Line */}
              <path
                d={pathD}
                fill="none"
                stroke={currentConfig.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {historicalData.map((d, i) => {
                const val = d[selectedMetric] as number;
                const x = getX(i);
                const y = getY(val);

                return (
                  <g key={d.period}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4.5"
                      fill="#FFFFFF"
                      stroke={currentConfig.color}
                      strokeWidth="2.5"
                    />
                    {/* Period X Label */}
                    <text
                      x={x}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="monospace"
                    >
                      {d.period}
                    </text>
                    {/* Value Badge on top */}
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      fill="#0F172A"
                      fontSize="10"
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

          {/* Historical Data Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-2.5 px-3.5 font-sans">Period</th>
                  <th className="py-2.5 px-3.5 text-right">Reported Value</th>
                  <th className="py-2.5 px-3.5 text-right">YoY Shift</th>
                  <th className="py-2.5 px-3.5 text-right">Production (t)</th>
                  <th className="py-2.5 px-3.5 text-right">Intensity</th>
                  <th className="py-2.5 px-3.5 text-right font-sans">Source Trace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historicalData.map((d, i) => {
                  const val = d[selectedMetric] as number;
                  const prev = i > 0 ? (historicalData[i - 1][selectedMetric] as number) : val;
                  const diff = i > 0 ? (((val - prev) / prev) * 100).toFixed(1) : '—';

                  return (
                    <tr key={d.period} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 font-sans">
                        {d.period}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-extrabold text-emerald-700">
                        {val.toLocaleString()} {currentConfig.unit}
                      </td>
                      <td className="py-2.5 px-3.5 text-right">
                        <span
                          className={`font-bold ${
                            diff === '—'
                              ? 'text-slate-400'
                              : Number(diff) > 0
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {Number(diff) > 0 ? `+${diff}%` : diff === '—' ? 'Baseline' : `${diff}%`}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-slate-600">
                        {d.productionTonnes.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-slate-900">
                        {d.carbonIntensity}
                      </td>
                      <td className="py-2.5 px-3.5 text-right">
                        <button
                          onClick={() => triggerContextualPdfView(null, currentConfig.sourcePage)}
                          className="text-sky-700 hover:text-sky-900 font-bold inline-flex items-center gap-1 font-sans cursor-pointer text-[11px]"
                        >
                          <span>p.{currentConfig.sourcePage}</span>
                          <Eye className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Variance Hypotheses Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Audit Scrutiny Protocol
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-2">
              Historical Variance Factor Review
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            &ldquo;Scope 1 direct emissions show a +22.0% increase in FY 2025–26 compared with the previous reporting period. This variance warrants investigation because finished product dispatch increased by only 6.33% over the same duration.&rdquo;
          </div>

          {/* 5 Factors to review */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              5 Factors Recommended for Human Verification:
            </span>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="font-bold text-emerald-900 block">1. Production Volume &amp; Clinker Ratio</span>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  Verify whether higher clinker-to-cement ratio (0.74 vs 0.72) or high-grade OPC batches required extra kiln calcination.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200">
                <span className="font-bold text-sky-900 block">2. Reporting Boundary Changes</span>
                <p className="text-[11px] text-sky-800 mt-0.5 leading-relaxed">
                  Confirm if on-site auxiliary calciner or quarry mobile diesel fleets were brought inside the operational perimeter.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="font-bold text-amber-900 block">3. Methodology &amp; Emission Factors</span>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Check if raw meal calcination emission factors were revised using actual laboratory carbonaceous XRF assays versus default IPCC values.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
                <span className="font-bold text-purple-900 block">4. Fuel Mix &amp; Thermal Substitution</span>
                <p className="text-[11px] text-purple-800 mt-0.5 leading-relaxed">
                  Analyze if temporary reduction in RDF / biomass co-processing forced higher reliance on high-carbon petcoke.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                <span className="font-bold text-rose-900 block">5. Operational Unscheduled Cycles</span>
                <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                  Review shutdown logs: Cold kiln restarts consume additional auxiliary fuel without producing sellable clinker.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
            <span className="font-bold text-slate-900 block mb-0.5">Ethical Guardrail:</span>
            ClimateLens does not assign blame or declare data falsification. The final determination belongs solely to Lead Verifier {settings.reviewerName}.
          </div>
        </div>
      </div>
    </div>
  );
};

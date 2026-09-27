import React, { useState } from 'react';
import {
  TrendingUp,
  History,
  FileText,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  Layers,
  Eye,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { HistoricalDataPoint, ReportItem } from '../types';

export const HistoryPage: React.FC = () => {
  const {
    historicalData,
    reports,
    facilityProfile,
    consolidateUnitReports,
    triggerContextualPdfView,
    setActiveView,
    settings,
    showToast,
  } = useVerification();

  const [activeTab, setActiveTab] = useState<'trends' | 'archive'>('trends');
  const [selectedMetric, setSelectedMetric] = useState<keyof HistoricalDataPoint>('totalEmissions');

  const metricConfigs: Record<
    string,
    { label: string; unit: string; category: string; color: string; sourcePage: number; changeDetected: boolean; explanation: string }
  > = {
    totalEmissions: {
      label: 'Gross GHG Emissions',
      unit: 'tCO2e',
      category: 'Emissions',
      color: '#10B981',
      sourcePage: 21,
      changeDetected: true,
      explanation: 'Significant historical change detected: +16.3% YoY rise driven by expanded kiln line throughput and temporary revision of alternative solid fuel thermal substitution rate.',
    },
    scope1: {
      label: 'Scope 1 Direct Calcination & Fuels',
      unit: 'tCO2e',
      category: 'Emissions',
      color: '#F59E0B',
      sourcePage: 21,
      changeDetected: true,
      explanation: 'Significant historical change detected: +22.0% YoY increase. Possible operational reasons: change in clinker-to-cement ratio (0.74 vs 0.72) and petcoke thermal combustion mix during refractory overhaul.',
    },
    scope2: {
      label: 'Scope 2 Purchased Grid Electricity',
      unit: 'tCO2e',
      category: 'Emissions',
      color: '#0EA5E9',
      sourcePage: 22,
      changeDetected: false,
      explanation: 'Historical trend consistent: -1.8% YoY decline due to on-site captive solar expansion (3,860 MWh) offsetting Southern Grid imports.',
    },
    energyMWh: {
      label: 'Total Electrical Energy Consumption',
      unit: 'MWh',
      category: 'Energy',
      color: '#6366F1',
      sourcePage: 7,
      changeDetected: false,
      explanation: 'Historical energy consumption tracked production volume (+5.5% YoY). Specific intensity maintained at 29.64 kWh/tonne clinker.',
    },
    waterKL: {
      label: 'Total Freshwater Withdrawal',
      unit: 'KL',
      category: 'Water',
      color: '#38BDF8',
      sourcePage: 16,
      changeDetected: false,
      explanation: 'Freshwater extraction declined by 2.7% YoY. Zero Liquid Discharge (ZLD) closed-loop recycling recovered 22,400 KL of treated effluent.',
    },
    wasteTonnes: {
      label: 'Total Industrial Waste Generated',
      unit: 'tonnes',
      category: 'Waste',
      color: '#EC4899',
      sourcePage: 26,
      changeDetected: false,
      explanation: 'Waste generation consistent at 2,840 tonnes (+3.3% YoY). 98.4% utilized in cement clinker co-processing and road sub-base recycling.',
    },
    productionTonnes: {
      label: 'Production Output (Finished Cement)',
      unit: 'tonnes',
      category: 'Production',
      color: '#10B981',
      sourcePage: 4,
      changeDetected: false,
      explanation: 'Production dispatch increased from 395,000 tonnes (FY25) to 420,000 tonnes (FY26), reflecting higher infrastructure demand.',
    },
    carbonIntensity: {
      label: 'Specific Carbon Intensity',
      unit: 'tCO2e / tonne cement',
      category: 'Intensity',
      color: '#F43F5E',
      sourcePage: 21,
      changeDetected: true,
      explanation: 'Specific carbon intensity shifted from 0.69 to 0.73 tCO2e/t cement. Explanatory context: higher production of specialized OPC 53 Grade versus blended fly-ash PPC batches.',
    },
  };

  const currentConfig = metricConfigs[selectedMetric as string] || metricConfigs.totalEmissions;

  // Chart calculation
  const values = historicalData.map((d) => d[selectedMetric] as number);
  const minVal = Math.min(...values) * 0.85;
  const maxVal = Math.max(...values) * 1.15;

  const chartWidth = 720;
  const chartHeight = 260;
  const padding = { top: 30, right: 35, bottom: 40, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const getY = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    return chartHeight - padding.bottom - ratio * innerHeight;
  };

  const getX = (index: number) => {
    return padding.left + (index / (historicalData.length - 1)) * innerWidth;
  };

  const pathD = historicalData
    .map((d, i) => {
      const val = d[selectedMetric] as number;
      return `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`;
    })
    .join(' ');

  const currentVal = values[values.length - 1];
  const prevVal = values[values.length - 2];
  const deltaPercent = (((currentVal - prevVal) / prevVal) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/80">
              Longitudinal Environmental Record
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-industrial">
            HISTORICAL ANALYSIS &amp; REPORTS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Multi-cycle trend trajectory (2023 → 2026) and audit archive of ingested sustainability filings.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center bg-[#111726] border border-[#1E293B] rounded-xl p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('trends')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'trends'
                  ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Historical Trend Graph</span>
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'archive'
                  ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Ingested Report Archive ({reports.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'trends' ? (
        <div className="space-y-6">
          {/* Metric Switcher Pills */}
          <div className="p-4 rounded-2xl bg-[#111726] border border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 mr-1">Select Metric:</span>
              {Object.entries(metricConfigs).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setSelectedMetric(key as any)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer ${
                    selectedMetric === key
                      ? 'bg-emerald-500 text-[#0B0F17] font-bold shadow-xs'
                      : 'bg-[#0B0F17] text-slate-400 hover:text-white border border-[#1E293B]'
                  }`}
                >
                  {cfg.label.split(' ')[0]} {cfg.label.split(' ')[1] || ''}
                </button>
              ))}
            </div>

            <button
              onClick={() => triggerContextualPdfView(null, currentConfig.sourcePage)}
              className="text-xs font-mono text-sky-400 hover:text-sky-300 inline-flex items-center gap-1.5 bg-[#0B0F17] border border-[#1E293B] px-3 py-1.5 rounded-xl cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Source Disclosure Table (Page {currentConfig.sourcePage})</span>
            </button>
          </div>

          {/* Large Clean Trend Graph */}
          <div className="p-6 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80 uppercase">
                    {currentConfig.category} Trajectory
                  </span>
                  <span className="text-xs text-slate-400 font-mono">2023 → 2024 → 2025 → 2026</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {currentConfig.label}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">
                    FY 2025–26 Disclosed
                  </span>
                  <span className="text-2xl font-bold font-mono text-white">
                    {currentVal.toLocaleString()} {currentConfig.unit}
                  </span>
                </div>
                <div className="text-right border-l border-[#1E293B] pl-4">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">
                    Period Shift
                  </span>
                  <span
                    className={`text-base font-mono font-extrabold ${
                      Number(deltaPercent) > 0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {Number(deltaPercent) > 0 ? '+' : ''}
                    {deltaPercent}% YoY
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Interactive Trend Chart */}
            <div className="w-full overflow-x-auto bg-[#0B0F17] p-5 rounded-2xl border border-[#1E293B] flex justify-center">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full max-w-[720px] h-auto overflow-visible select-none"
              >
                {/* Subtle Grid Lines */}
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

                {/* Connecting Area Fill */}
                <path
                  d={`${pathD} L ${getX(historicalData.length - 1)} ${
                    chartHeight - padding.bottom
                  } L ${getX(0)} ${chartHeight - padding.bottom} Z`}
                  fill={currentConfig.color}
                  fillOpacity="0.08"
                />

                {/* Main Glowing Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={currentConfig.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {historicalData.map((d, i) => {
                  const val = d[selectedMetric] as number;
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
                        stroke={currentConfig.color}
                        strokeWidth="2.5"
                      />
                      {/* Period Label */}
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
                      {/* Value Badge */}
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

            {/* Context & Non-Accusatory Operational Explanations Required by Prompt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  Historical Change Evaluation
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {currentConfig.explanation}
                </p>
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  Note: Historical increases or decreases do not automatically indicate misreporting.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-2">
                <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block">
                  Methodology &amp; Reporting Boundary Context
                </span>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span><strong>Production change:</strong> Finished dispatch rose 6.3% over period.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span><strong>Boundary change:</strong> Quarry transportation fleet incorporated in FY25.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span><strong>Methodology change:</strong> Updated CPCB emission factors applied.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span><strong>Operational change:</strong> Alternative fuel co-processing substitution.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Ingested Reports Archive Tab */
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white">Ingested Document Archive</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit records of uploaded corporate sustainability reports and unit sub-disclosures.
              </p>
            </div>
            <button
              onClick={consolidateUnitReports}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-[#1E293B] transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Consolidate 3 Sub-Unit Reports</span>
            </button>
          </div>

          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E1524] border-b border-[#1E293B] text-slate-400 font-mono uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-5">Document</th>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Uploaded</th>
                    <th className="py-3 px-4 text-center">Metrics</th>
                    <th className="py-3 px-4 text-center">Flags</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/70">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-[#151D2F] transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-white">{report.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{report.fileName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{report.reportingPeriod}</td>
                      <td className="py-3.5 px-4 text-slate-400">{report.uploadedAt}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                        {report.detectedMetricsCount}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {report.flagsCount > 0 ? (
                          <span className="font-mono text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                            {report.flagsCount}
                          </span>
                        ) : (
                          <span className="font-mono text-slate-400">0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/80">
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => triggerContextualPdfView(null, 1)}
                            className="text-sky-400 hover:text-sky-300 font-mono text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                          <button
                            onClick={() => setActiveView('final-report')}
                            className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
                          >
                            Dossier
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
      )}
    </div>
  );
};

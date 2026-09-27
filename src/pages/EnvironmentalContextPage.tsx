import React, { useState } from 'react';
import {
  Globe2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Building,
  CheckCircle2,
  Info,
  Calendar,
  Layers,
  ShieldCheck,
  ExternalLink,
  Leaf,
  Eye,
  Activity,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { VISUAL_ASSETS } from '../data/visualAssets';

export const EnvironmentalContextPage: React.FC = () => {
  const {
    regionalIndicators,
    facilityProfile,
    updateFlagStatus,
    showToast,
    triggerContextualPdfView,
  } = useVerification();
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>('reg-01');
  const [selectedCorporateMetric, setSelectedCorporateMetric] = useState<'stackDust' | 'scope1' | 'water'>('stackDust');

  const activeIndicator = regionalIndicators.find((r) => r.id === selectedIndicatorId) || regionalIndicators[0];

  // Corporate data series based on selection
  const corporateSeries = {
    stackDust: {
      name: 'Corporate Stack Particulate Matter (CEMS)',
      unit: 'mg/Nm³',
      trend: '-14.0%',
      direction: 'down',
      data: [
        { period: 'FY 2022–23', value: 31.2, index: 100 },
        { period: 'FY 2023–24', value: 29.5, index: 94.5 },
        { period: 'FY 2024–25', value: 28.6, index: 91.6 },
        { period: 'FY 2025–26', value: 24.6, index: 78.8 },
      ],
    },
    scope1: {
      name: 'Corporate Scope 1 Direct Emissions',
      unit: 'tCO2e',
      trend: '+22.0%',
      direction: 'up',
      data: [
        { period: 'FY 2022–23', value: 7800, index: 100 },
        { period: 'FY 2023–24', value: 6900, index: 88.5 },
        { period: 'FY 2024–25', value: 6900, index: 88.5 },
        { period: 'FY 2025–26', value: 8420, index: 107.9 },
      ],
    },
    water: {
      name: 'Corporate Fresh Water Withdrawal',
      unit: 'KL',
      trend: '-2.7%',
      direction: 'down',
      data: [
        { period: 'FY 2022–23', value: 88200, index: 100 },
        { period: 'FY 2023–24', value: 87100, index: 98.7 },
        { period: 'FY 2024–25', value: 86500, index: 98.1 },
        { period: 'FY 2025–26', value: 84200, index: 95.5 },
      ],
    },
  }[selectedCorporateMetric];

  // SVG Chart Dimensions
  const chartWidth = 560;
  const chartHeight = 230;
  const padding = { top: 25, right: 35, bottom: 35, left: 45 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Normalized (0-100 base) comparisons
  const periods = activeIndicator.historicalTrend.map((t) => t.period);
  const minIndex = 70;
  const maxIndex = 140;

  const getY = (val: number) => {
    const ratio = (val - minIndex) / (maxIndex - minIndex);
    return padding.top + innerHeight - ratio * innerHeight;
  };

  const getX = (idx: number) => {
    return padding.left + (idx / (periods.length - 1)) * innerWidth;
  };

  const regionalPath = activeIndicator.historicalTrend
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.index)}`)
    .join(' ');

  const corporatePath = corporateSeries.data
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.index)}`)
    .join(' ');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
              Zonal Environmental Intelligence
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400 font-medium">
              SPCB / TNPCB / CPCB CAAQMS Continuous Stations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Environmental Context &amp; Regional Correlation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Compares facility-reported environmental disclosure trends against official continuous ambient monitoring telemetry across the surrounding airshed and river basin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Regional monitoring datasets refreshed from TNPCB / CPCB CAAQMS stations.')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer shadow-xs"
          >
            Refresh Zonal Stations
          </button>
        </div>
      </div>

      {/* Main Signal Card: Contextual Difference Callout in Deep Slate with Amber Accent */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0D121F] border border-amber-500/30 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">
                Verification Signal
              </span>
              <h2 className="text-lg font-bold text-slate-100">
                CONTEXTUAL DIFFERENCE DETECTED
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerContextualPdfView(null, 21)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 bg-[#0D121F] hover:bg-[#1E293B] border border-[#1E293B] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Inspect corporate stack emission filing in source PDF"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Inspect Source PDF (p.21)</span>
            </button>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20 text-xs font-mono">
              Status: Needs Review
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          &ldquo;Corporate reported stack particulate emissions decreased by 14.0% while the relevant regional ambient air monitoring station (TNPCB / CPCB CAAQMS Manali) recorded a 9.4% increase in the industrial belt PM10 index during the comparable reporting period.&rdquo;
        </p>

        {/* Metric Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-[#0D121F] border border-emerald-500/20">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide block">
              Corporate Trend (Reported)
            </span>
            <div className="flex items-center gap-1.5 text-xl font-extrabold font-mono text-emerald-400 mt-1">
              <ArrowDownRight className="w-5 h-5" />
              <span>↓ 14.0%</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block truncate">
              {corporateSeries.name}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D121F] border border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block">
              Regional Zonal Indicator
            </span>
            <div className="flex items-center gap-1.5 text-xl font-extrabold font-mono text-amber-400 mt-1">
              <ArrowUpRight className="w-5 h-5" />
              <span>↑ 9.4%</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block truncate">
              {activeIndicator.indicatorName}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D121F] border border-[#1E293B]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
              Monitoring Station Agency
            </span>
            <div className="text-xs font-bold text-slate-200 mt-1 truncate">
              {activeIndicator.sourceAgency}
            </div>
            <span className="text-[10px] font-mono text-sky-400 font-semibold mt-0.5 block">
              Station ID: {activeIndicator.stationId}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D121F] border border-sky-500/20">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide block">
              Data Confidence
            </span>
            <div className="text-xl font-extrabold font-mono text-sky-400 mt-1">
              {activeIndicator.confidence}%
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Continuous CAAQMS Telemetry
            </span>
          </div>
        </div>

        {/* Prominent Scientific / Regulatory Disclaimer */}
        <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/30 text-xs text-sky-300 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sky-200 block text-xs">
              Scientific &amp; Regulatory Review Notice — Correlation Does Not Establish Causation:
            </span>
            <p className="text-[11px] leading-relaxed text-slate-300">
              A regional ambient change does not by itself prove that a facility caused it or that its report is false. Regional trends may be driven by seasonal meteorological inversions, vehicular traffic, or other regional industries. This contextual difference is presented strictly as a contextual signal for human verification.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => showToast('Opening station raw hourly sensor log telemetry...')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-xs"
          >
            View Regional Station Evidence
          </button>

          <button
            onClick={() => updateFlagStatus('CL-0044', 'Investigating', 'Reviewer opened zonal meteorological inversion study.')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-[#0D121F] hover:bg-[#1E293B] border border-[#1E293B] transition-colors cursor-pointer"
          >
            Mark Difference for Review
          </button>
        </div>
      </div>

      {/* Synchronized Comparative Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dual Trend Comparison Chart Viewport */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0D121F] border border-[#1E293B] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Normalized Comparative Trend (Base 100 = FY 2022–23)
              </h3>
              <p className="text-xs text-slate-400">
                Corporate Disclosure vs Regional Ambient Observatory on the Same Axis
              </p>
            </div>

            {/* Select corporate metric to compare */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Metric:
              </span>
              <select
                value={selectedCorporateMetric}
                onChange={(e) => setSelectedCorporateMetric(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg bg-[#0D121F] border border-[#1E293B] text-xs text-slate-200 font-semibold focus:outline-hidden focus:border-emerald-500 cursor-pointer"
              >
                <option value="stackDust">Stack PM / Dust (-14%)</option>
                <option value="scope1">Scope 1 GHG (+22%)</option>
                <option value="water">Water Intake (-2.7%)</option>
              </select>
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="relative overflow-x-auto bg-[#0B0F17] p-5 rounded-xl border border-[#1E293B]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto min-w-[500px]"
            >
              {/* Grid lines */}
              {[80, 100, 120, 140].map((val) => (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={getY(val)}
                    x2={chartWidth - padding.right}
                    y2={getY(val)}
                    stroke="#1E293B"
                    strokeWidth="1.5"
                    strokeDasharray={val === 100 ? '4 2' : undefined}
                  />
                  <text
                    x={padding.left - 8}
                    y={getY(val) + 3}
                    textAnchor="end"
                    fill="#64748B"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {val}
                  </text>
                </g>
              ))}

              {/* X Axis labels */}
              {periods.map((p, i) => (
                <text
                  key={p}
                  x={getX(i)}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {p}
                </text>
              ))}

              {/* Corporate Line (Emerald) */}
              <path
                d={corporatePath}
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Regional Indicator Line (Amber) */}
              <path
                d={regionalPath}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeDasharray="5 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Corporate Data Points */}
              {corporateSeries.data.map((pt, i) => (
                <g key={`corp-${i}`}>
                  <circle
                    cx={getX(i)}
                    cy={getY(pt.index)}
                    r="5"
                    fill="#10B981"
                    stroke="#0D121F"
                    strokeWidth="2"
                  />
                  <text
                    x={getX(i)}
                    y={getY(pt.index) - 9}
                    textAnchor="middle"
                    fill="#10B981"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {pt.index.toFixed(1)}
                  </text>
                </g>
              ))}

              {/* Regional Data Points */}
              {activeIndicator.historicalTrend.map((pt, i) => (
                <g key={`reg-${i}`}>
                  <circle
                    cx={getX(i)}
                    cy={getY(pt.index)}
                    r="5"
                    fill="#F59E0B"
                    stroke="#0D121F"
                    strokeWidth="2"
                  />
                  <text
                    x={getX(i)}
                    y={getY(pt.index) + 18}
                    textAnchor="middle"
                    fill="#F59E0B"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {pt.index.toFixed(1)}
                  </text>
                </g>
              ))}
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1E293B] text-xs">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-slate-200 font-semibold font-mono text-[11px]">
                    {corporateSeries.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-1 bg-amber-400" />
                  <span className="text-slate-200 font-semibold font-mono text-[11px]">
                    {activeIndicator.indicatorName} (Regional)
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-mono">
                Indexed to 100 in FY 2022–23
              </span>
            </div>
          </div>
        </div>

        {/* Right: Regional Indicators Selector */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0D121F] border border-[#1E293B] shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Regional Indicators in Zone
            </h3>
            <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
              SPCB / TNPCB
            </span>
          </div>

          <div className="space-y-2.5">
            {regionalIndicators.map((ind) => (
              <div
                key={ind.id}
                onClick={() => setSelectedIndicatorId(ind.id)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedIndicatorId === ind.id
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-xs ring-1 ring-emerald-500/30'
                    : 'bg-[#0D121F] border-[#1E293B] hover:bg-[#1E293B]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold text-sky-400">
                    {ind.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-200">
                    {ind.currentValue} {ind.unit.split(' ')[0]}
                  </span>
                </div>
                <div className="font-bold text-slate-100 mt-1">
                  {ind.indicatorName}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  Source: {ind.sourceAgency}
                </div>
              </div>
            ))}
          </div>

          {/* Regional Monitoring Station Infrastructure Card */}
          <div className="pt-3 border-t border-[#1E293B]">
            <div className="rounded-xl overflow-hidden border border-[#1E293B] bg-[#0D121F]">
              <div className="h-32 relative overflow-hidden">
                <img
                  src={VISUAL_ASSETS.monitoringStation}
                  alt="CAAQMS Monitoring Station"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#0B0F17]/90 backdrop-blur-xs text-slate-200 text-[10px] font-mono px-2 py-0.5 rounded font-semibold border border-[#1E293B]">
                  Station: Manali CAAQMS-04
                </span>
              </div>
              <div className="p-3">
                <div className="text-[11px] font-bold text-slate-200 font-industrial">
                  Continuous Ambient Air Quality Station
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                  Operated under TNPCB & CPCB guidelines, providing continuous 15-minute telemetry for PM10, PM2.5, SO2, and NOx across the industrial corridor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  YAxis,
  XAxis,
} from 'recharts';
import { Eye, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface SparklinePoint {
  period: string;
  value: number;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: React.ReactNode;
  data?: SparklinePoint[];
  color?: 'emerald' | 'sky' | 'amber' | 'rose' | 'slate' | 'indigo';
  badge?: string;
  trend?: {
    value: string;
    direction?: 'up' | 'down' | 'neutral';
    label?: string;
  };
  sourcePage?: number;
  onInspectPdf?: () => void;
  onClick?: () => void;
  className?: string;
}

const colorConfig = {
  emerald: {
    stroke: '#10B981',
    fillStart: '#10B981',
    fillStop: '#064E3B',
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    gradientId: 'statEmerald',
  },
  sky: {
    stroke: '#38BDF8',
    fillStart: '#38BDF8',
    fillStop: '#0C4A6E',
    text: 'text-sky-300',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    gradientId: 'statSky',
  },
  amber: {
    stroke: '#F59E0B',
    fillStart: '#F59E0B',
    fillStop: '#78350F',
    text: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    gradientId: 'statAmber',
  },
  rose: {
    stroke: '#F43F5E',
    fillStart: '#F43F5E',
    fillStop: '#881337',
    text: 'text-rose-300',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    gradientId: 'statRose',
  },
  slate: {
    stroke: '#94A3B8',
    fillStart: '#94A3B8',
    fillStop: '#1E293B',
    text: 'text-slate-300',
    bg: 'bg-slate-800/40',
    border: 'border-slate-700/60',
    gradientId: 'statSlate',
  },
  indigo: {
    stroke: '#818CF8',
    fillStart: '#818CF8',
    fillStop: '#312E81',
    text: 'text-indigo-300',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    gradientId: 'statIndigo',
  },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: SparklinePoint }>;
  unit?: string;
}

const CustomSparklineTooltip: React.FC<CustomTooltipProps> = ({ active, payload, unit }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-xs border border-slate-200 px-2 py-1 rounded-md shadow-md text-left pointer-events-none z-50">
        <div className="text-[10px] font-mono text-slate-500 font-medium">{item.period}</div>
        <div className="text-xs font-mono font-bold text-slate-900">
          {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
          {unit ? ` ${unit}` : ''}
        </div>
      </div>
    );
  }
  return null;
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  data,
  color = 'slate',
  badge,
  trend,
  sourcePage,
  onInspectPdf,
  onClick,
  className = '',
}) => {
  const currentTheme = colorConfig[color] || colorConfig.slate;
  const gradientId = `${currentTheme.gradientId}-${Math.random().toString(36).substring(2, 7)}`;

  // Default fallback data for 4 reporting periods if none passed
  const chartData: SparklinePoint[] =
    data && data.length > 0
      ? data
      : [
          { period: 'FY23', value: 85 },
          { period: 'FY24', value: 89 },
          { period: 'FY25', value: 92 },
          { period: 'FY26', value: 96 },
        ];

  return (
    <div
      onClick={onClick}
      className={`group relative p-5 rounded-2xl bg-[#0D121F] border border-[#1E293B] shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div>
        {/* Top Header: Title and optional Badge / PDF trigger */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate font-industrial">
            {title}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {sourcePage !== undefined && onInspectPdf && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectPdf();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer"
                title={`Inspect citation on Page ${sourcePage} of source PDF`}
              >
                <Eye className="w-2.5 h-2.5 text-sky-400" />
                <span>p.{sourcePage}</span>
              </button>
            )}

            {badge && (
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`}
              >
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Primary Metric Value & Trend Pill */}
        <div className="flex items-baseline justify-between gap-2 mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100 tracking-tight tabular-nums font-mono-data">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-mono font-semibold text-slate-400">
                {unit}
              </span>
            )}
          </div>

          {trend && (
            <div
              className={`inline-flex items-center gap-0.5 text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${
                trend.direction === 'up'
                  ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
                  : trend.direction === 'down'
                  ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                  : 'text-slate-400 bg-slate-800/40 border-slate-700/60'
              }`}
            >
              {trend.direction === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-400" />}
              {trend.direction === 'down' && <ArrowDownRight className="w-3 h-3 text-amber-400" />}
              {trend.direction === 'neutral' && <Minus className="w-3 h-3 text-slate-400" />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
      </div>

      {/* Recharts 4-Period Sparkline Visual */}
      <div className="mt-3 pt-2 border-t border-[#1E293B]">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
          <span className="tracking-wider uppercase font-semibold">4 Reporting Periods</span>
          <span className="text-slate-400 font-bold font-mono">
            {chartData[0]?.period} → {chartData[chartData.length - 1]?.period}
          </span>
        </div>

        <div className="h-11 w-full -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 6, bottom: 2, left: 6 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={currentTheme.fillStart} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={currentTheme.fillStop} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" hide />
              <YAxis hide domain={['dataMin - (dataMax-dataMin)*0.1', 'dataMax + (dataMax-dataMin)*0.1']} />
              <Tooltip content={<CustomSparklineTooltip unit={unit} />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={currentTheme.stroke}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={{ r: 2.5, fill: '#0D121F', stroke: currentTheme.stroke, strokeWidth: 1.5 }}
                activeDot={{ r: 4.5, stroke: '#0D121F', strokeWidth: 2, fill: currentTheme.stroke }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 4 Reporting Periods Step Pill Indicators */}
        <div className="grid grid-cols-4 gap-1 mt-1 text-[9px] font-mono text-center">
          {chartData.slice(0, 4).map((pt, i) => {
            const isCurrent = i === chartData.length - 1;
            return (
              <span
                key={i}
                className={`py-0.5 px-0.5 rounded transition-colors ${
                  isCurrent
                    ? 'bg-[#131B2E] text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title={`${pt.period}: ${pt.value.toLocaleString()}${unit ? ` ${unit}` : ''}`}
              >
                {pt.period}
              </span>
            );
          })}
        </div>

        {/* Subtitle / Footer explanation */}
        {subtitle && (
          <div className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5 font-medium">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

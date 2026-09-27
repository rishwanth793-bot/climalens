import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useVerification } from '../context/VerificationContext';

export const AdjustValueModal: React.FC = () => {
  const { adjustingMetric, setAdjustingMetric, adjustMetricValue } = useVerification();
  const [newValue, setNewValue] = useState('');
  const [reason, setReason] = useState('');

  if (!adjustingMetric) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim() || !reason.trim()) return;
    adjustMetricValue(adjustingMetric.id, newValue.trim(), reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#0D121F] border border-[#1E293B] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4.5 border-b border-[#1E293B] flex items-center justify-between bg-[#0B0F17]">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Human Reviewer Adjustment
            </span>
            <h2 className="text-base font-bold text-slate-100">
              {adjustingMetric.metricName}
            </h2>
          </div>
          <button
            onClick={() => setAdjustingMetric(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131B2E] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-[#131B2E] border border-[#1E293B] text-xs">
            <span className="text-slate-400 block mb-1">Extracted AI Value:</span>
            <div className="font-mono text-emerald-400 font-bold text-base">
              {adjustingMetric.value} {adjustingMetric.unit}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Source: {adjustingMetric.sourceDocument}, Page {adjustingMetric.sourcePage}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Adjusted Verified Value ({adjustingMetric.unit}) *
            </label>
            <input
              type="text"
              defaultValue={adjustingMetric.value}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={`Enter verified ${adjustingMetric.unit} value`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#131B2E] border border-[#1E293B] text-sm text-slate-100 font-mono focus:outline-hidden focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Reviewer Justification / Audit Reason *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g., Reconciled with sub-meter invoice #IN-291 or corrected OCR transcription artifact..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#131B2E] border border-[#1E293B] text-xs text-slate-100 focus:outline-hidden focus:border-emerald-500"
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              This adjustment will be permanently logged in the human verification audit trail.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setAdjustingMetric(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm &amp; Log Adjustment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

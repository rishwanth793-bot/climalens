import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Sliders,
  Database,
  RotateCcw,
  Check,
  Shield,
  Radio,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDemoData, facilityProfile, showToast } = useVerification();

  const [threshold, setThreshold] = useState(settings.confidenceThreshold);
  const [sensitivity, setSensitivity] = useState(settings.verificationSensitivity);
  const [reviewerName, setReviewerName] = useState(settings.reviewerName);
  const [reviewerRole, setReviewerRole] = useState(settings.reviewerRole);
  const [contextComparison, setContextComparison] = useState(settings.contextComparisonEnabled);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      confidenceThreshold: threshold,
      verificationSensitivity: sensitivity,
      reviewerName,
      reviewerRole,
      contextComparisonEnabled: contextComparison,
    });
    showToast('Verification settings updated successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold mb-2">
          <SettingsIcon className="w-3.5 h-3.5 text-emerald-400" />
          Governance &amp; Engine Configuration
        </div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          System Settings &amp; Verification Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Configure AI extraction thresholds, human review guardrails, and regional ambient monitoring telemetry providers.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Reviewer Profile */}
        <div className="p-6 rounded-2xl bg-[#0D121F] border border-[#1E293B] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
            <User className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-100">
              Reviewer Identity &amp; Accreditation Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Lead Verifier Name
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131B2E] border border-[#1E293B] text-slate-100 focus:outline-hidden focus:border-emerald-500 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Professional Role / Designation
              </label>
              <input
                type="text"
                value={reviewerRole}
                onChange={(e) => setReviewerRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131B2E] border border-[#1E293B] text-slate-100 focus:outline-hidden focus:border-emerald-500 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Auditing Organization / Agency
              </label>
              <input
                type="text"
                defaultValue={settings.regionalAgency}
                disabled
                className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-slate-500 text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Assurance Standard Baseline
              </label>
              <input
                type="text"
                defaultValue="ISO 14064-3 / ISAE 3410"
                disabled
                className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-slate-500 text-xs cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* AI Confidence & Verification Sensitivity */}
        <div className="p-6 rounded-2xl bg-[#0D121F] border border-[#1E293B] shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
            <Sliders className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-slate-100">
              AI Extraction &amp; Anomaly Detection Parameters
            </h2>
          </div>

          {/* Confidence Threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Automated Extraction Confidence Gate
              </span>
              <span className="font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {threshold}% Confidence
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Metrics extracted with confidence scores below this threshold automatically queue for mandatory human verifier sign-off.
            </p>
            <input
              type="range"
              min="70"
              max="95"
              step="1"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-[#131B2E] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>70% (Tolerant)</span>
              <span>85% (Recommended)</span>
              <span>95% (Strict Audit)</span>
            </div>
          </div>

          {/* Variance Sensitivity */}
          <div className="space-y-2 pt-3 border-t border-[#1E293B]">
            <label className="block text-xs font-semibold text-slate-300">
              Historical &amp; Arithmetic Variance Sensitivity
            </label>
            <p className="text-xs text-slate-400">
              Governs tolerance bounds before triggering contextual or historical variance flags.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(['Low', 'Medium', 'High'] as const).map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setSensitivity(level)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    sensitivity === level
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-xs'
                      : 'bg-[#131B2E] border-[#1E293B] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold">{level} Sensitivity</div>
                  <div className="text-[10px] font-normal text-slate-500 mt-0.5">
                    {level === 'Low' && '±25% threshold'}
                    {level === 'Medium' && '±15% (Default)'}
                    {level === 'High' && '±5% strict tolerance'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Regional Context Toggle */}
          <div className="pt-3 border-t border-[#1E293B]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={contextComparison}
                onChange={(e) => setContextComparison(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-emerald-500 border-[#1E293B] bg-[#131B2E] focus:ring-emerald-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-semibold text-slate-200">
                  Enable Continuous Regional Environmental Telemetry Cross-Referencing
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronizes facility Scope 1 stack metrics with Ambient Air Quality (CPCB/TNPCB) and regional groundwater monitoring feeds.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Data & Telemetry Sources */}
        <div className="p-6 rounded-2xl bg-[#0D121F] border border-[#1E293B] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
            <Database className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-slate-100">
              Active Regional Environmental Ingestion Feeds
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#131B2E] border border-[#1E293B]">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <span className="font-semibold text-slate-200">
                    Tamil Nadu Pollution Control Board (TNPCB) API
                  </span>
                  <div className="text-[11px] text-slate-400">Continuous Ambient Air Quality Station (CAAQMS-CHN-04)</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Connected (15m latency)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#131B2E] border border-[#1E293B]">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-semibold text-slate-200">
                    Central Ground Water Authority (CGWA) Basin Index
                  </span>
                  <div className="text-[11px] text-slate-400">Ennore-Manali Industrial Watershed Aquifer Log</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Synced (Daily)
              </span>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={resetToDemoData}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] shadow-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Demo Data &amp; Flags</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-sm transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4 text-slate-900" />
            <span>Save Verification Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

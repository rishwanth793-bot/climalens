import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Check,
  Eye,
  Columns,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { PDFDocumentViewer } from '../components/PDFDocumentViewer';

const PROCESSING_STEPS = [
  'Uploading',
  'Reading document',
  'Extracting environmental data',
  'Standardizing values',
  'Checking data',
  'Ready for review',
];

export const UploadPage: React.FC = () => {
  const {
    facilityProfile,
    isProcessingUpload,
    uploadProgressStep,
    startSimulatedUpload,
    setActiveView,
    consolidateUnitReports,
    handleSelectPdfFile,
    uploadedPdfFile,
    activePdfPage,
    setActivePdfPage,
    showToast,
  } = useVerification();

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>(
    uploadedPdfFile ? uploadedPdfFile.name : 'northstar_environmental_report_FY2025-26.pdf'
  );
  const [viewMode, setViewMode] = useState<'split' | 'upload_only' | 'preview_only'>('split');

  const handleSelectSample = (sampleFileName: string, pageToJump = 1) => {
    setSelectedFile(sampleFileName);
    setActivePdfPage(pageToJump);
    startSimulatedUpload(sampleFileName);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file.name);
      handleSelectPdfFile(file);
      startSimulatedUpload(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      handleSelectPdfFile(file);
      startSimulatedUpload(file.name);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/80">
              Document Ingestion &amp; Audit Pipeline
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-industrial">
            Upload Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Supported document: <strong className="text-emerald-400 font-mono">PDF</strong>
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center bg-[#111726] border border-[#1E293B] rounded-xl p-1 text-xs font-semibold">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode('upload_only')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'upload_only'
                  ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Only</span>
            </button>
            <button
              onClick={() => setViewMode('preview_only')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'preview_only'
                  ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>PDF Viewer</span>
            </button>
          </div>

          <button
            onClick={() => setActiveView('raw-data')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0F17] bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-xs cursor-pointer font-industrial"
          >
            <span>Proceed to Raw Data</span>
            <ArrowRight className="w-4 h-4 text-[#0B0F17]" />
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div
        className={`grid gap-6 ${
          viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
        }`}
      >
        {/* Left Column: Upload Box & Sequential Processing Pipeline */}
        {(viewMode === 'split' || viewMode === 'upload_only') && (
          <div className={`space-y-6 ${viewMode === 'split' ? 'lg:col-span-5' : 'max-w-2xl mx-auto'}`}>
            {/* Extremely Simple Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`p-8 border-2 border-dashed rounded-2xl text-center transition-all bg-[#111726] shadow-sm ${
                dragOver
                  ? 'border-emerald-500 bg-emerald-950/20'
                  : 'border-[#1E293B] hover:border-emerald-500/60'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0B0F17] border border-[#1E293B] flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-xs">
                <Upload className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-white">
                Upload Report
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Supported document: <span className="font-mono text-emerald-400 font-bold">PDF</span>
              </p>

              <div className="mt-4 flex items-center justify-center gap-3">
                <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-bold text-[#0B0F17] bg-emerald-400 hover:bg-emerald-300 transition-all shadow-xs font-industrial">
                  <span>Browse PDF Files</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.json,.csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Sample Document Selectors */}
              <div className="mt-6 pt-5 border-t border-[#1E293B] text-left">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center font-mono">
                  Or load sample corporate filing:
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleSelectSample('northstar_environmental_report_FY2025-26.pdf', 21)}
                    className="w-full p-2.5 rounded-xl bg-[#0B0F17] hover:bg-[#151D2F] border border-[#1E293B] hover:border-emerald-500/60 transition-all flex items-center justify-between group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 group-hover:text-emerald-300 truncate">
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">Northstar Cement FY26 Integrated Report (28 pages)</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80 shrink-0">
                      Page 21
                    </span>
                  </button>

                  <button
                    onClick={() => handleSelectSample('northstar_unit1_energy_thermal_FY2025-26.pdf', 7)}
                    className="w-full p-2.5 rounded-xl bg-[#0B0F17] hover:bg-[#151D2F] border border-[#1E293B] hover:border-sky-500/60 transition-all flex items-center justify-between group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 group-hover:text-sky-300 truncate">
                      <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="truncate">Unit 1 Thermal &amp; Electrical Power Disclosure</span>
                    </div>
                    <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/80 shrink-0">
                      Page 7
                    </span>
                  </button>

                  <button
                    onClick={consolidateUnitReports}
                    className="w-full p-2.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-800/60 transition-all flex items-center justify-between group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                      <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Harmonize 3 Unit Reports into 1 Verification Dossier</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      3→1 Synthesis
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sequential Processing State Pipeline (Exact prompt requirement) */}
            <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Verification Pipeline State
                </div>
                <span className="text-[10px] font-mono text-emerald-400">
                  {isProcessingUpload ? 'In Progress' : 'Ready'}
                </span>
              </div>

              {/* Sequential Steps */}
              <div className="space-y-2.5">
                {PROCESSING_STEPS.map((step, idx) => {
                  const stepIndex = Math.floor((uploadProgressStep / 10) * PROCESSING_STEPS.length);
                  const isCurrent = isProcessingUpload && stepIndex === idx;
                  const isDone = !isProcessingUpload || stepIndex > idx;

                  return (
                    <div
                      key={step}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs font-mono ${
                        isCurrent
                          ? 'bg-[#182338] border-emerald-500/80 text-white font-bold'
                          : isDone
                          ? 'bg-[#0B0F17] border-[#1E293B] text-slate-300'
                          : 'bg-[#0B0F17]/40 border-[#1E293B]/40 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3 text-emerald-400" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center">
                            <Loader2 className="w-3 h-3 text-sky-400 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#0B0F17] text-slate-600 border border-slate-800 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </div>
                        )}
                        <span>{step}</span>
                      </div>

                      {isDone && (
                        <span className="text-[10px] text-emerald-400 font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Active document: {selectedFile}
                </span>
                <button
                  onClick={() => {
                    setActiveView('raw-data');
                    showToast('Navigated to Raw Report inspection.');
                  }}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer font-industrial"
                >
                  <span>Open Raw Data</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: PDF Document Viewer */}
        {(viewMode === 'split' || viewMode === 'preview_only') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-7' : 'w-full'}`}>
            <PDFDocumentViewer />
          </div>
        )}
      </div>
    </div>
  );
};

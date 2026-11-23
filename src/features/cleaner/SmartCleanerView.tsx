import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  Check,
  Layers,
} from 'lucide-react';
import { CleanResult, ScanSummary } from '../../types';
import { NexoraApi } from '../../services/api';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const SmartCleanerView: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanSummary | null>(null);
  const [cleanResult, setCleanResult] = useState<CleanResult | null>(null);
  const [selectedRuleIds, setSelectedRuleIds] = useState<Set<string>>(new Set());
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [useQuarantine, setUseQuarantine] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Automatically start initial scan on mount
  useEffect(() => {
    handleScan();
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    setCleanResult(null);
    try {
      const summary = await NexoraApi.scanCleaner();
      setScanResult(summary);
      // Select all safe rules by default
      const defaultSelected = new Set(
        summary.categories.filter((c) => c.risk_level === 'Low').map((c) => c.rule_id)
      );
      setSelectedRuleIds(defaultSelected);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleToggleSelectRule = (ruleId: string) => {
    const updated = new Set(selectedRuleIds);
    if (updated.has(ruleId)) {
      updated.delete(ruleId);
    } else {
      updated.add(ruleId);
    }
    setSelectedRuleIds(updated);
  };

  const handleSelectAll = () => {
    if (!scanResult) return;
    const all = new Set(scanResult.categories.map((c) => c.rule_id));
    setSelectedRuleIds(all);
  };

  const handleDeselectAll = () => {
    setSelectedRuleIds(new Set());
  };

  // Calculate selected files and size
  const selectedCategories = scanResult?.categories.filter((c) => selectedRuleIds.has(c.rule_id)) || [];
  const selectedFilesCount = selectedCategories.reduce((acc, c) => acc + c.file_count, 0);
  const selectedBytes = selectedCategories.reduce((acc, c) => acc + c.total_size, 0);

  const handleExecuteClean = async () => {
    setShowConfirmModal(false);
    setIsCleaning(true);
    try {
      const candidatePaths = selectedCategories.flatMap((c) => c.files.map((f) => f.path));
      const res = await NexoraApi.executeCleaner(candidatePaths, useQuarantine);
      setCleanResult(res);
      setScanResult(null); // Clear preview after completion
    } catch (err) {
      console.error('Clean error:', err);
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Action Header Card (Luxury Glass) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-7 rounded-2xl luxury-glass border border-white/[0.08] shadow-2xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-[#F5F7FA] tracking-tight">Smart Cache & Junk Cleaner</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#02FEDC]/15 text-[#02FEDC] border border-[#02FEDC]/30 shadow-[0_0_10px_rgba(2,254,220,0.2)]">
              Safe & Non-Destructive
            </span>
          </div>
          <p className="text-xs text-[#8E95A8] leading-relaxed">
            Multi-threaded scanning of verified temporary files. Cryptographically sandboxed: personal documents and system binaries are 100% protected.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={isScanning || isCleaning}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#141824] hover:bg-[#1B2132] text-[#E2E8F0] border border-[#232A3D] hover:border-[#02FEDC]/30 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-[#02FEDC]' : 'text-[#8E95A8]'}`} />
            <span>{isScanning ? 'Scanning...' : 'Rescan System'}</span>
          </button>

          {scanResult && selectedFilesCount > 0 && (
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isCleaning}
              className="group flex items-center gap-2.5 px-6 py-3 rounded-xl gradient-brand text-[#08090D] text-xs font-extrabold shadow-xl shadow-[#02FEDC]/25 hover:shadow-[#02FEDC]/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Clean Selected ({formatBytes(selectedBytes)})</span>
            </button>
          )}
        </div>
      </div>

      {/* Post-Clean Success Banner */}
      {cleanResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#00E699]/15 via-[#02FEDC]/10 to-transparent border border-[#00E699]/35 space-y-3 shadow-xl">
          <div className="flex items-center gap-2.5 text-[#00E699] font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 shadow-[0_0_10px_#00E699]" />
            <span>Cleanup Completed Successfully!</span>
          </div>
          <p className="text-xs text-[#E2E8F0]">
            Reclaimed <strong className="font-extrabold text-[#02FEDC] text-sm">{formatBytes(cleanResult.cleaned_bytes)}</strong> across{' '}
            <strong className="font-bold text-white">{cleanResult.cleaned_files} files</strong>.
            {cleanResult.quarantine_id && (
              <span className="ml-1 text-[#8E95A8]">
                (Safely staged in Quarantine Vault for instant 14-day rollback availability).
              </span>
            )}
          </p>
          {cleanResult.skipped_files > 0 && (
            <p className="text-[11px] text-[#71788E]">
              Protected {cleanResult.skipped_files} active files currently locked by open Windows processes.
            </p>
          )}
        </div>
      )}

      {/* High-End Holographic Scanning State Indicator */}
      {isScanning && (
        <div className="p-16 text-center rounded-2xl luxury-glass border border-white/[0.08] space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            {/* Outer Pulsing Ring */}
            <div className="absolute inset-0 rounded-full border border-[#02FEDC]/30 animate-ping opacity-25" />
            <div className="absolute -inset-2 rounded-full border border-[#5A5CFF]/20 animate-pulse" />

            {/* Rotating Radar Sweep Cone */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#02FEDC] border-r-[#5A5CFF] animate-radar" />

            {/* Center Core */}
            <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center shadow-lg shadow-[#02FEDC]/30 z-10">
              <Sparkles className="w-6 h-6 text-[#08090D] animate-spin" />
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#F5F7FA] tracking-tight">Scanning Approved Storage Paths...</h3>
            <p className="text-xs text-[#8E95A8] leading-relaxed">
              Evaluating User Temp, Windows Temp, Browser caches, shader binaries, and system diagnostic logs.
            </p>
          </div>
        </div>
      )}

      {/* Scan Results Review & Breakdown */}
      {scanResult && !isScanning && (
        <div className="space-y-4">
          {/* Summary Metric Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4 text-xs text-[#969BAA]">
              <span>
                Found <strong className="text-[#F5F7FA]">{formatBytes(scanResult.total_bytes)}</strong> in{' '}
                <strong className="text-[#F5F7FA]">{scanResult.total_files} files</strong>
              </span>
              <span>•</span>
              <span>Scan duration: {scanResult.scan_duration_ms}ms</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={handleSelectAll}
                className="text-[#02FEDC] hover:underline font-medium"
              >
                Select All
              </button>
              <span className="text-[#323A50]">|</span>
              <button
                onClick={handleDeselectAll}
                className="text-[#969BAA] hover:text-[#F5F7FA] font-medium"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Category Cards */}
          <div className="space-y-3">
            {scanResult.categories.map((category) => {
              const isSelected = selectedRuleIds.has(category.rule_id);
              const isExpanded = expandedRuleId === category.rule_id;

              return (
                <div
                  key={category.rule_id}
                  className={`rounded-xl border transition-all ${
                    isSelected ? 'bg-[#11131A] border-[#2B3245]' : 'bg-[#0E1017] border-[#1D2230]'
                  }`}
                >
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleSelectRule(category.rule_id)}
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-[#02FEDC] border-[#02FEDC] text-[#08090D]'
                            : 'border-[#323A50] hover:border-[#656C80]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-[#F5F7FA]">{category.name}</h4>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#171A23] text-[#969BAA]">
                            {category.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#969BAA]">{category.file_count} files found</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-medium text-[#F5F7FA]">
                        {formatBytes(category.total_size)}
                      </span>
                      <button
                        onClick={() => setExpandedRuleId(isExpanded ? null : category.rule_id)}
                        className="p-1 rounded hover:bg-[#171A23] text-[#969BAA] transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded File Path List (Preview transparency) */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-[#1D2230] bg-[#0A0C11] rounded-b-xl space-y-1.5 max-h-48 overflow-y-auto">
                      <p className="text-[10px] text-[#656C80] uppercase tracking-wider font-semibold py-1">
                        Candidate File Paths:
                      </p>
                      {category.files.slice(0, 30).map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] text-[#969BAA] font-mono">
                          <span className="truncate max-w-[80%]">{file.path}</span>
                          <span>{formatBytes(file.size)}</span>
                        </div>
                      ))}
                      {category.files.length > 30 && (
                        <p className="text-[10px] text-[#656C80] italic">
                          ... and {category.files.length - 30} more files.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#11131A] border border-[#232838] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#02FEDC]/10 border border-[#02FEDC]/20 flex items-center justify-center text-[#02FEDC]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FA]">Confirm Safe Cleanup</h3>
                <p className="text-xs text-[#969BAA]">Transparent verification before unlinking files</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#171A23] border border-[#232838] space-y-2 text-xs">
              <div className="flex justify-between text-[#969BAA]">
                <span>Files selected for cleanup:</span>
                <span className="text-[#F5F7FA] font-medium font-mono">{selectedFilesCount}</span>
              </div>
              <div className="flex justify-between text-[#969BAA]">
                <span>Total space to be reclaimed:</span>
                <span className="text-[#02FEDC] font-bold font-mono">{formatBytes(selectedBytes)}</span>
              </div>
            </div>

            {/* Quarantine Toggle */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-[#0E1017] border border-[#1D2230] cursor-pointer">
              <input
                type="checkbox"
                checked={useQuarantine}
                onChange={(e) => setUseQuarantine(e.target.checked)}
                className="mt-0.5 rounded border-[#323A50] text-[#02FEDC] focus:ring-0"
              />
              <div className="text-xs">
                <span className="font-medium text-[#F5F7FA]">Stage files in Quarantine (Recommended)</span>
                <p className="text-[11px] text-[#969BAA]">
                  Allows you to restore any cleaned item within 14 days if an application requires it.
                </p>
              </div>
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-[#171A23] hover:bg-[#1E2330] text-[#969BAA] text-xs font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteClean}
                className="px-5 py-2 rounded-xl gradient-brand text-[#08090D] text-xs font-bold shadow-lg shadow-[#02FEDC]/20 hover:opacity-95 transition-all"
              >
                Proceed with Cleanup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

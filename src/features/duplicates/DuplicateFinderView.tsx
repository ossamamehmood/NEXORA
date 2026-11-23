import React, { useState } from 'react';
import { Copy, ShieldCheck, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';
import { DuplicateScanResult } from '../../types';
import { NexoraApi } from '../../services/api';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const DuplicateFinderView: React.FC = () => {
  const [targetDir, setTargetDir] = useState('C:\\Users');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<DuplicateScanResult | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const res = await NexoraApi.findDuplicates(targetDir);
      setScanResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Search Header */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] space-y-4">
        <div className="flex items-center gap-2">
          <Copy className="w-5 h-5 text-[#02FEDC]" />
          <h2 className="text-sm font-bold text-[#F5F7FA]">Cryptographic Duplicate File Finder</h2>
        </div>
        <p className="text-xs text-[#969BAA]">
          3-tier verification: File size pre-filtering → 4KB partial header hash → full SHA-256 byte comparison.
        </p>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={targetDir}
            onChange={(e) => setTargetDir(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-[#171A23] border border-[#232838] text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#02FEDC]"
          />
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-5 py-2 rounded-xl gradient-brand text-[#08090D] font-bold text-xs hover:opacity-95 transition-all"
          >
            {isScanning ? 'Hashing Files...' : 'Find Duplicates'}
          </button>
        </div>
      </div>

      {/* Duplicate Groups Result */}
      {scanResult && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#171A23] border border-[#232838] flex items-center justify-between text-xs">
            <span className="text-[#969BAA]">
              Examined <strong className="text-[#F5F7FA]">{scanResult.total_examined_files} files</strong>
            </span>
            <span className="text-[#02FEDC] font-semibold">
              Potential Reclaimable Space: {formatBytes(scanResult.potential_reclaimable_bytes)}
            </span>
          </div>

          <div className="space-y-3">
            {scanResult.duplicate_groups.map((group, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#11131A] border border-[#232838] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#02FEDC] font-semibold">
                    {formatBytes(group.file_size)} per file ({group.file_paths.length} copies)
                  </span>
                  <span className="font-mono text-[10px] text-[#656C80]">
                    SHA-256: {group.sha256_hash.substring(0, 16)}...
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#0E1017] border border-[#1D2230] space-y-1.5">
                  {group.file_paths.map((p, pIdx) => (
                    <div key={pIdx} className="flex items-center justify-between text-[11px] text-[#969BAA] font-mono">
                      <span className="truncate max-w-[85%]">{p}</span>
                      <span className="text-[10px] text-[#656C80]">Copy #{pIdx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { PieChart, FolderSearch, HardDrive, FileText, ChevronRight } from 'lucide-react';
import { DiskAnalysisResult } from '../../types';
import { NexoraApi } from '../../services/api';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const DiskAnalyzerView: React.FC = () => {
  const [targetDir, setTargetDir] = useState('C:\\Users');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DiskAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const res = await NexoraApi.analyzeDirectory(targetDir);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Target Directory Input Card */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#F5F7FA]">Disk Space & Storage Breakdown</h2>
          <p className="text-xs text-[#969BAA]">Inspect folders to discover what is consuming storage</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={targetDir}
            onChange={(e) => setTargetDir(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-[#171A23] border border-[#232838] text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#02FEDC]"
          />
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="px-5 py-2 rounded-xl gradient-brand text-[#08090D] font-bold text-xs hover:opacity-95 transition-all"
          >
            {isLoading ? 'Analyzing...' : 'Scan Directory'}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Card */}
          <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] space-y-4">
            <h3 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">Storage Breakdown</h3>
            <div className="p-4 rounded-xl bg-[#171A23] border border-[#232838] space-y-2">
              <span className="text-xs text-[#969BAA]">Total Examined Size:</span>
              <p className="text-xl font-bold font-mono text-[#02FEDC]">{formatBytes(analysis.total_scanned_bytes)}</p>
              <p className="text-[11px] text-[#969BAA]">{analysis.file_count} files indexed</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#F5F7FA]">Top File Extensions:</h4>
              {Object.entries(analysis.extension_breakdown)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([ext, size]) => (
                  <div key={ext} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#969BAA]">.{ext}</span>
                    <span className="font-mono text-[#F5F7FA]">{formatBytes(size)}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Largest Files Table */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#11131A] border border-[#232838] space-y-4">
            <h3 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">Largest Files Identified</h3>
            <div className="border border-[#1D2230] rounded-xl overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B0D13] text-[#969BAA] border-b border-[#1D2230]">
                  <tr>
                    <th className="p-3">File Name</th>
                    <th className="p-3">Extension</th>
                    <th className="p-3 text-right">Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D2230]/60">
                  {analysis.largest_files.map((file, idx) => (
                    <tr key={idx} className="hover:bg-[#171A23]/50">
                      <td className="p-3 text-[#F5F7FA] font-medium truncate max-w-xs" title={file.path}>
                        {file.name}
                      </td>
                      <td className="p-3 text-[#969BAA] font-mono">.{file.extension}</td>
                      <td className="p-3 text-right font-mono text-[#02FEDC] font-semibold">
                        {formatBytes(file.size)}
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

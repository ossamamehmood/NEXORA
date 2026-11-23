import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, Download, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { CleanLog, QuarantineRecord, ScanLog } from '../../types';
import { NexoraApi } from '../../services/api';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const ActivityHistoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'clean' | 'scan' | 'quarantine'>('clean');
  const [cleanLogs, setCleanLogs] = useState<CleanLog[]>([]);
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
  const [quarantineRecords, setQuarantineRecords] = useState<QuarantineRecord[]>([]);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ msg: string; isError?: boolean } | null>(null);

  const loadData = () => {
    NexoraApi.getCleanHistory().then(setCleanLogs);
    NexoraApi.getScanHistory().then(setScanLogs);
    NexoraApi.getQuarantineRecords().then(setQuarantineRecords);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    setNotification(null);
    try {
      const res = await NexoraApi.restoreQuarantineRecord(id);
      setNotification({ msg: res || 'File successfully restored from quarantine vault.' });
      loadData();
    } catch (err: any) {
      setNotification({ msg: err?.toString() || 'Failed to restore file.', isError: true });
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#F5F7FA]">Activity History & Audit Log</h2>
          <p className="text-xs text-[#969BAA]">Immutable record of all maintenance operations and quarantined files</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#171A23] rounded-xl border border-[#232838]">
          <button
            onClick={() => setActiveTab('clean')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'clean' ? 'bg-[#02FEDC] text-[#08090D] font-bold' : 'text-[#969BAA] hover:text-[#F5F7FA]'
            }`}
          >
            Clean History
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'scan' ? 'bg-[#02FEDC] text-[#08090D] font-bold' : 'text-[#969BAA] hover:text-[#F5F7FA]'
            }`}
          >
            Scan Audits
          </button>
          <button
            onClick={() => setActiveTab('quarantine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'quarantine' ? 'bg-[#02FEDC] text-[#08090D] font-bold' : 'text-[#969BAA] hover:text-[#F5F7FA]'
            }`}
          >
            Quarantine Vault
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl flex items-center gap-2 text-xs border ${
          notification.isError
            ? 'bg-[#FF453A]/10 border-[#FF453A]/30 text-[#FF453A]'
            : 'bg-[#00E699]/10 border-[#00E699]/30 text-[#00E699]'
        }`}>
          {notification.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Content based on Active Tab */}
      <div className="border border-[#1D2230] rounded-xl overflow-hidden bg-[#11131A]">
        {activeTab === 'clean' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0D13] text-[#969BAA] border-b border-[#1D2230]">
              <tr>
                <th className="p-3.5 font-semibold">Timestamp</th>
                <th className="p-3.5 font-semibold">Cleaned Files</th>
                <th className="p-3.5 font-semibold">Space Reclaimed</th>
                <th className="p-3.5 font-semibold">Skipped (Locked)</th>
                <th className="p-3.5 font-semibold">Quarantine ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2230]/60">
              {cleanLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#171A23]/50">
                  <td className="p-3.5 font-mono text-[#F5F7FA]">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3.5 font-mono text-[#969BAA]">{log.cleaned_files} files</td>
                  <td className="p-3.5 font-mono text-[#00E699] font-semibold">{formatBytes(log.cleaned_bytes)}</td>
                  <td className="p-3.5 font-mono text-[#656C80]">{log.skipped_files}</td>
                  <td className="p-3.5 font-mono text-[11px] text-[#02FEDC]">{log.quarantine_id || 'Direct Delete'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'scan' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0D13] text-[#969BAA] border-b border-[#1D2230]">
              <tr>
                <th className="p-3.5 font-semibold">Timestamp</th>
                <th className="p-3.5 font-semibold">Total Scanned Files</th>
                <th className="p-3.5 font-semibold">Identified Size</th>
                <th className="p-3.5 font-semibold">Scan Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2230]/60">
              {scanLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#171A23]/50">
                  <td className="p-3.5 font-mono text-[#F5F7FA]">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3.5 font-mono text-[#969BAA]">{log.total_files} files</td>
                  <td className="p-3.5 font-mono text-[#02FEDC] font-semibold">{formatBytes(log.total_bytes)}</td>
                  <td className="p-3.5 font-mono text-[#656C80]">{log.duration_ms} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'quarantine' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0D13] text-[#969BAA] border-b border-[#1D2230]">
              <tr>
                <th className="p-3.5 font-semibold">Original Path</th>
                <th className="p-3.5 font-semibold">Size</th>
                <th className="p-3.5 font-semibold">Staged At</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2230]/60">
              {quarantineRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#171A23]/50">
                  <td className="p-3.5 font-mono text-[#F5F7FA] truncate max-w-sm" title={rec.original_path}>
                    {rec.original_path}
                  </td>
                  <td className="p-3.5 font-mono text-[#969BAA]">{formatBytes(rec.file_size)}</td>
                  <td className="p-3.5 font-mono text-[#656C80]">{new Date(rec.timestamp).toLocaleString()}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleRestore(rec.id)}
                      disabled={restoringId === rec.id}
                      className="px-2.5 py-1 rounded bg-[#02FEDC]/10 text-[#02FEDC] hover:bg-[#02FEDC]/20 font-medium transition-all"
                    >
                      {restoringId === rec.id ? 'Restoring...' : 'Restore File'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

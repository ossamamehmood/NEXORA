import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu, HardDrive, RefreshCw, XCircle } from 'lucide-react';
import { ProcessItem, RealtimeMetrics } from '../../types';
import { NexoraApi } from '../../services/api';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const SystemMonitorView: React.FC = () => {
  const [processes, setProcesses] = useState<ProcessItem[]>([]);
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcess, setSelectedProcess] = useState<ProcessItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [procList, liveMetrics] = await Promise.all([
        NexoraApi.getProcesses(),
        NexoraApi.getRealtimeMetrics(),
      ]);
      setProcesses(procList);
      setMetrics(liveMetrics);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleTerminate = async (pid: number) => {
    setErrorMsg(null);
    try {
      await NexoraApi.terminateProcess(pid);
      setSelectedProcess(null);
      fetchData();
    } catch (err: any) {
      setErrorMsg(typeof err === 'string' ? err : 'Unable to terminate process');
    }
  };

  const filteredProcesses = processes.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#969BAA]">
            <span className="flex items-center gap-1.5 font-medium">
              <Cpu className="w-3.5 h-3.5 text-[#02FEDC]" /> Global CPU Load
            </span>
            <span className="font-mono text-[#02FEDC] font-semibold">{Math.round(metrics?.cpu_usage_pct || 0)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#171A23] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#02FEDC] to-[#5A5CFF]" style={{ width: `${metrics?.cpu_usage_pct || 0}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#969BAA]">
            <span className="flex items-center gap-1.5 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-[#5A5CFF]" /> Memory Allocation
            </span>
            <span className="font-mono text-[#5A5CFF] font-semibold">
              {metrics ? Math.round((metrics.used_memory_bytes / metrics.total_memory_bytes) * 100) : 0}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#171A23] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5A5CFF] to-[#F502FD]"
              style={{ width: `${metrics ? (metrics.used_memory_bytes / metrics.total_memory_bytes) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#969BAA]">
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-[#00E699]" /> Active Processes
            </span>
            <span className="font-mono text-[#F5F7FA] font-semibold">{processes.length}</span>
          </div>
          <div className="w-full h-1.5 bg-[#171A23] rounded-full overflow-hidden">
            <div className="h-full bg-[#00E699] w-full opacity-60" />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#FF4757]/10 border border-[#FF4757]/30 text-xs text-[#FF4757] flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-[#FF4757] hover:underline">Dismiss</button>
        </div>
      )}

      {/* Process Table Header & Filter */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#F5F7FA]">Running Applications & Services</h3>
            <p className="text-xs text-[#969BAA]">Inspected via Windows NT Toolhelp snapshot</p>
          </div>

          <input
            type="text"
            placeholder="Search processes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-1.5 rounded-lg bg-[#171A23] border border-[#232838] text-xs text-[#F5F7FA] placeholder-[#656C80] focus:outline-none focus:border-[#02FEDC]"
          />
        </div>

        <div className="border border-[#1D2230] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0D13] text-[#969BAA] border-b border-[#1D2230]">
              <tr>
                <th className="p-3 font-semibold">PID</th>
                <th className="p-3 font-semibold">Process Name</th>
                <th className="p-3 font-semibold">Memory</th>
                <th className="p-3 font-semibold">CPU</th>
                <th className="p-3 font-semibold">Integrity</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2230]/60">
              {filteredProcesses.slice(0, 40).map((proc) => (
                <tr key={proc.pid} className="hover:bg-[#171A23]/50 transition-colors">
                  <td className="p-3 font-mono text-[#656C80]">{proc.pid}</td>
                  <td className="p-3 font-medium text-[#F5F7FA]">{proc.name}</td>
                  <td className="p-3 font-mono text-[#969BAA]">{formatBytes(proc.memory_bytes)}</td>
                  <td className="p-3 font-mono text-[#969BAA]">{proc.cpu_usage.toFixed(1)}%</td>
                  <td className="p-3">
                    {proc.is_system_critical ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20">
                        System Protected
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#171A23] text-[#969BAA]">
                        User Space
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {!proc.is_system_critical && (
                      <button
                        onClick={() => handleTerminate(proc.pid)}
                        className="px-2.5 py-1 rounded bg-[#FF4757]/10 hover:bg-[#FF4757]/20 text-[#FF4757] border border-[#FF4757]/20 text-[11px] font-semibold transition-all"
                      >
                        End Task
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

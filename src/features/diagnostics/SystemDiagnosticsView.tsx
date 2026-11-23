import React, { useState, useEffect } from 'react';
import { Stethoscope, ShieldCheck, HardDrive, Wifi, Cpu, RefreshCw, AlertTriangle } from 'lucide-react';
import { DiagnosticCheckResult, SystemOverview } from '../../types';
import { NexoraApi } from '../../services/api';

interface DiagnosticsProps {
  overview: SystemOverview | null;
}

export const SystemDiagnosticsView: React.FC<DiagnosticsProps> = ({ overview }) => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticCheckResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDiagnostics = async () => {
    setIsLoading(true);
    try {
      const res = await NexoraApi.runSystemDiagnostics();
      setDiagnostics(res);
    } catch (err) {
      console.error('Failed to run diagnostics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Warning':
        return 'bg-[#FF4757]/10 text-[#FF4757] border-[#FF4757]/20';
      case 'Good':
        return 'bg-[#02FEDC]/10 text-[#02FEDC] border-[#02FEDC]/20';
      default:
        return 'bg-[#00E699]/10 text-[#00E699] border-[#00E699]/20';
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#02FEDC]" />
            <h2 className="text-sm font-bold text-[#F5F7FA]">Live System Diagnostics</h2>
          </div>
          <p className="text-xs text-[#969BAA]">
            Evidence-based subsystem inspection. No fabricated error counts or fear-inducing warnings.
          </p>
        </div>

        <button
          onClick={fetchDiagnostics}
          disabled={isLoading}
          className="p-2 rounded-xl bg-[#171A23] hover:bg-[#1E2330] text-[#969BAA] border border-[#232838] transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#02FEDC]' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {diagnostics.map((check) => (
          <div key={check.id} className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#02FEDC]" />
                <h3 className="text-xs font-semibold text-[#F5F7FA]">{check.title}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(check.status)}`}>
                {check.status}
              </span>
            </div>
            <p className="text-xs text-[#969BAA] leading-relaxed">{check.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

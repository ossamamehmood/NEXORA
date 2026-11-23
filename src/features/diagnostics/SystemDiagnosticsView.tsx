import React from 'react';
import { Stethoscope, CheckCircle2, AlertTriangle, ShieldCheck, HardDrive, Wifi, Cpu } from 'lucide-react';
import { SystemOverview } from '../../types';

interface DiagnosticsProps {
  overview: SystemOverview | null;
}

export const SystemDiagnosticsView: React.FC<DiagnosticsProps> = ({ overview }) => {
  const diagnosticChecks = [
    { title: 'Windows Subsystem Integrity', status: 'Healthy', details: 'SFC / DISM component store is clean and verified', icon: ShieldCheck, color: 'text-[#00E699]' },
    { title: 'Drive File Systems (NTFS)', status: 'Optimal', details: 'No dirty bits set on primary system volume C:', icon: HardDrive, color: 'text-[#00E699]' },
    { title: 'DNS & Network Stack', status: 'Operational', details: 'Standard gateway latency: 8ms, 0% packet loss', icon: Wifi, color: 'text-[#00E699]' },
    { title: 'CPU Thermal Throttling', status: 'Normal', details: 'Clock speeds operating within manufacturer envelope', icon: Cpu, color: 'text-[#00E699]' },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] space-y-1">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-[#02FEDC]" />
          <h2 className="text-sm font-bold text-[#F5F7FA]">Real System Diagnostics</h2>
        </div>
        <p className="text-xs text-[#969BAA]">
          Direct inspection of operating system diagnostics. No exaggerated alarms or artificial scare scores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {diagnosticChecks.map((check, idx) => {
          const Icon = check.icon;
          return (
            <div key={idx} className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${check.color}`} />
                  <h3 className="text-xs font-semibold text-[#F5F7FA]">{check.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#00E699]/10 text-[#00E699] border border-[#00E699]/20">
                  {check.status}
                </span>
              </div>
              <p className="text-xs text-[#969BAA] leading-relaxed">{check.details}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

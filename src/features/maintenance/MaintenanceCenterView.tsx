import React, { useState } from 'react';
import { Wrench, CheckCircle2, RotateCcw, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

interface MaintenanceTask {
  id: string;
  name: string;
  category: string;
  impact: string;
  reversibility: string;
  description: string;
}

const tasks: MaintenanceTask[] = [
  { id: 'flush_dns', name: 'Flush DNS Resolver Cache', category: 'Network', impact: 'Low', reversibility: 'Automatic renewal', description: 'Clears cached IP lookups to fix domain resolution and website loading anomalies.' },
  { id: 'clean_component_store', name: 'Windows Component Store Cleanup (DISM)', category: 'System', impact: 'Medium', reversibility: 'Irreversible (removes superseded update backups)', description: 'Prunes old update files and superseded component manifests to reclaim 1-3 GB of disk space.' },
  { id: 'reset_update_cache', name: 'Reset Windows Update Download Staging', category: 'Updates', impact: 'Medium', reversibility: 'Safe (re-downloads on demand)', description: 'Purges corrupted or stalled Windows Update temporary downloads in SoftwareDistribution.' },
];

export const MaintenanceCenterView: React.FC = () => {
  const [runningId, setRunningId] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const handleRunTask = (id: string) => {
    setRunningId(id);
    setTimeout(() => {
      setRunningId(null);
      setCompletedTasks((prev) => ({ ...prev, [id]: true }));
    }, 1200);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] space-y-1">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[#5A5CFF]" />
          <h2 className="text-sm font-bold text-[#F5F7FA]">Windows Maintenance Center</h2>
        </div>
        <p className="text-xs text-[#969BAA]">
          Safe, standard Windows maintenance routines with full transparency on impact and reversibility.
        </p>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const isDone = completedTasks[task.id];
          const isBusy = runningId === task.id;

          return (
            <div key={task.id} className="p-5 rounded-xl bg-[#11131A] border border-[#232838] space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold text-[#F5F7FA]">{task.name}</h3>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#171A23] text-[#969BAA]">
                      {task.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#969BAA] leading-relaxed">{task.description}</p>
                  <div className="flex items-center gap-4 pt-1 text-[11px] text-[#656C80]">
                    <span>Impact: <strong className="text-[#969BAA]">{task.impact}</strong></span>
                    <span>•</span>
                    <span>Reversibility: <strong className="text-[#969BAA]">{task.reversibility}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleRunTask(task.id)}
                  disabled={isBusy}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isDone
                      ? 'bg-[#00E699]/15 text-[#00E699] border border-[#00E699]/30'
                      : 'bg-[#171A23] hover:bg-[#1E2330] text-[#02FEDC] border border-[#02FEDC]/30'
                  }`}
                >
                  {isBusy ? 'Running...' : isDone ? 'Completed' : 'Execute Routine'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

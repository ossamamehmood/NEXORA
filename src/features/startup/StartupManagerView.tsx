import React, { useState, useEffect } from 'react';
import { Rocket, ShieldCheck, ToggleLeft, ToggleRight, AlertCircle, RefreshCw } from 'lucide-react';
import { StartupEntry } from '../../types';
import { NexoraApi } from '../../services/api';

export const StartupManagerView: React.FC = () => {
  const [entries, setEntries] = useState<StartupEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const list = await NexoraApi.getStartupEntries();
      setEntries(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleToggle = async (entry: StartupEntry) => {
    const newStatus = !entry.enabled;
    try {
      await NexoraApi.toggleStartupEntry(entry.id, newStatus);
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, enabled: newStatus } : e))
      );
    } catch (err) {
      console.error('Failed to toggle startup entry:', err);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#02FEDC]" />
            <h2 className="text-sm font-bold text-[#F5F7FA]">Windows Startup Manager</h2>
          </div>
          <p className="text-xs text-[#969BAA]">
            Non-destructive toggling using native Windows 11/10 <code>StartupApproved</code> binary flags.
          </p>
        </div>

        <button
          onClick={fetchEntries}
          disabled={isLoading}
          className="p-2 rounded-xl bg-[#171A23] hover:bg-[#1E2330] text-[#969BAA] border border-[#232838] transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#02FEDC]' : ''}`} />
        </button>
      </div>

      {/* Startup Entries List */}
      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`p-4 rounded-xl border transition-all ${
              entry.enabled ? 'bg-[#11131A] border-[#2B3245]' : 'bg-[#0E1017] border-[#1D2230] opacity-80'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 max-w-[70%]">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-[#F5F7FA]">{entry.name}</h4>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#171A23] text-[#969BAA]">
                    {entry.location}
                  </span>
                  {entry.is_protected && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20">
                      System / Driver Protected
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-mono text-[#656C80] truncate">{entry.command}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle(entry)}
                  disabled={entry.is_protected}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    entry.is_protected
                      ? 'bg-[#171A23] text-[#656C80] cursor-not-allowed'
                      : entry.enabled
                      ? 'bg-[#00E699]/15 text-[#00E699] border border-[#00E699]/30 hover:bg-[#00E699]/25'
                      : 'bg-[#232838] text-[#969BAA] hover:bg-[#2B3245]'
                  }`}
                >
                  {entry.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

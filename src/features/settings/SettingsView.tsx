import React, { useState, useEffect } from 'react';
import { Settings, Shield, Moon, Sun, Monitor, Lock, Trash2, Plus } from 'lucide-react';
import { AppSettings } from '../../types';
import { NexoraApi } from '../../services/api';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    quarantine_enabled: true,
    keep_quarantine_days: 14,
    auto_check_updates: false,
    telemetry_enabled: false,
  });
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [newExclusionPath, setNewExclusionPath] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    NexoraApi.getAppSettings().then(setSettings);
    NexoraApi.getExclusions().then(setExclusions);
  }, []);

  const handleSave = async (updated: AppSettings) => {
    setSettings(updated);
    await NexoraApi.saveAppSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddExclusion = async () => {
    if (!newExclusionPath.trim()) return;
    await NexoraApi.addExclusion(newExclusionPath.trim());
    setExclusions((prev) => [...prev, newExclusionPath.trim()]);
    setNewExclusionPath('');
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#02FEDC]" />
            <h2 className="text-sm font-bold text-[#F5F7FA]">NEXORA Preferences</h2>
          </div>
          <p className="text-xs text-[#969BAA]">
            Configure safety quarantine limits, theme appearance, and custom exclusion paths.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-semibold text-[#00E699] bg-[#00E699]/10 px-3 py-1 rounded-full border border-[#00E699]/20 animate-fade-in">
            Preferences Saved
          </span>
        )}
      </div>

      {/* Theme Selection */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] space-y-4">
        <h3 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">Appearance & Theme</h3>
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[
            { id: 'dark', label: 'Dark Mode', icon: Moon },
            { id: 'light', label: 'Light Mode', icon: Sun },
            { id: 'system', label: 'Follow System', icon: Monitor },
          ].map((themeOpt) => {
            const Icon = themeOpt.icon;
            const isSelected = settings.theme === themeOpt.id;
            return (
              <button
                key={themeOpt.id}
                onClick={() => handleSave({ ...settings, theme: themeOpt.id as any })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#171A23] border-[#02FEDC] text-[#F5F7FA] shadow-md shadow-[#02FEDC]/10'
                    : 'bg-[#0E1017] border-[#1D2230] text-[#969BAA] hover:bg-[#12151D]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#02FEDC]' : 'text-[#656C80]'}`} />
                <span>{themeOpt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quarantine & Safety */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] space-y-4">
        <h3 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">Safety & Quarantine Vault</h3>
        <div className="space-y-4 max-w-xl">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-[#F5F7FA]">Enable Quarantine Staging</span>
              <p className="text-[11px] text-[#969BAA]">Stage files before removal to enable instant rollback</p>
            </div>
            <input
              type="checkbox"
              checked={settings.quarantine_enabled}
              onChange={(e) => handleSave({ ...settings, quarantine_enabled: e.target.checked })}
              className="rounded border-[#323A50] text-[#02FEDC] focus:ring-0"
            />
          </label>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#969BAA]">Retention Period:</span>
              <span className="font-mono text-[#02FEDC] font-semibold">{settings.keep_quarantine_days} Days</span>
            </div>
            <input
              type="range"
              min="3"
              max="60"
              value={settings.keep_quarantine_days}
              onChange={(e) => handleSave({ ...settings, keep_quarantine_days: parseInt(e.target.value) })}
              className="w-full accent-[#02FEDC]"
            />
          </div>
        </div>
      </div>

      {/* Exclusion Directory Rules */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] space-y-4">
        <h3 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">Exclusion Path Rules</h3>
        <p className="text-xs text-[#969BAA]">Directories listed here will be skipped across all scanning and cleaning engines.</p>

        <div className="flex items-center gap-2 max-w-xl">
          <input
            type="text"
            placeholder="e.g. C:\MyProjects\TemporaryWork"
            value={newExclusionPath}
            onChange={(e) => setNewExclusionPath(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-[#171A23] border border-[#232838] text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#02FEDC]"
          />
          <button
            onClick={handleAddExclusion}
            className="px-4 py-2 rounded-xl gradient-brand text-[#08090D] font-bold text-xs hover:opacity-95 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="space-y-2 max-w-xl">
          {exclusions.map((path, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-[#0E1017] border border-[#1D2230] flex items-center justify-between text-xs">
              <span className="font-mono text-[#969BAA] truncate">{path}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

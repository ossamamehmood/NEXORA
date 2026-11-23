import React, { useState } from 'react';
import { Layers, AlertTriangle, ShieldAlert, Check, Trash2 } from 'lucide-react';
import { RiskLevel } from '../../types';

interface DeepRuleItem {
  id: string;
  name: string;
  category: string;
  risk: RiskLevel;
  description: string;
  size: string;
  enabled: boolean;
}

const deepRules: DeepRuleItem[] = [
  { id: 'dev_node_modules', name: 'Stale Build Caches (npm, cargo, pip)', category: 'Developer', risk: 'Medium', description: 'Cached compiler artifacts and package manager tarballs older than 30 days', size: '3.4 GB', enabled: true },
  { id: 'dx_shader_cache', name: 'DirectX & GPU Shader Cache', category: 'Graphics', risk: 'Medium', description: 'Pre-compiled GPU shaders. Will be regenerated automatically by games on launch.', size: '1.8 GB', enabled: true },
  { id: 'win_upgrade_logs', name: 'Windows Upgrade Logs & Backups', category: 'System', risk: 'Low', description: 'Log files left behind after major Windows updates ($GetCurrent, Panther)', size: '820 MB', enabled: true },
  { id: 'delivery_optim', name: 'Delivery Optimization Cache', category: 'System', risk: 'Low', description: 'P2P update chunks previously shared with other local PCs', size: '1.2 GB', enabled: true },
  { id: 'prefetch_cache', name: 'Windows Prefetch Application Metadata', category: 'System', risk: 'High', description: 'Application launch acceleration binaries. Deleting this may temporarily slow initial app start times.', size: '140 MB', enabled: false },
  { id: 'font_cache', name: 'Windows Font Cache Service Data', category: 'System', risk: 'Medium', description: 'Font glyph rasterization index. Useful if fonts display corrupted characters.', size: '64 MB', enabled: false },
];

export const DeepCleanerView: React.FC = () => {
  const [rules, setRules] = useState<DeepRuleItem[]>(deepRules);
  const [confirmedHighRisk, setConfirmedHighRisk] = useState<Record<string, boolean>>({});

  const toggleRule = (id: string, risk: RiskLevel) => {
    if (risk === 'High' && !confirmedHighRisk[id]) {
      // Require explicit acknowledgement for high risk
      const ok = window.confirm(
        'WARNING: This is classified as a HIGH RISK rule. Clearing this location may affect application launch performance. Are you sure you wish to enable it?'
      );
      if (!ok) return;
      setConfirmedHighRisk((prev) => ({ ...prev, [id]: true }));
    }

    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-[#F5F7FA]">
          <Layers className="w-5 h-5 text-[#5A5CFF]" />
          <span>Advanced Deep Cleaner Definitions</span>
        </div>
        <p className="text-xs text-[#969BAA] leading-relaxed">
          Target developer artifacts, graphics shader caches, and obsolete update installers. High-risk rules are strictly disabled by default.
        </p>
      </div>

      {/* Rules Listing */}
      <div className="space-y-3">
        {rules.map((rule) => {
          const isHigh = rule.risk === 'High';
          const isMedium = rule.risk === 'Medium';

          return (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-all ${
                rule.enabled ? 'bg-[#11131A] border-[#2B3245]' : 'bg-[#0E1017] border-[#1D2230]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleRule(rule.id, rule.risk)}
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      rule.enabled
                        ? isHigh
                          ? 'bg-[#FF4757] border-[#FF4757] text-white'
                          : 'bg-[#5A5CFF] border-[#5A5CFF] text-white'
                        : 'border-[#323A50] hover:border-[#656C80]'
                    }`}
                  >
                    {rule.enabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-[#F5F7FA]">{rule.name}</h4>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${
                          isHigh
                            ? 'bg-[#FF4757]/10 text-[#FF4757] border-[#FF4757]/20'
                            : isMedium
                            ? 'bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/20'
                            : 'bg-[#02FEDC]/10 text-[#02FEDC] border-[#02FEDC]/20'
                        }`}
                      >
                        {rule.risk} Risk
                      </span>
                    </div>
                    <p className="text-xs text-[#969BAA]">{rule.description}</p>
                  </div>
                </div>

                <span className="font-mono text-xs font-medium text-[#F5F7FA] whitespace-nowrap">
                  {rule.size}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

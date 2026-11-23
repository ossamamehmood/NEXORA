import React, { useState } from 'react';
import { ShieldCheck, Globe, EyeOff, Lock, Check, AlertCircle } from 'lucide-react';

interface BrowserPrivacyItem {
  id: string;
  browser: string;
  item: string;
  description: string;
  safe: boolean;
  selected: boolean;
}

const privacyItems: BrowserPrivacyItem[] = [
  { id: 'chrome_cache', browser: 'Google Chrome', item: 'Cached Images and Files', description: 'Temporary web media. Does not affect active logins.', safe: true, selected: true },
  { id: 'chrome_history', browser: 'Google Chrome', item: 'Browsing History (URLs)', description: 'List of previously visited websites in the URL bar.', safe: true, selected: false },
  { id: 'edge_cache', browser: 'Microsoft Edge', item: 'Cached Web Resources', description: 'Temporary stylesheets, scripts, and media files.', safe: true, selected: true },
  { id: 'edge_history', browser: 'Microsoft Edge', item: 'Browsing History', description: 'Navigation records and typed search history.', safe: true, selected: false },
  { id: 'win_recent', browser: 'Windows Explorer', item: 'Recent File Jump Lists', description: 'Recently opened files shown in Start Menu and Taskbar.', safe: true, selected: true },
  { id: 'win_dns', browser: 'Network Subsystem', item: 'Local DNS Resolver Cache', description: 'Cached domain IP lookups. Flush to resolve DNS anomalies.', safe: true, selected: true },
];

export const PrivacyCenterView: React.FC = () => {
  const [items, setItems] = useState<BrowserPrivacyItem[]>(privacyItems);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i))
    );
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Privacy Invariant Banner */}
      <div className="p-6 rounded-2xl bg-[#00E699]/10 border border-[#00E699]/20 space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-[#00E699]">
          <Lock className="w-4 h-4" />
          <span>Zero Credential Tampering Guarantee</span>
        </div>
        <p className="text-xs text-[#E2E8F0] leading-relaxed">
          NEXORA will <strong>NEVER</strong> delete your saved passwords, active authentication cookies, or encrypted security keys by default. Your open accounts remain completely safe.
        </p>
      </div>

      {/* Privacy Items List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all ${
              item.selected ? 'bg-[#11131A] border-[#2B3245]' : 'bg-[#0E1017] border-[#1D2230]'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                    item.selected
                      ? 'bg-[#02FEDC] border-[#02FEDC] text-[#08090D]'
                      : 'border-[#323A50] hover:border-[#656C80]'
                  }`}
                >
                  {item.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-[#F5F7FA]">{item.item}</h4>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#171A23] text-[#969BAA]">
                      {item.browser}
                    </span>
                  </div>
                  <p className="text-xs text-[#969BAA]">{item.description}</p>
                </div>
              </div>

              <span className="text-[10px] font-semibold text-[#00E699] bg-[#00E699]/10 px-2 py-0.5 rounded">
                Protected
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ExternalLink, Search, RefreshCw, HardDrive } from 'lucide-react';
import { InstalledApp } from '../../types';
import { NexoraApi } from '../../services/api';

function formatBytes(bytes: number): string {
  if (bytes === 0) return 'Size unknown';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const ApplicationManagerView: React.FC = () => {
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const list = await NexoraApi.getInstalledApplications();
      setApps(list);
    } catch (err) {
      console.error('Failed to enumerate apps:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleLaunchUninstaller = () => {
    // Open Windows native Apps & Features
    window.open('ms-settings:appsfeatures');
  };

  const filtered = apps.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.publisher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#232838] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#F5F7FA]">Installed Applications Inventory</h2>
          <p className="text-xs text-[#969BAA]">
            Real Windows Registry software discovery across HKLM and HKCU.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchApps}
            disabled={isLoading}
            className="p-2 rounded-xl bg-[#171A23] hover:bg-[#1E2330] text-[#969BAA] border border-[#232838] transition-all"
            title="Refresh Applications"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#02FEDC]' : ''}`} />
          </button>

          <button
            onClick={handleLaunchUninstaller}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171A23] hover:bg-[#1E2330] text-[#02FEDC] border border-[#02FEDC]/30 text-xs font-semibold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Windows Installed Apps</span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Count */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#656C80] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search installed applications or publishers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#11131A] border border-[#232838] text-xs text-[#F5F7FA] placeholder-[#656C80] focus:outline-none focus:border-[#02FEDC]"
          />
        </div>
        <span className="text-xs text-[#969BAA] font-mono">
          {filtered.length} application{filtered.length === 1 ? '' : 's'} indexed
        </span>
      </div>

      {/* Table */}
      <div className="border border-[#1D2230] rounded-xl overflow-hidden bg-[#11131A]">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#969BAA] space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#02FEDC] mx-auto" />
            <p>Enumerating Windows Registry Uninstall Keys...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#969BAA]">
            No applications match your search query.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0D13] text-[#969BAA] border-b border-[#1D2230]">
              <tr>
                <th className="p-3.5 font-semibold">Application</th>
                <th className="p-3.5 font-semibold">Publisher</th>
                <th className="p-3.5 font-semibold">Version</th>
                <th className="p-3.5 font-semibold">Estimated Size</th>
                <th className="p-3.5 font-semibold">Installed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2230]/60">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-[#171A23]/50 transition-colors">
                  <td className="p-3.5 font-medium text-[#F5F7FA]">{app.name}</td>
                  <td className="p-3.5 text-[#969BAA]">{app.publisher}</td>
                  <td className="p-3.5 font-mono text-[#969BAA]">{app.version}</td>
                  <td className="p-3.5 font-mono text-[#02FEDC]">
                    {formatBytes(app.estimated_size_bytes)}
                  </td>
                  <td className="p-3.5 text-[#656C80] font-mono">{app.install_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

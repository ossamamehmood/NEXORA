import React, { useState } from 'react';
import { Boxes, ExternalLink, Trash2, Search } from 'lucide-react';

interface AppItem {
  id: string;
  name: string;
  publisher: string;
  version: string;
  size: string;
  installDate: string;
}

const installedApps: AppItem[] = [
  { id: '1', name: 'Google Chrome', publisher: 'Google LLC', version: '131.0.6778.86', size: '340 MB', installDate: '2024-11-10' },
  { id: '2', name: 'Visual Studio Code', publisher: 'Microsoft Corporation', version: '1.95.3', size: '420 MB', installDate: '2024-10-22' },
  { id: '3', name: 'Discord', publisher: 'Discord Inc.', version: '1.0.9168', size: '280 MB', installDate: '2024-09-15' },
  { id: '4', name: 'Spotify', publisher: 'Spotify AB', version: '1.2.50.335', size: '190 MB', installDate: '2024-11-02' },
  { id: '5', name: 'Node.js', publisher: 'OpenJS Foundation', version: '22.11.0', size: '92 MB', installDate: '2024-11-18' },
  { id: '6', name: 'Git', publisher: 'The Git Development Community', version: '2.47.0', size: '150 MB', installDate: '2024-08-30' },
];

export const ApplicationManagerView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleLaunchUninstaller = () => {
    // Open Windows native Apps & Features
    window.open('ms-settings:appsfeatures');
  };

  const filtered = installedApps.filter((app) =>
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
            Enumerate registered software and launch native Windows uninstallation routines.
          </p>
        </div>

        <button
          onClick={handleLaunchUninstaller}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171A23] hover:bg-[#1E2330] text-[#02FEDC] border border-[#02FEDC]/30 text-xs font-semibold transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Windows Installed Apps</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#656C80] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search installed applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#11131A] border border-[#232838] text-xs text-[#F5F7FA] placeholder-[#656C80] focus:outline-none focus:border-[#02FEDC]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#1D2230] rounded-xl overflow-hidden bg-[#11131A]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0B0D13] text-[#969BAA] border-b border-[#1D2230]">
            <tr>
              <th className="p-3.5 font-semibold">Application</th>
              <th className="p-3.5 font-semibold">Publisher</th>
              <th className="p-3.5 font-semibold">Version</th>
              <th className="p-3.5 font-semibold">Size</th>
              <th className="p-3.5 font-semibold">Installed Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1D2230]/60">
            {filtered.map((app) => (
              <tr key={app.id} className="hover:bg-[#171A23]/50">
                <td className="p-3.5 font-medium text-[#F5F7FA]">{app.name}</td>
                <td className="p-3.5 text-[#969BAA]">{app.publisher}</td>
                <td className="p-3.5 font-mono text-[#969BAA]">{app.version}</td>
                <td className="p-3.5 font-mono text-[#02FEDC]">{app.size}</td>
                <td className="p-3.5 text-[#656C80]">{app.installDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

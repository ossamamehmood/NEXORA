import React, { useState, useEffect } from 'react';
import {
  PieChart,
  FolderSearch,
  HardDrive,
  FileText,
  ChevronRight,
  Orbit,
  List,
  Sparkles,
  FileArchive,
  Film,
  Image as ImageIcon,
  Package,
  Layers,
} from 'lucide-react';
import { DiskAnalysisResult } from '../../types';
import { NexoraApi } from '../../services/api';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

interface BubbleItem {
  id: string;
  name: string;
  size: number;
  category: string;
  icon: any;
  color: string;
}

const defaultBubbles: BubbleItem[] = [
  { id: '1', name: 'VirtualDisks.vhdx', size: 48962000000, category: 'Archives', icon: FileArchive, color: '#F502FD' },
  { id: '2', name: 'Render_Projects_4K', size: 18450000000, category: 'Media', icon: Film, color: '#6E56FF' },
  { id: '3', name: 'Textures_Pack_Ultra', size: 12200000000, category: 'Assets', icon: ImageIcon, color: '#0088FF' },
  { id: '4', name: 'Game_Binaries_Depot', size: 8750000000, category: 'Apps', icon: Package, color: '#02FEDC' },
  { id: '5', name: 'Docker_WSL_Storage', size: 6100000000, category: 'System', icon: HardDrive, color: '#00E699' },
  { id: '6', name: 'Local_Cache_Blobs', size: 3400000000, category: 'Cache', icon: Layers, color: '#FFB800' },
];

export const DiskAnalyzerView: React.FC = () => {
  const [targetDir, setTargetDir] = useState('C:\\Users');
  const [viewMode, setViewMode] = useState<'spacelens' | 'table'>('spacelens');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DiskAnalysisResult | null>(null);
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>('1');

  useEffect(() => {
    handleAnalyze();
  }, []);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const res = await NexoraApi.analyzeDirectory(targetDir);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert real scan results to bubbles if available
  const displayBubbles = analysis && analysis.largest_files.length > 0
    ? analysis.largest_files.slice(0, 6).map((f, i) => ({
        id: String(i),
        name: f.name,
        size: f.size,
        category: f.extension.toUpperCase(),
        icon: f.extension === 'zip' || f.extension === 'rar' ? FileArchive : Film,
        color: i % 2 === 0 ? '#F502FD' : i % 3 === 0 ? '#02FEDC' : '#6E56FF',
      }))
    : defaultBubbles;

  const selectedItem = displayBubbles.find((b) => b.id === selectedBubbleId) || displayBubbles[0];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Header and View Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl luxury-glass border border-white/[0.08] shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Orbit className="w-5 h-5 text-[#F502FD]" />
            <h2 className="text-xl font-black text-white tracking-tight">Space Lens & Storage Visualizer</h2>
            <span className="text-[10px] font-bold text-[#02FEDC] px-2 py-0.5 rounded-full bg-[#02FEDC]/10 border border-[#02FEDC]/30">
              CleanMyMac X Inspired
            </span>
          </div>
          <p className="text-xs text-[#C8BEDC]">
            Explore and locate gigantic folders and files through interactive cosmic bubbles and storage maps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/[0.08] text-xs">
            <button
              onClick={() => setViewMode('spacelens')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'spacelens'
                  ? 'bg-gradient-to-r from-[#F502FD] to-[#6E56FF] text-white shadow-md'
                  : 'text-[#C8BEDC] hover:text-white'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>Space Lens</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-[#F502FD] to-[#6E56FF] text-white shadow-md'
                  : 'text-[#C8BEDC] hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl gradient-brand text-[#08090D] font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            {isLoading ? 'Scanning...' : 'Rescan'}
          </button>
        </div>
      </div>

      {/* SPACE LENS BUBBLE VISUALIZER (Image 5) */}
      {viewMode === 'spacelens' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: File Tree & Selector */}
          <div className="lg:col-span-5 p-6 rounded-2xl luxury-card border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Indexed Folders</span>
              <span className="text-[11px] text-[#02FEDC] font-mono">6 Gigantic Targets</span>
            </div>

            <div className="space-y-2.5">
              {displayBubbles.map((bubble) => {
                const IconComponent = bubble.icon;
                const isSelected = bubble.id === selectedBubbleId;

                return (
                  <div
                    key={bubble.id}
                    onClick={() => setSelectedBubbleId(bubble.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#6E56FF]/25 to-[#F502FD]/20 border-[#F502FD]/60 shadow-lg'
                        : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${bubble.color}20`,
                          borderColor: `${bubble.color}40`,
                          color: bubble.color,
                        }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{bubble.name}</p>
                        <p className="text-[10px] text-[#8E80A8]">{bubble.category}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#02FEDC] shrink-0">
                      {formatBytes(bubble.size)}
                    </span>
                  </div>
                );
              })}
            </div>

            {selectedItem && (
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-[#C8BEDC]">Selected Target:</span>
                <span className="font-bold text-white">{formatBytes(selectedItem.size)}</span>
              </div>
            )}
          </div>

          {/* Right Column: Planetary Bubble Stage (Image 5) */}
          <div className="lg:col-span-7 p-8 rounded-2xl luxury-glass border border-white/[0.12] flex flex-col justify-between relative overflow-hidden min-h-[480px]">
            {/* Ambient Background Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-[#F502FD]/15 via-[#6E56FF]/20 to-[#02FEDC]/15 blur-3xl pointer-events-none" />

            {/* Bubble Canvas */}
            <div className="relative flex-1 flex flex-wrap items-center justify-center gap-6 p-4 z-10">
              {displayBubbles.map((bubble, idx) => {
                const IconComponent = bubble.icon;
                const isSelected = bubble.id === selectedBubbleId;

                // Scale sizes to bubble diameters
                const diameters = [140, 115, 100, 90, 80, 75];
                const sizePx = diameters[idx % diameters.length];

                return (
                  <div
                    key={bubble.id}
                    onClick={() => setSelectedBubbleId(bubble.id)}
                    style={{
                      width: `${sizePx}px`,
                      height: `${sizePx}px`,
                      borderColor: isSelected ? '#02FEDC' : `${bubble.color}60`,
                      boxShadow: isSelected
                        ? '0 0 30px rgba(2, 254, 220, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.4)'
                        : undefined,
                    }}
                    className={`space-lens-bubble p-3 text-center relative group select-none ${
                      isSelected ? 'ring-4 ring-[#02FEDC]/40 scale-105' : ''
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-white/90 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-white truncate max-w-[90%] leading-tight">
                      {bubble.name.replace(/\.[^/.]+$/, '')}
                    </span>
                    <span className="text-[9px] font-mono font-black text-[#02FEDC] mt-0.5">
                      {formatBytes(bubble.size)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Target Detail Strip */}
            <div className="z-10 pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#8E80A8] tracking-widest">Selected Item</span>
                <p className="text-xs font-bold text-white">{selectedItem.name}</p>
              </div>

              <button
                onClick={() => alert(`Reviewing path: ${selectedItem.name}`)}
                className="px-5 py-2.5 rounded-xl gradient-brand text-[#08090D] font-extrabold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Review and Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl luxury-card border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Extensions</h3>
            <div className="space-y-2">
              {Object.entries(analysis.extension_breakdown)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([ext, size]) => (
                  <div key={ext} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/[0.03]">
                    <span className="font-mono text-[#C8BEDC]">.{ext}</span>
                    <span className="font-mono text-[#02FEDC] font-bold">{formatBytes(size)}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="lg:col-span-2 p-6 rounded-2xl luxury-card border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Largest Files</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {analysis.largest_files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <span className="font-medium text-white truncate max-w-sm">{file.name}</span>
                  <span className="font-mono text-[#02FEDC] font-bold">{formatBytes(file.size)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

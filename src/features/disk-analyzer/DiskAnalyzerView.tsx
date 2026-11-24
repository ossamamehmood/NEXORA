import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Folder,
  FileArchive,
  Film,
  Music,
  Check,
  Trash2,
  HardDrive,
  Sparkles,
} from 'lucide-react';

interface SpaceLensItem {
  id: string;
  name: string;
  shortName: string;
  sizeStr: string;
  sizeBytes: number;
  type: 'archive' | 'folder' | 'video' | 'audio' | 'other';
  selected: boolean;
  bubbleColor: string;
  bubbleSizePx: number;
}

const initialItems: SpaceLensItem[] = [
  {
    id: '1',
    name: 'FinalCutPro Assets.zip',
    shortName: 'FinalCut...sets.zip',
    sizeStr: '47,6 GB',
    sizeBytes: 47600000000,
    type: 'archive',
    selected: true,
    bubbleColor: '#6E2A8D',
    bubbleSizePx: 160,
  },
  {
    id: '2',
    name: 'FinalCutPro Templates.zip',
    shortName: 'FinalCu...tes.zip',
    sizeStr: '11,1 GB',
    sizeBytes: 11100000000,
    type: 'archive',
    selected: true,
    bubbleColor: '#6E2A8D',
    bubbleSizePx: 120,
  },
  {
    id: '3',
    name: 'Photography Portfolio',
    shortName: 'Photog...ortfolio',
    sizeStr: '10,9 GB',
    sizeBytes: 10900000000,
    type: 'folder',
    selected: false,
    bubbleColor: '#2B5B9E',
    bubbleSizePx: 115,
  },
  {
    id: '4',
    name: 'textures 4K set',
    shortName: 'textures 4K set',
    sizeStr: '9,4 GB',
    sizeBytes: 9400000000,
    type: 'folder',
    selected: true,
    bubbleColor: '#2B5B9E',
    bubbleSizePx: 110,
  },
  {
    id: '5',
    name: 'Photoshoot 05.07',
    shortName: 'Phot...5.07',
    sizeStr: '483 MB',
    sizeBytes: 483000000,
    type: 'folder',
    selected: false,
    bubbleColor: '#1A3F70',
    bubbleSizePx: 70,
  },
  {
    id: '6',
    name: 'workinprogress02.MOV',
    shortName: 'wor...OV',
    sizeStr: '461 MB',
    sizeBytes: 461000000,
    type: 'video',
    selected: false,
    bubbleColor: '#2A1F45',
    bubbleSizePx: 65,
  },
  {
    id: '7',
    name: 'workinprogress01.MOV',
    shortName: 'workinprogress01.MOV',
    sizeStr: '445 MB',
    sizeBytes: 445000000,
    type: 'video',
    selected: true,
    bubbleColor: '#601F70',
    bubbleSizePx: 65,
  },
  {
    id: '8',
    name: 'sound 01.wav',
    shortName: 'sou...wav',
    sizeStr: '231 MB',
    sizeBytes: 231000000,
    type: 'audio',
    selected: false,
    bubbleColor: '#201A38',
    bubbleSizePx: 58,
  },
  {
    id: '9',
    name: 'Other items',
    shortName: 'Other items',
    sizeStr: '821 MB',
    sizeBytes: 821000000,
    type: 'other',
    selected: false,
    bubbleColor: '#1A122E',
    bubbleSizePx: 75,
  },
];

export const DiskAnalyzerView: React.FC = () => {
  const [items, setItems] = useState<SpaceLensItem[]>(initialItems);
  const [activeBubbleId, setActiveBubbleId] = useState<string>('6'); // workinprogress02.MOV (highlighted ring in Image 5)
  const [selectionMode, setSelectionMode] = useState<'manually' | 'all'>('manually');
  const [isRemovedSuccess, setIsRemovedSuccess] = useState(false);

  const toggleSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const selectedCount = items.filter((i) => i.selected).length;
  const selectedBytes = items
    .filter((i) => i.selected)
    .reduce((acc, curr) => acc + curr.sizeBytes, 0);
  const selectedGb = (selectedBytes / 1000000000).toFixed(1).replace('.', ',');

  const handleRemove = () => {
    setIsRemovedSuccess(true);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => !i.selected));
      setIsRemovedSuccess(false);
    }, 1500);
  };

  const getItemIcon = (type: SpaceLensItem['type']) => {
    switch (type) {
      case 'archive':
        return <FileArchive className="w-4 h-4 text-white" />;
      case 'folder':
        return <Folder className="w-4 h-4 text-[#0088FF]" fill="#0088FF" />;
      case 'video':
        return <Film className="w-4 h-4 text-[#A78BFA]" />;
      case 'audio':
        return <Music className="w-4 h-4 text-[#02FEDC]" />;
      default:
        return <HardDrive className="w-4 h-4 text-[#C8BEDC]" />;
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-4 max-w-7xl mx-auto select-none overflow-hidden">
      {/* 1. TOP HEADER & BREADCRUMBS (IMAGE 5) */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs">
        {/* Left: Start Over */}
        <button
          onClick={() => setItems(initialItems)}
          className="flex items-center gap-1.5 text-[#C8BEDC] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-[#02FEDC]" />
          <span>Start Over</span>
        </button>

        {/* Center: Title */}
        <h1 className="text-sm font-bold text-white tracking-wide font-mono">
          Space Lens
        </h1>

        {/* Right: Breadcrumbs & Storage Usage Bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-[#C8BEDC]">
            <button className="p-1 rounded hover:bg-white/10 text-white"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded hover:bg-white/10 text-white"><ChevronRight className="w-3.5 h-3.5" /></button>
            <span className="flex items-center gap-1 ml-1 text-white/90">
              <HardDrive className="w-3.5 h-3.5 text-[#02FEDC]" />
              Local Disk (C:) &gt; Users &gt; ossama &gt; Documents
            </span>
          </div>

          <div className="flex items-center gap-2 pl-4 border-l border-white/[0.1]">
            <span className="text-[11px] text-[#C8BEDC] font-mono">381 GB of 494 GB used</span>
            <div className="w-24 h-1.5 rounded-full bg-black/40 overflow-hidden flex border border-white/10">
              <div className="h-full bg-gradient-to-r from-[#0088FF] to-[#F502FD]" style={{ width: '77%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN SPLIT STAGE: LEFT FILE LIST + RIGHT BUBBLE CLUSTER */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-hidden">
        {/* LEFT COLUMN: FOLDER & CHECKLIST (IMAGE 5) */}
        <div className="lg:col-span-5 luxury-glass rounded-3xl p-5 border border-white/[0.08] flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
            {/* Folder Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-2xl bg-[#0088FF]/20 border border-[#0088FF]/40 flex items-center justify-center shrink-0">
                <Folder className="w-5 h-5 text-[#4FA8FF]" fill="#4FA8FF" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-extrabold text-white truncate">Documents</h2>
                <p className="text-[11px] text-[#8E80A8] font-mono">81,5 GB | 81 items</p>
              </div>
            </div>

            {/* Selection Dropdown */}
            <div className="flex items-center justify-between text-xs text-[#C8BEDC] py-1">
              <span className="font-medium text-white/70">Select: <span className="text-white font-bold cursor-pointer">Manually ▾</span></span>
              <span className="text-[10px] text-[#02FEDC] font-mono font-bold">Space Sort</span>
            </div>

            {/* Checklist List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {items.map((item) => {
                const isActive = item.id === activeBubbleId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveBubbleId(item.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#F502FD]/25 to-white/[0.08] border border-[#F502FD]/50 shadow-md'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelect(item.id);
                        }}
                        className="w-4 h-4 rounded accent-[#F502FD] bg-black/40 border border-white/20 cursor-pointer shrink-0"
                      />
                      <div className="shrink-0">{getItemIcon(item.type)}</div>
                      <span className="text-xs text-white truncate group-hover:text-[#02FEDC] transition-colors">
                        {item.name}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#C8BEDC] shrink-0 ml-2">
                      {item.sizeStr}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: COSMIC BUBBLE PACK CLUSTER (IMAGE 5) */}
        <div className="lg:col-span-7 luxury-glass rounded-3xl p-6 border border-white/[0.1] relative flex flex-col items-center justify-center overflow-hidden shadow-2xl">
          {/* Ambient Cosmic Purple Backdrop Rays */}
          <div className="absolute inset-0 bg-gradient-radial from-[#45126B]/40 via-[#20073B]/30 to-[#0A0216] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-[#F502FD]/10 via-[#6E56FF]/15 to-transparent blur-3xl pointer-events-none" />

          {/* Organic Floating Bubble Cluster (Matching Image 5 layout) */}
          <div className="relative z-10 w-full h-full flex flex-wrap items-center justify-center gap-6 p-4">
            {/* Bubble 1: FinalCutPro Assets.zip (47,6 GB) */}
            <div
              onClick={() => {
                setActiveBubbleId('1');
                toggleSelect('1');
              }}
              style={{ width: '160px', height: '160px' }}
              className="rounded-full bg-gradient-to-tr from-[#3D0A54] via-[#65158A] to-[#8C24BC] border border-[#C56BFF]/50 shadow-[0_0_35px_rgba(140,36,188,0.4)] flex flex-col items-center justify-center text-center p-3 cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <FileArchive className="w-8 h-8 text-white mb-1" />
              <span className="text-xs font-bold text-white leading-tight">FinalCut...sets.zip</span>
              <span className="text-[11px] font-mono text-[#D598FF] font-bold mt-0.5">47,6 GB</span>
            </div>

            {/* Bubble 2: FinalCutPro Templates.zip (11,1 GB) */}
            <div
              onClick={() => {
                setActiveBubbleId('2');
                toggleSelect('2');
              }}
              style={{ width: '120px', height: '120px' }}
              className="rounded-full bg-gradient-to-tr from-[#33094A] via-[#521074] to-[#751B9E] border border-[#B352F5]/40 shadow-[0_0_25px_rgba(117,27,158,0.35)] flex flex-col items-center justify-center text-center p-2 cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <FileArchive className="w-6 h-6 text-white mb-0.5" />
              <span className="text-[11px] font-bold text-white leading-tight">FinalCu...tes.zip</span>
              <span className="text-[10px] font-mono text-[#D598FF] font-bold">11,1 GB</span>
            </div>

            {/* Bubble 3: Photography Portfolio (10,9 GB) */}
            <div
              onClick={() => {
                setActiveBubbleId('3');
                toggleSelect('3');
              }}
              style={{ width: '115px', height: '115px' }}
              className="rounded-full bg-gradient-to-tr from-[#0F284E] via-[#1A437C] to-[#2563EB] border border-[#60A5FA]/40 shadow-[0_0_25px_rgba(37,99,235,0.3)] flex flex-col items-center justify-center text-center p-2 cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <Folder className="w-6 h-6 text-[#93C5FD] mb-0.5" fill="#93C5FD" />
              <span className="text-[11px] font-bold text-white leading-tight">Photog...ortfolio</span>
              <span className="text-[10px] font-mono text-[#93C5FD] font-bold">10,9 GB</span>
            </div>

            {/* Bubble 4: textures 4K set (9,4 GB) */}
            <div
              onClick={() => {
                setActiveBubbleId('4');
                toggleSelect('4');
              }}
              style={{ width: '110px', height: '110px' }}
              className="rounded-full bg-gradient-to-tr from-[#122A4E] via-[#1E4E8A] to-[#1D4ED8] border border-[#60A5FA]/40 shadow-[0_0_20px_rgba(29,78,216,0.3)] flex flex-col items-center justify-center text-center p-2 cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <Folder className="w-6 h-6 text-[#93C5FD] mb-0.5" fill="#93C5FD" />
              <span className="text-[11px] font-bold text-white leading-tight">textures 4K set</span>
              <span className="text-[10px] font-mono text-[#93C5FD] font-bold">9,4 GB</span>
            </div>

            {/* Bubble 5: Photoshoot 05.07 (483 MB) */}
            <div
              onClick={() => {
                setActiveBubbleId('5');
                toggleSelect('5');
              }}
              style={{ width: '75px', height: '75px' }}
              className="rounded-full bg-gradient-to-tr from-[#0C1E38] via-[#163660] to-[#1E40AF] border border-[#3B82F6]/30 flex flex-col items-center justify-center text-center p-1.5 cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <Folder className="w-4 h-4 text-[#93C5FD]" fill="#93C5FD" />
              <span className="text-[9px] font-bold text-white leading-tight">Phot...5.07</span>
            </div>

            {/* Bubble 6: Active Highlighted Bubble (workinprogress02.MOV / wor...OV) with Glowing Magenta Ring */}
            <div
              onClick={() => {
                setActiveBubbleId('6');
                toggleSelect('6');
              }}
              style={{ width: '85px', height: '85px' }}
              className="rounded-full bg-gradient-to-tr from-[#450A35] to-[#7A155C] border-2 border-[#F502FD] shadow-[0_0_25px_#F502FD] flex flex-col items-center justify-center text-center p-1.5 cursor-pointer transform scale-110 transition-all duration-300 relative animate-pulse"
            >
              <Film className="w-5 h-5 text-[#F502FD] mb-0.5" />
              <span className="text-[10px] font-bold text-white leading-tight">wor...OV</span>
            </div>

            {/* Bubble 7: sound 01.wav (231 MB) */}
            <div
              onClick={() => {
                setActiveBubbleId('8');
                toggleSelect('8');
              }}
              style={{ width: '65px', height: '65px' }}
              className="rounded-full bg-gradient-to-tr from-[#1B1238] to-[#341F63] border border-[#8B5CF6]/30 flex flex-col items-center justify-center text-center p-1 cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <Music className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-[8px] font-bold text-white">sou...wav</span>
            </div>

            {/* Bubble 8: Other items (821 MB) */}
            <div
              onClick={() => {
                setActiveBubbleId('9');
                toggleSelect('9');
              }}
              style={{ width: '70px', height: '70px' }}
              className="rounded-full bg-[#120B24] border border-white/10 flex flex-col items-center justify-center text-center p-1 cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <span className="w-2 h-2 rounded-full bg-[#8E80A8] mb-1" />
              <span className="text-[8px] text-[#C8BEDC]">Other items</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SUMMARY & ACTION BAR (IMAGE 5) */}
      <div className="flex items-center justify-between p-4 rounded-2xl luxury-glass border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-white font-bold">{selectedCount} Items selected</span>
          <span className="text-[#8E80A8]">|</span>
          <span className="text-[#02FEDC] font-mono font-bold">{selectedGb} GB</span>
        </div>

        <button
          onClick={handleRemove}
          disabled={selectedCount === 0 || isRemovedSuccess}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F502FD] to-[#B502BC] hover:from-[#FF2EF5] hover:to-[#CF02D8] text-white text-xs font-bold shadow-lg shadow-[#F502FD]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          {isRemovedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Removed!</span>
            </>
          ) : (
            <>
              <Trash2 className="w-3.5 h-3.5" />
              <span>Review and Remove</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

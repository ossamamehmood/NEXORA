import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Zap,
  Power,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Sliders,
  Plus,
  Trash2,
  Activity,
  Layers,
  Clock,
  Cpu,
  HardDrive,
  Info,
} from 'lucide-react';
import {
  BackgroundAppCandidate,
  DetectedGame,
  GameProfile,
  GamingModeState,
} from '../../types';
import { NexoraApi } from '../../services/api';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hrs === 0) return `${remMins}m ${secs}s`;
  return `${hrs}h ${remMins}m`;
}

export const GamingModeView: React.FC = () => {
  const [gamingState, setGamingState] = useState<GamingModeState | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<'Balanced' | 'Performance' | 'Custom'>('Performance');
  const [isToggling, setIsToggling] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'background' | 'games' | 'logs'>('overview');

  // Background apps state
  const [backgroundApps, setBackgroundApps] = useState<BackgroundAppCandidate[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [closingPid, setClosingPid] = useState<number | null>(null);

  // Custom games profile state
  const [profiles, setProfiles] = useState<GameProfile[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [newGameExe, setNewGameExe] = useState('');
  const [newGamePriority, setNewGamePriority] = useState<'High' | 'AboveNormal'>('High');

  // Notification / banner
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchState = async () => {
    try {
      const state = await NexoraApi.getGamingModeState();
      setGamingState(state);
      if (state.preset) {
        setSelectedPreset(state.preset);
      }
    } catch (err) {
      console.error('Failed to load gaming state:', err);
    }
  };

  const fetchBackgroundApps = async () => {
    setIsLoadingApps(true);
    try {
      const apps = await NexoraApi.getBackgroundProcessCandidates();
      setBackgroundApps(apps);
    } catch (err) {
      console.error('Failed to fetch background apps:', err);
    } finally {
      setIsLoadingApps(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const gameProfiles = await NexoraApi.getCustomGameProfiles();
      setProfiles(gameProfiles);
    } catch (err) {
      console.error('Failed to fetch game profiles:', err);
    }
  };

  useEffect(() => {
    fetchState();
    fetchBackgroundApps();
    fetchProfiles();

    const interval = setInterval(() => {
      // Gentle polling for gaming session duration and active game detection
      NexoraApi.getGamingModeState().then((state) => {
        if (state) {
          setGamingState(state);
        }
      }).catch(() => {});
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleGamingMode = async () => {
    if (!gamingState) return;
    setIsToggling(true);
    try {
      const nextEnable = !gamingState.is_enabled;
      const updated = await NexoraApi.toggleGamingMode(nextEnable, selectedPreset);
      setGamingState(updated);
      setStatusMessage(
        nextEnable
          ? `Gaming Mode engaged (${selectedPreset}). Process priorities elevated and High Performance power scheme applied.`
          : 'Gaming Mode disengaged. Default power scheme and normal process priorities restored.'
      );
      setTimeout(() => setStatusMessage(null), 5000);
      fetchBackgroundApps();
    } catch (err) {
      console.error('Failed to toggle gaming mode:', err);
      setStatusMessage('Error toggling Gaming Mode. Please check system permissions.');
    } finally {
      setIsToggling(false);
    }
  };

  const handleCloseProcess = async (pid: number, name: string) => {
    setClosingPid(pid);
    try {
      const success = await NexoraApi.closeBackgroundProcess(pid);
      if (success) {
        setBackgroundApps((prev) => prev.filter((p) => p.pid !== pid));
        setStatusMessage(`Process ${name} (PID ${pid}) closed successfully.`);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to close process:', err);
    } finally {
      setClosingPid(null);
    }
  };

  const handleAddGameProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName.trim() || !newGameExe.trim()) return;

    let cleanExe = newGameExe.trim();
    if (!cleanExe.toLowerCase().endsWith('.exe')) {
      cleanExe += '.exe';
    }

    const newProfile: GameProfile = {
      id: `custom-${Date.now()}`,
      name: newGameName.trim(),
      executable: cleanExe,
      priority: newGamePriority,
      auto_detect: true,
    };

    try {
      await NexoraApi.addCustomGameProfile(newProfile);
      setProfiles((prev) => [...prev, newProfile]);
      setShowAddModal(false);
      setNewGameName('');
      setNewGameExe('');
      setStatusMessage(`Profile for "${newProfile.name}" added to detection engine.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error('Failed to add game profile:', err);
    }
  };

  const isEnabled = gamingState?.is_enabled ?? false;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-6">
      {/* Status banner */}
      {statusMessage && (
        <div className="bg-[#11131A] border border-[#02FEDC]/40 text-[#F5F7FA] px-4 py-3 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#02FEDC]" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-[#969BAA] hover:text-[#F5F7FA] text-xs font-mono"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Master Control Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 p-6 ${
          isEnabled
            ? 'bg-gradient-to-r from-[#0d141f] via-[#101b2b] to-[#121424] border-[#02FEDC]/60 shadow-lg shadow-[#02FEDC]/10'
            : 'bg-[#11131A] border-[#1D2230]'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isEnabled
                    ? 'bg-[#02FEDC]/20 text-[#02FEDC] shadow-md shadow-[#02FEDC]/20'
                    : 'bg-[#1A1E2B] text-[#656C80]'
                }`}
              >
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#F5F7FA] tracking-wide">
                    Gaming Mode Engine
                  </h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase border ${
                      isEnabled
                        ? 'bg-[#02FEDC]/15 text-[#02FEDC] border-[#02FEDC]/30 animate-pulse'
                        : 'bg-[#1A1E2B] text-[#969BAA] border-[#2B3245]'
                    }`}
                  >
                    {isEnabled ? 'ACTIVE • OPTIMIZED' : 'STANDBY'}
                  </span>
                </div>
                <p className="text-xs text-[#969BAA]">
                  Dynamic process priority elevation, Windows power plan orchestration, and non-essential background suppression.
                </p>
              </div>
            </div>

            {/* Reversible guarantee notice */}
            <div className="flex items-center gap-2 pt-2 text-[11px] text-[#969BAA]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#02FEDC]" />
              <span>
                <strong className="text-[#F5F7FA]">100% Reversible Guarantee:</strong> Original power scheme and normal process priorities restore immediately upon deactivation or exit.
              </span>
            </div>
          </div>

          {/* Master Toggle and Preset Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {/* Preset Selector */}
            <div className="flex bg-[#08090D] p-1 rounded-xl border border-[#232838]">
              {(['Balanced', 'Performance'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSelectedPreset(preset)}
                  disabled={isEnabled}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedPreset === preset
                      ? 'bg-[#1D2230] text-[#02FEDC] shadow-sm font-semibold'
                      : 'text-[#969BAA] hover:text-[#F5F7FA]'
                  } ${isEnabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Toggle Button */}
            <button
              onClick={handleToggleGamingMode}
              disabled={isToggling}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-200 shadow-md ${
                isEnabled
                  ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-[#EF4444]/20'
                  : 'bg-gradient-to-r from-[#02FEDC] to-[#5A5CFF] hover:brightness-110 text-[#08090D] shadow-[#02FEDC]/20'
              } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Power className={`w-4 h-4 ${isToggling ? 'animate-spin' : ''}`} />
              <span>{isToggling ? 'Applying...' : isEnabled ? 'Disengage Mode' : 'Engage Gaming Mode'}</span>
            </button>
          </div>
        </div>

        {/* Live Telemetry Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#1D2230]/70">
          <div className="bg-[#08090D]/60 rounded-xl p-3 border border-[#1D2230]">
            <span className="text-[10px] text-[#969BAA] uppercase tracking-wider block font-medium">
              Active Game
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Activity className="w-3.5 h-3.5 text-[#02FEDC]" />
              <span className="text-xs font-semibold text-[#F5F7FA] truncate">
                {gamingState?.active_game ? gamingState.active_game.name : 'Auto-Detect Active'}
              </span>
            </div>
          </div>

          <div className="bg-[#08090D]/60 rounded-xl p-3 border border-[#1D2230]">
            <span className="text-[10px] text-[#969BAA] uppercase tracking-wider block font-medium">
              Power Scheme
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Zap className="w-3.5 h-3.5 text-[#5A5CFF]" />
              <span className="text-xs font-semibold text-[#F5F7FA] truncate">
                {gamingState?.current_power_scheme_name || 'Balanced'}
              </span>
            </div>
          </div>

          <div className="bg-[#08090D]/60 rounded-xl p-3 border border-[#1D2230]">
            <span className="text-[10px] text-[#969BAA] uppercase tracking-wider block font-medium">
              Elevated Processes
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Cpu className="w-3.5 h-3.5 text-[#F502FD]" />
              <span className="text-xs font-semibold text-[#F5F7FA]">
                {gamingState?.managed_processes_count ?? 0} active
              </span>
            </div>
          </div>

          <div className="bg-[#08090D]/60 rounded-xl p-3 border border-[#1D2230]">
            <span className="text-[10px] text-[#969BAA] uppercase tracking-wider block font-medium">
              Session Duration
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3.5 h-3.5 text-[#02FEDC]" />
              <span className="text-xs font-semibold text-[#F5F7FA]">
                {isEnabled ? formatDuration(gamingState?.session_duration_seconds ?? 0) : '0s'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1D2230] pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-[#171A23] text-[#02FEDC] border border-[#2B3245]'
              : 'text-[#969BAA] hover:text-[#F5F7FA]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Optimization Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('background')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors relative ${
            activeTab === 'background'
              ? 'bg-[#171A23] text-[#02FEDC] border border-[#2B3245]'
              : 'text-[#969BAA] hover:text-[#F5F7FA]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Background Apps</span>
          {backgroundApps.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#5A5CFF]/30 text-[#5A5CFF] font-mono">
              {backgroundApps.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'games'
              ? 'bg-[#171A23] text-[#02FEDC] border border-[#2B3245]'
              : 'text-[#969BAA] hover:text-[#F5F7FA]'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Game Profiles ({profiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'logs'
              ? 'bg-[#171A23] text-[#02FEDC] border border-[#2B3245]'
              : 'text-[#969BAA] hover:text-[#F5F7FA]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Transparency Journal</span>
        </button>
      </div>

      {/* Tab 1: Optimization Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Game Card */}
          <div className="bg-[#11131A] border border-[#1D2230] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#F5F7FA] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#02FEDC]" />
                Target Game Process
              </h3>
              <button
                onClick={fetchState}
                className="p-1.5 rounded-lg bg-[#171A23] hover:bg-[#232838] text-[#969BAA] text-xs transition-colors"
                title="Rescan active game"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {gamingState?.active_game ? (
              <div className="bg-[#08090D] border border-[#02FEDC]/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F7FA]">
                      {gamingState.active_game.name}
                    </h4>
                    <p className="text-xs font-mono text-[#969BAA]">
                      {gamingState.active_game.executable} (PID: {gamingState.active_game.pid})
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#02FEDC]/20 text-[#02FEDC] border border-[#02FEDC]/30">
                    HIGH PRIORITY
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1D2230]">
                  <div>
                    <span className="text-[10px] text-[#969BAA]">RAM Footprint</span>
                    <p className="text-xs font-mono text-[#F5F7FA]">
                      {formatBytes(gamingState.active_game.memory_bytes)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#969BAA]">CPU Usage</span>
                    <p className="text-xs font-mono text-[#F5F7FA]">
                      {gamingState.active_game.cpu_usage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#08090D]/50 border border-dashed border-[#2B3245] rounded-xl p-6 text-center space-y-2">
                <Gamepad2 className="w-8 h-8 text-[#656C80] mx-auto" />
                <p className="text-xs font-medium text-[#F5F7FA]">No Game Process Detected</p>
                <p className="text-[11px] text-[#969BAA] max-w-sm mx-auto">
                  Launch any supported game or add custom executables in the Profiles tab. NEXORA will automatically elevate priority and focus resources.
                </p>
              </div>
            )}

            <div className="text-[11px] text-[#969BAA] space-y-1.5 pt-2">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#02FEDC]" />
                Thread scheduler assigns maximum quantum slices to active game
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#02FEDC]" />
                Avoids dangerous REALTIME priority to prevent system driver starvation
              </p>
            </div>
          </div>

          {/* Windows Power & Performance Optimization */}
          <div className="bg-[#11131A] border border-[#1D2230] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#F5F7FA] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#5A5CFF]" />
              System Power Configuration
            </h3>

            <div className="bg-[#08090D] border border-[#1D2230] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#969BAA]">Active Windows Power Plan:</span>
                <span className="font-semibold text-[#F5F7FA]">
                  {gamingState?.current_power_scheme_name || 'Balanced'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#969BAA]">Original Reversion Plan:</span>
                <span className="font-mono text-[#969BAA] text-[11px]">
                  {gamingState?.original_power_scheme_guid ? 'Cached in Recovery Journal' : 'System Default'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#969BAA]">Target Power Profile:</span>
                <span className="text-[#02FEDC] font-semibold">High Performance (8c5e7fda)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#5A5CFF]/10 border border-[#5A5CFF]/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5A5CFF]">
                <Info className="w-3.5 h-3.5" />
                <span>Zero Fake Registry Tweaks</span>
              </div>
              <p className="text-[11px] text-[#969BAA] leading-relaxed">
                NEXORA does not modify risky global registry settings, disable Windows Defender, or flush working sets into disk swap. All actions leverage native Windows Powercfg and Process API calls.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Background Applications */}
      {activeTab === 'background' && (
        <div className="bg-[#11131A] border border-[#1D2230] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA]">
                Non-Essential Background Applications
              </h3>
              <p className="text-xs text-[#969BAA]">
                Closing these before launching games reclaims RAM and prevents background CPU interrupts.
              </p>
            </div>
            <button
              onClick={fetchBackgroundApps}
              disabled={isLoadingApps}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171A23] hover:bg-[#232838] text-[#969BAA] text-xs font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingApps ? 'animate-spin' : ''}`} />
              <span>Refresh Candidates</span>
            </button>
          </div>

          {backgroundApps.length === 0 ? (
            <div className="bg-[#08090D] border border-dashed border-[#2B3245] rounded-xl p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#02FEDC] mx-auto" />
              <p className="text-xs font-semibold text-[#F5F7FA]">No Heavy Background Apps Detected</p>
              <p className="text-[11px] text-[#969BAA]">
                Your background environment is currently clean. Core system services and protected processes are safely hidden.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {backgroundApps.map((app) => (
                <div
                  key={app.pid}
                  className="bg-[#08090D] border border-[#1D2230] hover:border-[#232838] rounded-xl p-3.5 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#171A23] flex items-center justify-center text-[#969BAA]">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F5F7FA]">{app.name}</span>
                        <span className="text-[10px] font-mono text-[#656C80]">PID: {app.pid}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#232838] text-[#969BAA]">
                          {app.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-[#969BAA]">
                        <span>RAM: <strong className="text-[#F5F7FA] font-mono">{formatBytes(app.memory_bytes)}</strong></span>
                        <span>•</span>
                        <span>CPU: <strong className="text-[#F5F7FA] font-mono">{app.cpu_usage.toFixed(1)}%</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCloseProcess(app.pid, app.name)}
                    disabled={closingPid === app.pid}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{closingPid === app.pid ? 'Closing...' : 'Close App'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Game Profiles & Custom Executables */}
      {activeTab === 'games' && (
        <div className="bg-[#11131A] border border-[#1D2230] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA]">Supported Game Profiles</h3>
              <p className="text-xs text-[#969BAA]">
                NEXORA automatically detects these executables when launched and applies priority scheduling.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#02FEDC]/20 hover:bg-[#02FEDC]/30 text-[#02FEDC] border border-[#02FEDC]/40 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Game</span>
            </button>
          </div>

          {/* Add Game Modal / Inline Drawer */}
          {showAddModal && (
            <form
              onSubmit={handleAddGameProfile}
              className="bg-[#08090D] border border-[#02FEDC]/40 rounded-xl p-4 space-y-4 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#F5F7FA]">Add Custom Game Profile</h4>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs text-[#969BAA] hover:text-[#F5F7FA]"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-[#969BAA] uppercase tracking-wider block mb-1">
                    Game Title
                  </label>
                  <input
                    type="text"
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                    placeholder="e.g. Helldivers 2"
                    className="w-full bg-[#11131A] border border-[#232838] focus:border-[#02FEDC] rounded-lg px-3 py-2 text-xs text-[#F5F7FA] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#969BAA] uppercase tracking-wider block mb-1">
                    Executable Name (.exe)
                  </label>
                  <input
                    type="text"
                    value={newGameExe}
                    onChange={(e) => setNewGameExe(e.target.value)}
                    placeholder="e.g. helldivers2.exe"
                    className="w-full bg-[#11131A] border border-[#232838] focus:border-[#02FEDC] rounded-lg px-3 py-2 text-xs text-[#F5F7FA] outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#969BAA] uppercase tracking-wider block mb-1">
                    Target Priority
                  </label>
                  <select
                    value={newGamePriority}
                    onChange={(e) => setNewGamePriority(e.target.value as 'High' | 'AboveNormal')}
                    className="w-full bg-[#11131A] border border-[#232838] focus:border-[#02FEDC] rounded-lg px-3 py-2 text-xs text-[#F5F7FA] outline-none"
                  >
                    <option value="High">High (Recommended for Games)</option>
                    <option value="AboveNormal">Above Normal (Balanced)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#969BAA] hover:bg-[#171A23]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#02FEDC] text-[#08090D] hover:brightness-110"
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-[#08090D] border border-[#1D2230] hover:border-[#232838] rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F5F7FA]">{profile.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#5A5CFF]/20 text-[#5A5CFF] border border-[#5A5CFF]/30">
                    {profile.priority}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#969BAA] truncate">
                  {profile.executable}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#02FEDC] pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Auto-detect enabled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Transparency & Recovery Journal */}
      {activeTab === 'logs' && (
        <div className="bg-[#11131A] border border-[#1D2230] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#02FEDC]" />
                Crash Recovery Journal & Activity Log
              </h3>
              <p className="text-xs text-[#969BAA]">
                Every power scheme change and priority elevation is written to an on-disk journal (%LOCALAPPDATA%\NEXORA\gaming_recovery.json).
              </p>
            </div>
            <button
              onClick={fetchState}
              className="p-1.5 rounded-lg bg-[#171A23] hover:bg-[#232838] text-[#969BAA] text-xs transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-[#08090D] border border-[#1D2230] rounded-xl p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-2">
            {gamingState?.activity_logs && gamingState.activity_logs.length > 0 ? (
              gamingState.activity_logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 py-1 border-b border-[#1D2230]/40 last:border-0">
                  <span className="text-[#656C80] text-[10px] shrink-0 pt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] uppercase shrink-0 ${
                      log.event_type === 'ENABLE'
                        ? 'bg-[#02FEDC]/20 text-[#02FEDC]'
                        : log.event_type === 'DISABLE'
                        ? 'bg-[#5A5CFF]/20 text-[#5A5CFF]'
                        : 'bg-[#1D2230] text-[#969BAA]'
                    }`}
                  >
                    {log.event_type}
                  </span>
                  <span className="text-[#E2E8F0] text-xs leading-relaxed">{log.message}</span>
                </div>
              ))
            ) : (
              <p className="text-[#656C80] italic">No active log entries yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

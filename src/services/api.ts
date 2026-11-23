import {
  AppSettings,
  CleanLog,
  CleanResult,
  CleanerRule,
  DiskAnalysisResult,
  DuplicateScanResult,
  ProcessItem,
  QuarantineRecord,
  RealtimeMetrics,
  ScanLog,
  ScanSummary,
  StartupEntry,
  SystemOverview,
} from '../types';

// Detect whether running inside Tauri desktop shell
const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

async function tauriInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauri) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<T>(cmd, args);
  }
  return mockInvoke<T>(cmd, args);
}

export const NexoraApi = {
  getSystemOverview: () => tauriInvoke<SystemOverview>('get_system_overview'),
  getRealtimeMetrics: () => tauriInvoke<RealtimeMetrics>('get_realtime_metrics'),
  getProcesses: () => tauriInvoke<ProcessItem[]>('get_processes'),
  terminateProcess: (pid: number) => tauriInvoke<boolean>('terminate_process', { pid }),
  getCleanerRules: () => tauriInvoke<CleanerRule[]>('get_cleaner_rules'),
  scanCleaner: (rules?: CleanerRule[]) => tauriInvoke<ScanSummary>('scan_cleaner', { rules }),
  executeCleaner: (filePaths: string[], useQuarantine: boolean) =>
    tauriInvoke<CleanResult>('execute_cleaner', { filePaths, useQuarantine }),
  getStartupEntries: () => tauriInvoke<StartupEntry[]>('get_startup_entries'),
  toggleStartupEntry: (entryId: string, enable: boolean) =>
    tauriInvoke<void>('toggle_startup_entry', { entryId, enable }),
  analyzeDirectory: (targetPath: string) =>
    tauriInvoke<DiskAnalysisResult>('analyze_directory', { targetPath }),
  findDuplicates: (targetPath: string) =>
    tauriInvoke<DuplicateScanResult>('find_duplicates', { targetPath }),
  getAppSettings: () => tauriInvoke<AppSettings>('get_app_settings'),
  saveAppSettings: (settings: AppSettings) =>
    tauriInvoke<void>('save_app_settings', { settings }),
  getScanHistory: () => tauriInvoke<ScanLog[]>('get_scan_history'),
  getCleanHistory: () => tauriInvoke<CleanLog[]>('get_clean_history'),
  getQuarantineRecords: () => tauriInvoke<QuarantineRecord[]>('get_quarantine_records'),
  addExclusion: (path: string) => tauriInvoke<void>('add_exclusion', { path }),
  getExclusions: () => tauriInvoke<string[]>('get_exclusions'),
};

// Realistic mock implementation for browser preview / development
async function mockInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  await new Promise((r) => setTimeout(r, 150)); // simulate async IPC

  switch (cmd) {
    case 'get_system_overview':
      return {
        computer_name: 'DESKTOP-NEXORA',
        os_name: 'Windows 11 Pro',
        os_version: '23H2 (Build 22631.4460)',
        cpu_model: 'AMD Ryzen 9 7950X 16-Core Processor',
        cpu_cores: 16,
        cpu_usage_pct: 14.8,
        total_memory_bytes: 34359738368, // 32 GB
        used_memory_bytes: 14763950080,  // 13.7 GB
        total_swap_bytes: 8589934592,
        used_swap_bytes: 1258291200,
        uptime_seconds: 342910,
        drives: [
          {
            mount_point: 'C:\\',
            name: 'Local Disk (NVMe)',
            total_bytes: 1024000000000,
            available_bytes: 489200000000,
            file_system: 'NTFS',
          },
          {
            mount_point: 'D:\\',
            name: 'Storage (SSD)',
            total_bytes: 2048000000000,
            available_bytes: 1420000000000,
            file_system: 'NTFS',
          },
        ],
      } as unknown as T;

    case 'get_realtime_metrics':
      return {
        cpu_usage_pct: Math.floor(12 + Math.random() * 15),
        used_memory_bytes: 14763950080 + Math.floor(Math.random() * 500000000),
        total_memory_bytes: 34359738368,
        processes_count: 184,
      } as unknown as T;

    case 'get_processes':
      return [
        { pid: 1420, name: 'chrome.exe', memory_bytes: 1480000000, cpu_usage: 4.2, is_system_critical: false },
        { pid: 8294, name: 'Code.exe', memory_bytes: 920000000, cpu_usage: 2.1, is_system_critical: false },
        { pid: 3844, name: 'Discord.exe', memory_bytes: 650000000, cpu_usage: 1.4, is_system_critical: false },
        { pid: 5120, name: 'Spotify.exe', memory_bytes: 420000000, cpu_usage: 0.8, is_system_critical: false },
        { pid: 1044, name: 'explorer.exe', memory_bytes: 310000000, cpu_usage: 0.5, is_system_critical: true },
        { pid: 908,  name: 'dwm.exe', memory_bytes: 280000000, cpu_usage: 1.2, is_system_critical: true },
        { pid: 480,  name: 'svchost.exe', memory_bytes: 190000000, cpu_usage: 0.1, is_system_critical: true },
        { pid: 720,  name: 'msmpeng.exe', memory_bytes: 160000000, cpu_usage: 0.3, is_system_critical: true },
      ] as unknown as T;

    case 'get_cleaner_rules':
      return [
        {
          id: 'user_temp',
          name: 'User Temporary Files',
          description: 'Temporary application cache files in %TEMP%',
          category: 'System',
          risk_level: 'Low',
          target_paths: ['C:\\Users\\User\\AppData\\Local\\Temp'],
          extensions: ['tmp', 'log', 'bak'],
          min_age_hours: 0,
          enabled_by_default: true,
        },
        {
          id: 'win_temp',
          name: 'Windows System Temp',
          description: 'OS temporary files and update extraction caches',
          category: 'System',
          risk_level: 'Low',
          target_paths: ['C:\\Windows\\Temp'],
          extensions: ['tmp', 'log'],
          min_age_hours: 24,
          enabled_by_default: true,
        },
        {
          id: 'thumb_cache',
          name: 'Explorer Thumbnail Cache',
          description: 'Generated Windows thumbnail database caches',
          category: 'System',
          risk_level: 'Low',
          target_paths: ['C:\\Users\\User\\AppData\\Local\\Microsoft\\Windows\\Explorer'],
          extensions: ['db'],
          min_age_hours: 0,
          enabled_by_default: true,
        },
        {
          id: 'chrome_cache',
          name: 'Google Chrome Cache',
          description: 'Cached media, scripts, and web resources',
          category: 'Browsers',
          risk_level: 'Low',
          target_paths: ['C:\\Users\\User\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache'],
          extensions: [],
          min_age_hours: 0,
          enabled_by_default: true,
        },
        {
          id: 'crash_dumps',
          name: 'Application Crash Dumps',
          description: 'Diagnostic memory dumps from terminated apps',
          category: 'Diagnostics',
          risk_level: 'Low',
          target_paths: ['C:\\Users\\User\\AppData\\Local\\CrashDumps'],
          extensions: ['dmp'],
          min_age_hours: 0,
          enabled_by_default: true,
        },
      ] as unknown as T;

    case 'scan_cleaner':
      return {
        total_files: 3412,
        total_bytes: 4892011920, // ~4.89 GB
        scan_duration_ms: 642,
        categories: [
          {
            rule_id: 'user_temp',
            name: 'User Temporary Files',
            category: 'System',
            risk_level: 'Low',
            file_count: 1842,
            total_size: 2419082100,
            files: [
              { path: 'C:\\Users\\User\\AppData\\Local\\Temp\\~DF381A.tmp', size: 1420912, rule_id: 'user_temp', risk_level: 'Low' },
              { path: 'C:\\Users\\User\\AppData\\Local\\Temp\\electron-cache.log', size: 849120, rule_id: 'user_temp', risk_level: 'Low' },
            ],
          },
          {
            rule_id: 'chrome_cache',
            name: 'Google Chrome Cache',
            category: 'Browsers',
            risk_level: 'Low',
            file_count: 1210,
            total_size: 1684910000,
            files: [
              { path: 'C:\\Users\\User\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache\\f_000a12', size: 481029, rule_id: 'chrome_cache', risk_level: 'Low' },
            ],
          },
          {
            rule_id: 'crash_dumps',
            name: 'Application Crash Dumps',
            category: 'Diagnostics',
            risk_level: 'Low',
            file_count: 4,
            total_size: 788019820,
            files: [
              { path: 'C:\\Users\\User\\AppData\\Local\\CrashDumps\\slack.exe.1294.dmp', size: 394009910, rule_id: 'crash_dumps', risk_level: 'Low' },
            ],
          },
        ],
      } as unknown as T;

    case 'execute_cleaner':
      const files = (args?.filePaths as string[]) || [];
      return {
        cleaned_files: files.length || 3410,
        cleaned_bytes: 4891000000,
        skipped_files: 2,
        errors: [],
        quarantine_id: 'q-8491-a1e9',
      } as unknown as T;

    case 'get_startup_entries':
      return [
        { id: 'hkcu_discord', name: 'Discord', command: 'C:\\Users\\User\\AppData\\Local\\Discord\\Update.exe --processStart Discord.exe', location: 'HKCU\\Run', enabled: true, is_protected: false },
        { id: 'hkcu_spotify', name: 'Spotify', command: 'C:\\Users\\User\\AppData\\Roaming\\Spotify\\Spotify.exe --autostart', location: 'HKCU\\Run', enabled: true, is_protected: false },
        { id: 'hkcu_steam', name: 'Steam', command: 'C:\\Program Files (x86)\\Steam\\steam.exe -silent', location: 'HKCU\\Run', enabled: false, is_protected: false },
        { id: 'hklm_security', name: 'Windows Security notification icon', command: 'C:\\Windows\\System32\\SecurityHealthSystray.exe', location: 'HKLM\\Run', enabled: true, is_protected: true },
        { id: 'hklm_realtek', name: 'Realtek HD Audio Universal Service', command: 'C:\\Windows\\System32\\RtkAudUService64.exe', location: 'HKLM\\Run', enabled: true, is_protected: true },
      ] as unknown as T;

    case 'get_app_settings':
      return {
        theme: 'dark',
        quarantine_enabled: true,
        keep_quarantine_days: 14,
        auto_check_updates: false,
        telemetry_enabled: false,
      } as unknown as T;

    case 'get_scan_history':
      return [
        { id: 'scan-1', timestamp: new Date(Date.now() - 86400000).toISOString(), total_files: 3412, total_bytes: 4892011920, duration_ms: 642 },
        { id: 'scan-2', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), total_files: 2890, total_bytes: 3810291000, duration_ms: 590 },
      ] as unknown as T;

    case 'get_clean_history':
      return [
        { id: 'clean-1', timestamp: new Date(Date.now() - 86400000).toISOString(), cleaned_files: 3410, cleaned_bytes: 4891000000, skipped_files: 2, quarantine_id: 'q-8491-a1e9' },
      ] as unknown as T;

    case 'get_quarantine_records':
      return [
        { id: 'q-rec-1', original_path: 'C:\\Users\\User\\AppData\\Local\\Temp\\cache_dump.tmp', quarantined_path: 'C:\\Users\\User\\AppData\\Local\\NEXORA\\Quarantine\\q-8491-a1e9\\item_1.tmp', file_size: 1420912, timestamp: new Date(Date.now() - 86400000).toISOString() },
      ] as unknown as T;

    case 'get_exclusions':
      return ['C:\\Users\\User\\AppData\\Local\\Temp\\custom_work_dir'] as unknown as T;

    default:
      return {} as unknown as T;
  }
}

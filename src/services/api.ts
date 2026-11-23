import {
  AppSettings,
  BetaFeedbackRecord,
  CleanLog,
  CleanResult,
  CleanerRule,
  DiagnosticCheckResult,
  DiskAnalysisResult,
  DuplicateScanResult,
  InstalledApp,
  MaintenanceExecutionResult,
  ProcessItem,
  QuarantineRecord,
  RealtimeMetrics,
  SanitizedDiagnosticBundle,
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
  getInstalledApplications: () => tauriInvoke<InstalledApp[]>('get_installed_applications'),
  runSystemDiagnostics: () => tauriInvoke<DiagnosticCheckResult[]>('run_system_diagnostics'),
  executeMaintenanceTask: (taskId: string) =>
    tauriInvoke<MaintenanceExecutionResult>('execute_maintenance_task', { taskId }),
  restoreQuarantineRecord: (recordId: string) =>
    tauriInvoke<string>('restore_quarantine_record', { recordId }),
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
  submitBetaFeedback: (feedback: BetaFeedbackRecord) =>
    tauriInvoke<string>('submit_beta_feedback', { feedback }),
  getBetaFeedbacks: () =>
    tauriInvoke<BetaFeedbackRecord[]>('get_beta_feedbacks'),
  getSanitizedDiagnosticBundle: () =>
    tauriInvoke<SanitizedDiagnosticBundle>('get_sanitized_diagnostic_bundle'),
};

// Realistic mock implementation for browser preview / development
async function mockInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  await new Promise((r) => setTimeout(r, 120)); // simulate async IPC

  switch (cmd) {
    case 'get_system_overview':
      return {
        computer_name: 'DESKTOP-NEXORA',
        os_name: 'Windows 11 Pro',
        os_version: '23H2 (Build 22631.4460)',
        cpu_model: 'AMD Ryzen 9 7950X 16-Core Processor',
        cpu_cores: 16,
        cpu_usage_pct: 14.8,
        total_memory_bytes: 34359738368,
        used_memory_bytes: 14763950080,
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
        ],
      } as unknown as T;

    case 'get_realtime_metrics':
      return {
        cpu_usage_pct: Math.floor(12 + Math.random() * 15),
        used_memory_bytes: 14763950080 + Math.floor(Math.random() * 500000000),
        total_memory_bytes: 34359738368,
        processes_count: 184,
      } as unknown as T;

    case 'get_installed_applications':
      return [
        { id: 'app_1', name: 'Google Chrome', publisher: 'Google LLC', version: '131.0.6778.86', install_date: '20241110', estimated_size_bytes: 356515840 },
        { id: 'app_2', name: 'Visual Studio Code', publisher: 'Microsoft Corporation', version: '1.95.3', install_date: '20241022', estimated_size_bytes: 440401920 },
        { id: 'app_3', name: 'Discord', publisher: 'Discord Inc.', version: '1.0.9168', install_date: '20240915', estimated_size_bytes: 293601280 },
        { id: 'app_4', name: 'Spotify', publisher: 'Spotify AB', version: '1.2.50.335', install_date: '20241102', estimated_size_bytes: 199229440 },
        { id: 'app_5', name: 'Node.js', publisher: 'OpenJS Foundation', version: '22.11.0', install_date: '20241118', estimated_size_bytes: 96468992 },
      ] as unknown as T;

    case 'run_system_diagnostics':
      return [
        { id: 'storage_check', title: 'Primary Volume Capacity', category: 'Storage', status: 'Optimal', details: 'Drive C: capacity is healthy (52% free space).', is_actionable: false },
        { id: 'memory_check', title: 'Physical RAM Allocation', category: 'Memory', status: 'Optimal', details: 'Physical memory allocation operating within normal envelope (43% utilized).', is_actionable: false },
        { id: 'os_version_check', title: 'Operating System Kernel', category: 'System', status: 'Optimal', details: 'Running Windows 11 Version 23H2. Core kernel and subsystem services operational.', is_actionable: false },
        { id: 'dns_stack', title: 'DNS & Winsock Protocol Stack', category: 'Network', status: 'Optimal', details: 'Local network socket interfaces responding normally. DNS cache entries valid.', is_actionable: false },
      ] as unknown as T;

    case 'execute_maintenance_task':
      return {
        task_id: (args?.taskId as string) || 'flush_dns',
        success: true,
        message: 'Successfully flushed the DNS Resolver Cache.',
      } as unknown as T;

    case 'restore_quarantine_record':
      return 'Restored file successfully' as unknown as T;

    case 'get_processes':
      return [
        { pid: 1420, name: 'chrome.exe', memory_bytes: 1480000000, cpu_usage: 4.2, is_system_critical: false },
        { pid: 8294, name: 'Code.exe', memory_bytes: 920000000, cpu_usage: 2.1, is_system_critical: false },
        { pid: 3844, name: 'Discord.exe', memory_bytes: 650000000, cpu_usage: 1.4, is_system_critical: false },
        { pid: 1044, name: 'explorer.exe', memory_bytes: 310000000, cpu_usage: 0.5, is_system_critical: true },
      ] as unknown as T;

    case 'get_cleaner_rules':
      return [
        { id: 'user_temp', name: 'User Temporary Files', description: 'Temporary application cache files in %TEMP%', category: 'System', risk_level: 'Low', target_paths: ['C:\\Users\\User\\AppData\\Local\\Temp'], extensions: ['tmp', 'log'], min_age_hours: 0, enabled_by_default: true },
        { id: 'win_temp', name: 'Windows System Temp', description: 'OS temporary files and update extraction caches', category: 'System', risk_level: 'Low', target_paths: ['C:\\Windows\\Temp'], extensions: ['tmp', 'log'], min_age_hours: 24, enabled_by_default: true },
        { id: 'chrome_cache', name: 'Google Chrome Cache', description: 'Cached media, scripts, and web resources', category: 'Browsers', risk_level: 'Low', target_paths: ['C:\\Users\\User\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache'], extensions: [], min_age_hours: 0, enabled_by_default: true },
      ] as unknown as T;

    case 'scan_cleaner':
      return {
        total_files: 3412,
        total_bytes: 4892011920,
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
            ],
          },
        ],
      } as unknown as T;

    case 'execute_cleaner':
      return {
        cleaned_files: 3410,
        cleaned_bytes: 4891000000,
        skipped_files: 2,
        errors: [],
        quarantine_id: 'q-8491-a1e9',
        quarantined_items: [],
      } as unknown as T;

    case 'get_startup_entries':
      return [
        { id: 'hkcu_discord', name: 'Discord', command: 'C:\\Users\\User\\AppData\\Local\\Discord\\Update.exe', location: 'HKCU\\Run', enabled: true, is_protected: false },
        { id: 'hklm_security', name: 'Windows Security', command: 'C:\\Windows\\System32\\SecurityHealthSystray.exe', location: 'HKLM\\Run', enabled: true, is_protected: true },
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

    case 'submit_beta_feedback':
      return 'fb_success' as unknown as T;

    case 'get_beta_feedbacks':
      return [
        {
          id: 'fb-initial-1',
          feedback_type: 'feature',
          rating: 5,
          summary: 'Smooth dark mode experience and safe quarantine',
          description: 'Tested temporary file cleanup on Windows 11. Restoring quarantined cache files works seamlessly.',
          include_diagnostics: true,
          timestamp: new Date().toISOString(),
        },
      ] as unknown as T;

    case 'get_sanitized_diagnostic_bundle':
      return {
        os_name: 'Windows',
        os_version: 'Windows 11 Version 23H2 (Build 22631)',
        architecture: 'x86_64',
        app_version: '1.0.0-beta.1',
        quarantine_records_count: 1,
        exclusions_count: 1,
        privacy_declaration: 'Zero personal documents, credentials, or file paths collected.',
      } as unknown as T;

    default:
      return {} as unknown as T;
  }
}

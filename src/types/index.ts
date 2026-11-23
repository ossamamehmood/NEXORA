export type NavigationSection =
  | 'overview'
  | 'cleaner'
  | 'deep-cleaner'
  | 'privacy'
  | 'monitor'
  | 'startup'
  | 'disk-analyzer'
  | 'duplicates'
  | 'applications'
  | 'diagnostics'
  | 'maintenance'
  | 'history'
  | 'feedback'
  | 'settings';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface DriveInfo {
  mount_point: string;
  name: string;
  total_bytes: number;
  available_bytes: number;
  file_system: string;
}

export interface SystemOverview {
  computer_name: string;
  os_name: string;
  os_version: string;
  cpu_model: string;
  cpu_cores: number;
  cpu_usage_pct: number;
  total_memory_bytes: number;
  used_memory_bytes: number;
  total_swap_bytes: number;
  used_swap_bytes: number;
  uptime_seconds: number;
  drives: DriveInfo[];
}

export interface RealtimeMetrics {
  cpu_usage_pct: number;
  used_memory_bytes: number;
  total_memory_bytes: number;
  processes_count: number;
}

export interface ProcessItem {
  pid: number;
  name: string;
  memory_bytes: number;
  cpu_usage: number;
  is_system_critical: boolean;
}

export interface CleanerRule {
  id: string;
  name: string;
  description: string;
  category: string;
  risk_level: RiskLevel;
  target_paths: string[];
  extensions: string[];
  min_age_hours: number;
  enabled_by_default: boolean;
}

export interface CandidateFile {
  path: string;
  size: number;
  rule_id: string;
  risk_level: RiskLevel;
}

export interface ScanCategoryResult {
  rule_id: string;
  name: string;
  category: string;
  risk_level: RiskLevel;
  file_count: number;
  total_size: number;
  files: CandidateFile[];
}

export interface ScanSummary {
  total_files: number;
  total_bytes: number;
  categories: ScanCategoryResult[];
  scan_duration_ms: number;
}

export interface QuarantinedItemInfo {
  id: string;
  original_path: string;
  quarantined_path: string;
  file_size: number;
}

export interface CleanResult {
  cleaned_files: number;
  cleaned_bytes: number;
  skipped_files: number;
  errors: string[];
  quarantine_id: string | null;
  quarantined_items: QuarantinedItemInfo[];
}

export interface StartupEntry {
  id: string;
  name: string;
  command: string;
  location: string;
  enabled: boolean;
  is_protected: boolean;
}

export interface InstalledApp {
  id: string;
  name: string;
  publisher: string;
  version: string;
  install_date: string;
  estimated_size_bytes: number;
  uninstall_string?: string | null;
}

export interface DiagnosticCheckResult {
  id: string;
  title: string;
  category: string;
  status: 'Optimal' | 'Good' | 'Warning';
  details: string;
  is_actionable: boolean;
}

export interface MaintenanceExecutionResult {
  task_id: string;
  success: boolean;
  message: string;
}

export interface LargeFileItem {
  path: string;
  name: string;
  size: number;
  extension: string;
}

export interface DiskAnalysisResult {
  target_path: string;
  total_scanned_bytes: number;
  file_count: number;
  extension_breakdown: Record<string, number>;
  largest_files: LargeFileItem[];
}

export interface DuplicateGroup {
  file_size: number;
  sha256_hash: string;
  file_paths: string[];
}

export interface DuplicateScanResult {
  total_examined_files: number;
  duplicate_groups: DuplicateGroup[];
  potential_reclaimable_bytes: number;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  quarantine_enabled: boolean;
  keep_quarantine_days: number;
  auto_check_updates: boolean;
  telemetry_enabled: boolean;
}

export interface ScanLog {
  id: string;
  timestamp: string;
  total_files: number;
  total_bytes: number;
  duration_ms: number;
}

export interface CleanLog {
  id: string;
  timestamp: string;
  cleaned_files: number;
  cleaned_bytes: number;
  skipped_files: number;
  quarantine_id: string | null;
}

export interface QuarantineRecord {
  id: string;
  original_path: string;
  quarantined_path: string;
  file_size: number;
  timestamp: string;
}

export type FeedbackType = 'bug' | 'feature' | 'workflow' | 'performance' | 'general';

export interface SanitizedDiagnosticBundle {
  os_name: string;
  os_version: string;
  architecture: string;
  app_version: string;
  quarantine_records_count: number;
  exclusions_count: number;
  privacy_declaration: string;
}

export interface BetaFeedbackRecord {
  id: string;
  feedback_type: FeedbackType;
  rating?: number;
  summary: string;
  description: string;
  steps_to_reproduce?: string;
  include_diagnostics: boolean;
  diagnostic_payload?: SanitizedDiagnosticBundle;
  timestamp: string;
}

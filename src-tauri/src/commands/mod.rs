use tauri::State;
use std::path::Path;
use crate::cleaner::{CleanerEngine, CleanerRule, CleanResult, ScanSummary};
use crate::monitoring::{ProcessItem, ProcessMonitor, RealtimeMetrics};
use crate::storage::{AppDatabase, AppSettings, BetaFeedbackRecord, CleanLog, DiskAnalysisResult, DuplicateScanResult, DuplicateFinder, QuarantineRecord, SanitizedDiagnosticBundle, ScanLog, StorageAnalyzer};
use crate::system::{ApplicationManager, DiagnosticCheckResult, DiagnosticsEngine, InstalledApp, MaintenanceExecutionResult, MaintenanceRoutines, StartupEntry, StartupManager, SystemInfoProvider, SystemOverview};

#[tauri::command]
pub fn get_system_overview() -> SystemOverview {
    SystemInfoProvider::get_system_overview()
}

#[tauri::command]
pub fn get_realtime_metrics() -> RealtimeMetrics {
    ProcessMonitor::get_realtime_metrics()
}

#[tauri::command]
pub fn get_processes() -> Vec<ProcessItem> {
    ProcessMonitor::get_processes()
}

#[tauri::command]
pub fn terminate_process(pid: u32) -> Result<bool, String> {
    ProcessMonitor::terminate_process(pid)
}

#[tauri::command]
pub fn get_cleaner_rules() -> Vec<CleanerRule> {
    CleanerRule::get_default_rules()
}

#[tauri::command]
pub fn scan_cleaner(rules: Option<Vec<CleanerRule>>, db: State<'_, AppDatabase>) -> ScanSummary {
    let rules_to_use = rules.unwrap_or_else(CleanerRule::get_default_rules);
    let summary = CleanerEngine::scan(&rules_to_use);

    // Record scan in history
    db.add_scan_log(ScanLog {
        id: uuid::Uuid::new_v4().to_string(),
        timestamp: chrono::Local::now().to_rfc3339(),
        total_files: summary.total_files,
        total_bytes: summary.total_bytes,
        duration_ms: summary.scan_duration_ms,
    });

    summary
}

#[tauri::command]
pub fn execute_cleaner(file_paths: Vec<String>, use_quarantine: bool, db: State<'_, AppDatabase>) -> CleanResult {
    let result = CleanerEngine::clean_files(&file_paths, use_quarantine);

    // Record cleanup in history
    db.add_clean_log(CleanLog {
        id: uuid::Uuid::new_v4().to_string(),
        timestamp: chrono::Local::now().to_rfc3339(),
        cleaned_files: result.cleaned_files,
        cleaned_bytes: result.cleaned_bytes,
        skipped_files: result.skipped_files,
        quarantine_id: result.quarantine_id.clone(),
    });

    // Record quarantine items in database state
    for item in &result.quarantined_items {
        db.add_quarantine_record(QuarantineRecord {
            id: item.id.clone(),
            original_path: item.original_path.clone(),
            quarantined_path: item.quarantined_path.clone(),
            file_size: item.file_size,
            timestamp: chrono::Local::now().to_rfc3339(),
        });
    }

    result
}

#[tauri::command]
pub fn get_startup_entries() -> Vec<StartupEntry> {
    StartupManager::get_startup_entries()
}

#[tauri::command]
pub fn toggle_startup_entry(entry_id: String, enable: bool) -> Result<(), String> {
    StartupManager::toggle_entry(&entry_id, enable)
}

#[tauri::command]
pub fn get_installed_applications() -> Vec<InstalledApp> {
    ApplicationManager::get_installed_applications()
}

#[tauri::command]
pub fn run_system_diagnostics() -> Vec<DiagnosticCheckResult> {
    DiagnosticsEngine::run_diagnostics()
}

#[tauri::command]
pub fn execute_maintenance_task(task_id: String) -> MaintenanceExecutionResult {
    MaintenanceRoutines::execute_task(&task_id)
}

#[tauri::command]
pub fn restore_quarantine_record(record_id: String, db: State<'_, AppDatabase>) -> Result<String, String> {
    db.restore_quarantine_record(&record_id)
}

#[tauri::command]
pub fn analyze_directory(target_path: String) -> Result<DiskAnalysisResult, String> {
    StorageAnalyzer::analyze(Path::new(&target_path))
}

#[tauri::command]
pub fn find_duplicates(target_path: String) -> Result<DuplicateScanResult, String> {
    DuplicateFinder::find_duplicates(Path::new(&target_path))
}

#[tauri::command]
pub fn get_app_settings(db: State<'_, AppDatabase>) -> AppSettings {
    db.get_settings()
}

#[tauri::command]
pub fn save_app_settings(settings: AppSettings, db: State<'_, AppDatabase>) -> Result<(), String> {
    db.update_settings(settings);
    Ok(())
}

#[tauri::command]
pub fn get_scan_history(db: State<'_, AppDatabase>) -> Vec<ScanLog> {
    db.get_scan_history()
}

#[tauri::command]
pub fn get_clean_history(db: State<'_, AppDatabase>) -> Vec<CleanLog> {
    db.get_clean_history()
}

#[tauri::command]
pub fn get_quarantine_records(db: State<'_, AppDatabase>) -> Vec<QuarantineRecord> {
    db.get_quarantine_records()
}

#[tauri::command]
pub fn add_exclusion(path: String, db: State<'_, AppDatabase>) -> Result<(), String> {
    db.add_exclusion(path);
    Ok(())
}

#[tauri::command]
pub fn get_exclusions(db: State<'_, AppDatabase>) -> Vec<String> {
    db.get_exclusions()
}

#[tauri::command]
pub fn submit_beta_feedback(feedback: BetaFeedbackRecord, db: State<'_, AppDatabase>) -> Result<String, String> {
    let id = feedback.id.clone();
    db.add_beta_feedback(feedback);
    Ok(id)
}

#[tauri::command]
pub fn get_beta_feedbacks(db: State<'_, AppDatabase>) -> Vec<BetaFeedbackRecord> {
    db.get_beta_feedbacks()
}

#[tauri::command]
pub fn get_sanitized_diagnostic_bundle(db: State<'_, AppDatabase>) -> SanitizedDiagnosticBundle {
    db.generate_sanitized_diagnostics()
}

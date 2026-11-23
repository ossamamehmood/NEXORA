pub mod cleaner;
pub mod commands;
pub mod monitoring;
pub mod security;
pub mod storage;
pub mod system;

use storage::AppDatabase;

pub fn run() {
    let database = AppDatabase::init();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(database)
        .invoke_handler(tauri::generate_handler![
            commands::get_system_overview,
            commands::get_realtime_metrics,
            commands::get_processes,
            commands::terminate_process,
            commands::get_cleaner_rules,
            commands::scan_cleaner,
            commands::execute_cleaner,
            commands::get_startup_entries,
            commands::toggle_startup_entry,
            commands::get_installed_applications,
            commands::run_system_diagnostics,
            commands::execute_maintenance_task,
            commands::restore_quarantine_record,
            commands::analyze_directory,
            commands::find_duplicates,
            commands::get_app_settings,
            commands::save_app_settings,
            commands::get_scan_history,
            commands::get_clean_history,
            commands::get_quarantine_records,
            commands::add_exclusion,
            commands::get_exclusions,
            commands::submit_beta_feedback,
            commands::get_beta_feedbacks,
            commands::get_sanitized_diagnostic_bundle,
        ])
        .run(tauri::generate_context!())
        .expect("error while running NEXORA application");
}

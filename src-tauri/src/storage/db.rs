use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub theme: String, // "dark", "light", "system"
    pub quarantine_enabled: bool,
    pub keep_quarantine_days: u32,
    pub auto_check_updates: bool,
    pub telemetry_enabled: bool, // Always false by default
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            theme: "dark".into(),
            quarantine_enabled: true,
            keep_quarantine_days: 14,
            auto_check_updates: false,
            telemetry_enabled: false,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanLog {
    pub id: String,
    pub timestamp: String,
    pub total_files: usize,
    pub total_bytes: u64,
    pub duration_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CleanLog {
    pub id: String,
    pub timestamp: String,
    pub cleaned_files: usize,
    pub cleaned_bytes: u64,
    pub skipped_files: usize,
    pub quarantine_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuarantineRecord {
    pub id: String,
    pub original_path: String,
    pub quarantined_path: String,
    pub file_size: u64,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SanitizedDiagnosticBundle {
    pub os_name: String,
    pub os_version: String,
    pub architecture: String,
    pub app_version: String,
    pub quarantine_records_count: usize,
    pub exclusions_count: usize,
    pub privacy_declaration: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BetaFeedbackRecord {
    pub id: String,
    pub feedback_type: String, // "bug", "feature", "workflow", "performance", "general"
    pub rating: Option<u8>,
    pub summary: String,
    pub description: String,
    pub steps_to_reproduce: Option<String>,
    pub include_diagnostics: bool,
    pub diagnostic_payload: Option<SanitizedDiagnosticBundle>,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AppDatabaseState {
    pub settings: AppSettings,
    pub scan_history: Vec<ScanLog>,
    pub clean_history: Vec<CleanLog>,
    pub quarantine_records: Vec<QuarantineRecord>,
    pub exclusions: Vec<String>,
    #[serde(default)]
    pub beta_feedbacks: Vec<BetaFeedbackRecord>,
}

pub struct AppDatabase {
    state: Mutex<AppDatabaseState>,
    db_path: PathBuf,
}

impl AppDatabase {
    pub fn init() -> Self {
        let db_dir = dirs::data_local_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("NEXORA")
            .join("data");
        let _ = fs::create_dir_all(&db_dir);
        let db_path = db_dir.join("nexora_store.json");

        let state = if db_path.exists() {
            let content = fs::read_to_string(&db_path).unwrap_or_default();
            serde_json::from_str(&content).unwrap_or_default()
        } else {
            AppDatabaseState::default()
        };

        Self {
            state: Mutex::new(state),
            db_path,
        }
    }

    fn persist(&self) {
        if let Ok(state) = self.state.lock() {
            if let Ok(json) = serde_json::to_string_pretty(&*state) {
                let _ = fs::write(&self.db_path, json);
            }
        }
    }

    pub fn get_settings(&self) -> AppSettings {
        self.state.lock().map(|s| s.settings.clone()).unwrap_or_default()
    }

    pub fn update_settings(&self, settings: AppSettings) {
        if let Ok(mut state) = self.state.lock() {
            state.settings = settings;
        }
        self.persist();
    }

    pub fn add_scan_log(&self, log: ScanLog) {
        if let Ok(mut state) = self.state.lock() {
            state.scan_history.insert(0, log);
            state.scan_history.truncate(100);
        }
        self.persist();
    }

    pub fn add_clean_log(&self, log: CleanLog) {
        if let Ok(mut state) = self.state.lock() {
            state.clean_history.insert(0, log);
            state.clean_history.truncate(100);
        }
        self.persist();
    }

    pub fn get_scan_history(&self) -> Vec<ScanLog> {
        self.state.lock().map(|s| s.scan_history.clone()).unwrap_or_default()
    }

    pub fn get_clean_history(&self) -> Vec<CleanLog> {
        self.state.lock().map(|s| s.clean_history.clone()).unwrap_or_default()
    }

    pub fn get_quarantine_records(&self) -> Vec<QuarantineRecord> {
        self.state.lock().map(|s| s.quarantine_records.clone()).unwrap_or_default()
    }

    pub fn add_quarantine_record(&self, record: QuarantineRecord) {
        if let Ok(mut state) = self.state.lock() {
            state.quarantine_records.push(record);
        }
        self.persist();
    }

    pub fn restore_quarantine_record(&self, record_id: &str) -> Result<String, String> {
        let mut state = self.state.lock().map_err(|e| e.to_string())?;
        if let Some(pos) = state.quarantine_records.iter().position(|r| r.id == record_id) {
            let record = state.quarantine_records.remove(pos);
            let src = std::path::Path::new(&record.quarantined_path);
            let dst = std::path::Path::new(&record.original_path);

            if !src.exists() {
                return Err(format!("Quarantine source file not found at {:?}", src));
            }

            if let Some(parent) = dst.parent() {
                let _ = fs::create_dir_all(parent);
            }

            fs::rename(src, dst)
                .or_else(|_| fs::copy(src, dst).and_then(|_| fs::remove_file(src)))
                .map_err(|e| format!("Failed to restore file to {:?}: {}", dst, e))?;

            drop(state);
            self.persist();
            Ok(record.original_path)
        } else {
            Err(format!("Quarantine record '{}' not found", record_id))
        }
    }

    pub fn get_exclusions(&self) -> Vec<String> {
        self.state.lock().map(|s| s.exclusions.clone()).unwrap_or_default()
    }

    pub fn add_exclusion(&self, path: String) {
        if let Ok(mut state) = self.state.lock() {
            if !state.exclusions.contains(&path) {
                state.exclusions.push(path);
            }
        }
        self.persist();
    }

    pub fn add_beta_feedback(&self, record: BetaFeedbackRecord) {
        if let Ok(mut state) = self.state.lock() {
            state.beta_feedbacks.insert(0, record);
            state.beta_feedbacks.truncate(100);
        }
        self.persist();
    }

    pub fn get_beta_feedbacks(&self) -> Vec<BetaFeedbackRecord> {
        self.state.lock().map(|s| s.beta_feedbacks.clone()).unwrap_or_default()
    }

    pub fn generate_sanitized_diagnostics(&self) -> SanitizedDiagnosticBundle {
        let (quarantine_count, exclusions_count) = self.state.lock()
            .map(|s| (s.quarantine_records.len(), s.exclusions.len()))
            .unwrap_or((0, 0));

        SanitizedDiagnosticBundle {
            os_name: "Windows".to_string(),
            os_version: sysinfo::System::long_os_version().unwrap_or_else(|| "Windows 11 / 10".to_string()),
            architecture: std::env::consts::ARCH.to_string(),
            app_version: "1.0.0-beta.1".to_string(),
            quarantine_records_count: quarantine_count,
            exclusions_count,
            privacy_declaration: "Zero personal documents, credentials, or file paths collected.".to_string(),
        }
    }
}

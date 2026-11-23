pub mod rules;

use std::fs;
use std::path::Path;
use std::time::{Duration, SystemTime};
use serde::{Deserialize, Serialize};
use walkdir::WalkDir;

pub use rules::{CleanerRule, RiskLevel};
use crate::security::{SecurityValidator, ValidationResult};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CandidateFile {
    pub path: String,
    pub size: u64,
    pub rule_id: String,
    pub risk_level: RiskLevel,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanCategoryResult {
    pub rule_id: String,
    pub name: String,
    pub category: String,
    pub risk_level: RiskLevel,
    pub file_count: usize,
    pub total_size: u64,
    pub files: Vec<CandidateFile>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanSummary {
    pub total_files: usize,
    pub total_bytes: u64,
    pub categories: Vec<ScanCategoryResult>,
    pub scan_duration_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CleanResult {
    pub cleaned_files: usize,
    pub cleaned_bytes: u64,
    pub skipped_files: usize,
    pub errors: Vec<String>,
    pub quarantine_id: Option<String>,
}

pub struct CleanerEngine;

impl CleanerEngine {
    /// Scans candidate directories according to configured rules
    pub fn scan(rules: &[CleanerRule]) -> ScanSummary {
        let start = std::time::Instant::now();
        let mut categories = Vec::new();
        let mut grand_total_files = 0;
        let mut grand_total_bytes = 0;

        for rule in rules {
            let mut matched_files = Vec::new();
            let mut cat_size = 0u64;

            for target in &rule.target_paths {
                if !target.exists() {
                    continue;
                }

                // Verify root target passes safety validator
                if let ValidationResult::Blocked(reason) = SecurityValidator::validate_target_path(target) {
                    eprintln!("Skipping target {:?}: {}", target, reason);
                    continue;
                }

                for entry in WalkDir::new(target)
                    .max_depth(5)
                    .follow_links(false) // Strict: NEVER follow symlinks or junctions!
                    .into_iter()
                    .filter_map(|e| e.ok())
                {
                    let p = entry.path();
                    if !p.is_file() {
                        continue;
                    }

                    // Strict safety check for every individual candidate file
                    if SecurityValidator::validate_target_path(p) != ValidationResult::Safe {
                        continue;
                    }

                    // Check extension filter if specified
                    if !rule.extensions.is_empty() {
                        let ext = p.extension().and_then(|s| s.to_str()).unwrap_or("").to_lowercase();
                        if !rule.extensions.iter().any(|e| e.to_lowercase() == ext) {
                            continue;
                        }
                    }

                    // Check age filter if specified
                    if rule.min_age_hours > 0 {
                        if let Ok(metadata) = p.metadata() {
                            if let Ok(modified) = metadata.modified() {
                                if let Ok(elapsed) = SystemTime::now().duration_since(modified) {
                                    if elapsed < Duration::from_secs(rule.min_age_hours * 3600) {
                                        continue;
                                    }
                                }
                            }
                        }
                    }

                    if let Ok(metadata) = p.metadata() {
                        let size = metadata.len();
                        cat_size += size;
                        matched_files.push(CandidateFile {
                            path: p.to_string_lossy().to_string(),
                            size,
                            rule_id: rule.id.clone(),
                            risk_level: rule.risk_level.clone(),
                        });
                    }
                }
            }

            grand_total_files += matched_files.len();
            grand_total_bytes += cat_size;

            categories.push(ScanCategoryResult {
                rule_id: rule.id.clone(),
                name: rule.name.clone(),
                category: rule.category.clone(),
                risk_level: rule.risk_level.clone(),
                file_count: matched_files.len(),
                total_size: cat_size,
                files: matched_files,
            });
        }

        ScanSummary {
            total_files: grand_total_files,
            total_bytes: grand_total_bytes,
            categories,
            scan_duration_ms: start.elapsed().as_millis() as u64,
        }
    }

    /// Safely cleans selected files with pre-validation and quarantine staging option
    pub fn clean_files(file_paths: &[String], use_quarantine: bool) -> CleanResult {
        let mut cleaned_files = 0;
        let mut cleaned_bytes = 0u64;
        let mut skipped_files = 0;
        let mut errors = Vec::new();
        let quarantine_id = if use_quarantine {
            Some(uuid::Uuid::new_v4().to_string())
        } else {
            None
        };

        let quarantine_dir = if let Some(ref qid) = quarantine_id {
            dirs::data_local_dir().map(|d| d.join("NEXORA").join("Quarantine").join(qid))
        } else {
            None
        };

        if let Some(ref qdir) = quarantine_dir {
            let _ = fs::create_dir_all(qdir);
        }

        for path_str in file_paths {
            let p = Path::new(path_str);
            if !p.exists() {
                continue;
            }

            // Invariant: Re-validate immediately prior to destructive action (anti-TOCTOU)
            if SecurityValidator::validate_target_path(p) != ValidationResult::Safe {
                errors.push(format!("Blocked unsafe path: {}", path_str));
                continue;
            }

            // Get file size
            let size = p.metadata().map(|m| m.len()).unwrap_or(0);

            if let Some(ref qdir) = quarantine_dir {
                // Move to quarantine
                let file_name = p.file_name().unwrap_or_default();
                let dest = qdir.join(format!("{}_{}", uuid::Uuid::new_v4().simple(), file_name.to_string_lossy()));
                match fs::rename(p, &dest) {
                    Ok(_) => {
                        cleaned_files += 1;
                        cleaned_bytes += size;
                    }
                    Err(_) => {
                        // If cross-device move or locked
                        match fs::copy(p, &dest).and_then(|_| fs::remove_file(p)) {
                            Ok(_) => {
                                cleaned_files += 1;
                                cleaned_bytes += size;
                            }
                            Err(_) => {
                                skipped_files += 1;
                            }
                        }
                    }
                }
            } else {
                // Direct deletion
                match fs::remove_file(p) {
                    Ok(_) => {
                        cleaned_files += 1;
                        cleaned_bytes += size;
                    }
                    Err(_) => {
                        // File is locked by an active process
                        skipped_files += 1;
                    }
                }
            }
        }

        CleanResult {
            cleaned_files,
            cleaned_bytes,
            skipped_files,
            errors,
            quarantine_id,
        }
    }
}

use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum RiskLevel {
    Low,
    Medium,
    High,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CleanerRule {
    pub id: String,
    pub name: String,
    pub description: String,
    pub category: String,
    pub risk_level: RiskLevel,
    pub target_paths: Vec<PathBuf>,
    pub extensions: Vec<String>,
    pub min_age_hours: u64,
    pub enabled_by_default: bool,
}

impl CleanerRule {
    pub fn get_default_rules() -> Vec<CleanerRule> {
        let mut rules = Vec::new();

        // 1. User Temp Directory
        if let Ok(temp_dir) = std::env::var("TEMP") {
            rules.push(CleanerRule {
                id: "user_temp".to_string(),
                name: "User Temporary Files".to_string(),
                description: "Temporary files created by installed user applications".to_string(),
                category: "System".to_string(),
                risk_level: RiskLevel::Low,
                target_paths: vec![PathBuf::from(temp_dir)],
                extensions: vec!["tmp".into(), "log".into(), "bak".into(), "old".into(), "chk".into()],
                min_age_hours: 0,
                enabled_by_default: true,
            });
        }

        // 2. Windows Temp Directory
        let win_temp = PathBuf::from("C:\\Windows\\Temp");
        if win_temp.exists() {
            rules.push(CleanerRule {
                id: "win_temp".to_string(),
                name: "Windows System Temp".to_string(),
                description: "System-level temporary files and maintenance leftovers".to_string(),
                category: "System".to_string(),
                risk_level: RiskLevel::Low,
                target_paths: vec![win_temp],
                extensions: vec!["tmp".into(), "log".into(), "txt".into(), "bak".into()],
                min_age_hours: 24, // Keep files younger than 24h for safety
                enabled_by_default: true,
            });
        }

        // 3. Thumbnail Cache
        if let Some(local_app_data) = dirs::data_local_dir() {
            let thumb_path = local_app_data.join("Microsoft").join("Windows").join("Explorer");
            if thumb_path.exists() {
                rules.push(CleanerRule {
                    id: "thumb_cache".to_string(),
                    name: "Explorer Thumbnail Cache".to_string(),
                    description: "Cached image, video, and document thumbnail previews".to_string(),
                    category: "System".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![thumb_path],
                    extensions: vec!["db".into()],
                    min_age_hours: 0,
                    enabled_by_default: true,
                });
            }

            // 4. Crash Dumps
            let crash_dumps = local_app_data.join("CrashDumps");
            if crash_dumps.exists() {
                rules.push(CleanerRule {
                    id: "crash_dumps".to_string(),
                    name: "Application Crash Dumps".to_string(),
                    description: "Diagnostic memory dumps created when applications crash".to_string(),
                    category: "Diagnostics".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![crash_dumps],
                    extensions: vec!["dmp".into()],
                    min_age_hours: 0,
                    enabled_by_default: true,
                });
            }

            // 5. Windows Error Reporting
            let wer_path = local_app_data.join("Microsoft").join("Windows").join("WER");
            if wer_path.exists() {
                rules.push(CleanerRule {
                    id: "win_wer".to_string(),
                    name: "Windows Error Reporting Logs".to_string(),
                    description: "Telemetric crash records awaiting transmission".to_string(),
                    category: "Diagnostics".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![wer_path],
                    extensions: vec!["wer".into(), "xml".into(), "dmp".into()],
                    min_age_hours: 48,
                    enabled_by_default: true,
                });
            }

            // 6. Google Chrome Cache
            let chrome_cache = local_app_data.join("Google").join("Chrome").join("User Data").join("Default").join("Cache");
            if chrome_cache.exists() {
                rules.push(CleanerRule {
                    id: "chrome_cache".to_string(),
                    name: "Google Chrome Cache".to_string(),
                    description: "Cached web resources (images, scripts, styles)".to_string(),
                    category: "Browsers".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![chrome_cache],
                    extensions: vec![],
                    min_age_hours: 0,
                    enabled_by_default: true,
                });
            }

            // 7. Microsoft Edge Cache
            let edge_cache = local_app_data.join("Microsoft").join("Edge").join("User Data").join("Default").join("Cache");
            if edge_cache.exists() {
                rules.push(CleanerRule {
                    id: "edge_cache".to_string(),
                    name: "Microsoft Edge Cache".to_string(),
                    description: "Cached web resources and temporary media".to_string(),
                    category: "Browsers".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![edge_cache],
                    extensions: vec![],
                    min_age_hours: 0,
                    enabled_by_default: true,
                });
            }

            // 8. Discord Cache
            if let Some(roaming) = dirs::config_dir() {
                let discord_cache = roaming.join("discord").join("Cache");
                if discord_cache.exists() {
                    rules.push(CleanerRule {
                        id: "discord_cache".to_string(),
                        name: "Discord Cache".to_string(),
                        description: "Cached media attachments, emojis, and voice buffers".to_string(),
                        category: "Applications".to_string(),
                        risk_level: RiskLevel::Low,
                        target_paths: vec![discord_cache],
                        extensions: vec![],
                        min_age_hours: 0,
                        enabled_by_default: true,
                    });
                }

                // 9. Spotify Cache
                let spotify_cache = local_app_data.join("Spotify").join("Storage");
                if spotify_cache.exists() {
                    rules.push(CleanerRule {
                        id: "spotify_cache".to_string(),
                        name: "Spotify Stream Cache".to_string(),
                        description: "Temporary offline audio stream buffers".to_string(),
                        category: "Applications".to_string(),
                        risk_level: RiskLevel::Low,
                        target_paths: vec![spotify_cache],
                        extensions: vec![],
                        min_age_hours: 0,
                        enabled_by_default: true,
                    });
                }
            }
        }

        rules
    }
}

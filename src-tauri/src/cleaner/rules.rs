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
    /// Expanded cleaner catalog inspired by BleachBit (CleanerML) and open-source system utilities.
    /// Strictly respects user privacy boundaries: preserves credentials, session tokens, and passwords.
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
                min_age_hours: 24, // Keep files younger than 24h for operating system stability
                enabled_by_default: true,
            });
        }

        // 3. Windows Update Staging Download Cache
        let win_update_dl = PathBuf::from("C:\\Windows\\SoftwareDistribution\\Download");
        if win_update_dl.exists() {
            rules.push(CleanerRule {
                id: "win_update_cache".to_string(),
                name: "Windows Update Download Cache".to_string(),
                description: "Temporary staging files left after Windows updates have completed installation".to_string(),
                category: "System".to_string(),
                risk_level: RiskLevel::Low,
                target_paths: vec![win_update_dl],
                extensions: vec![],
                min_age_hours: 48,
                enabled_by_default: true,
            });
        }

        if let Some(local_app_data) = dirs::data_local_dir() {
            // 4. Explorer Thumbnail Cache
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

            // 5. Crash Dumps
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

            // 6. Windows Error Reporting (WER)
            let wer_path = local_app_data.join("Microsoft").join("Windows").join("WER");
            if wer_path.exists() {
                rules.push(CleanerRule {
                    id: "win_wer".to_string(),
                    name: "Windows Error Reporting Logs".to_string(),
                    description: "Telemetric crash records and diagnostic traces awaiting transmission".to_string(),
                    category: "Diagnostics".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![wer_path],
                    extensions: vec!["wer".into(), "xml".into(), "dmp".into()],
                    min_age_hours: 48,
                    enabled_by_default: true,
                });
            }

            // 7. Google Chrome Web Cache
            let chrome_cache = local_app_data.join("Google").join("Chrome").join("User Data").join("Default").join("Cache");
            if chrome_cache.exists() {
                rules.push(CleanerRule {
                    id: "chrome_cache".to_string(),
                    name: "Google Chrome Cache".to_string(),
                    description: "Cached web resources (images, script bundles, styles)".to_string(),
                    category: "Browsers".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![chrome_cache],
                    extensions: vec![],
                    min_age_hours: 0,
                    enabled_by_default: true,
                });
            }

            // 8. Microsoft Edge Web Cache
            let edge_cache = local_app_data.join("Microsoft").join("Edge").join("User Data").join("Default").join("Cache");
            if edge_cache.exists() {
                rules.push(CleanerRule {
                    id: "edge_cache".to_string(),
                    name: "Microsoft Edge Cache".to_string(),
                    description: "Cached web resources and temporary media files".to_string(),
                    category: "Browsers".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![edge_cache],
                    extensions: vec![],
                    min_age_hours: 0,
                    enabled_by_default: true,
                });
            }

            // 9. Brave Browser Web Cache
            let brave_cache = local_app_data.join("BraveSoftware").join("Brave-Browser").join("User Data").join("Default").join("Cache");
            if brave_cache.exists() {
                rules.push(CleanerRule {
                    id: "brave_cache".to_string(),
                    name: "Brave Browser Cache".to_string(),
                    description: "Transient website caches and cached script bundles".to_string(),
                    category: "Browsers".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![brave_cache],
                    extensions: vec![],
                    min_age_hours: 0,
                    enabled_by_default: true,
                });
            }

            // 10. Mozilla Firefox Cache
            let firefox_profiles = local_app_data.join("Mozilla").join("Firefox").join("Profiles");
            if firefox_profiles.exists() {
                if let Ok(entries) = std::fs::read_dir(&firefox_profiles) {
                    for entry in entries.filter_map(|e| e.ok()) {
                        let cache2 = entry.path().join("cache2");
                        if cache2.exists() {
                            rules.push(CleanerRule {
                                id: format!("firefox_cache_{}", entry.file_name().to_string_lossy()),
                                name: "Mozilla Firefox Cache".to_string(),
                                description: "Temporary HTTP web resource cache".to_string(),
                                category: "Browsers".to_string(),
                                risk_level: RiskLevel::Low,
                                target_paths: vec![cache2],
                                extensions: vec![],
                                min_age_hours: 0,
                                enabled_by_default: true,
                            });
                            break;
                        }
                    }
                }
            }

            // 11. Steam Client Web & Shader Cache
            let steam_html = local_app_data.join("Steam").join("htmlcache");
            if steam_html.exists() {
                rules.push(CleanerRule {
                    id: "steam_cache".to_string(),
                    name: "Steam Client HTML Cache".to_string(),
                    description: "Embedded browser cache from the Steam game client".to_string(),
                    category: "Gaming".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![steam_html],
                    extensions: vec![],
                    min_age_hours: 0,
                    enabled_by_default: true,
                });
            }

            // 12. Epic Games Launcher Cache
            let epic_cache = local_app_data.join("EpicGamesLauncher").join("Saved").join("webcache");
            if epic_cache.exists() {
                rules.push(CleanerRule {
                    id: "epic_cache".to_string(),
                    name: "Epic Games Launcher Cache".to_string(),
                    description: "Launcher interface cache and thumbnail previews".to_string(),
                    category: "Gaming".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![epic_cache],
                    extensions: vec![],
                    min_age_hours: 0,
                    enabled_by_default: true,
                });
            }

            // 13. Python Pip Wheel Cache (Developer Caches)
            let pip_cache = local_app_data.join("pip").join("cache");
            if pip_cache.exists() {
                rules.push(CleanerRule {
                    id: "pip_cache".to_string(),
                    name: "Python Pip Cache".to_string(),
                    description: "Cached wheels, pre-built binaries, and HTTP downloads".to_string(),
                    category: "Developer".to_string(),
                    risk_level: RiskLevel::Medium,
                    target_paths: vec![pip_cache],
                    extensions: vec!["whl".into(), "tar.gz".into(), "zip".into()],
                    min_age_hours: 0,
                    enabled_by_default: false,
                });
            }

            // 14. Spotify Stream Cache
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

        if let Some(roaming) = dirs::config_dir() {
            // 15. Discord Media Cache
            let discord_cache = roaming.join("discord").join("Cache");
            if discord_cache.exists() {
                rules.push(CleanerRule {
                    id: "discord_cache".to_string(),
                    name: "Discord Media Cache".to_string(),
                    description: "Cached media attachments, stickers, and voice buffers".to_string(),
                    category: "Applications".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![discord_cache],
                    extensions: vec![],
                    min_age_hours: 0,
                    enabled_by_default: true,
                });
            }

            // 16. Node.js NPM Cache (Developer Caches)
            let npm_cache = roaming.join("npm-cache");
            if npm_cache.exists() {
                rules.push(CleanerRule {
                    id: "npm_cache".to_string(),
                    name: "Node.js NPM Cache".to_string(),
                    description: "Cached package archives and tarballs from npm registry".to_string(),
                    category: "Developer".to_string(),
                    risk_level: RiskLevel::Medium,
                    target_paths: vec![npm_cache],
                    extensions: vec!["tgz".into()],
                    min_age_hours: 0,
                    enabled_by_default: false,
                });
            }

            // 17. Visual Studio Code Web Cache
            let vscode_cache = roaming.join("Code").join("Cache");
            if vscode_cache.exists() {
                rules.push(CleanerRule {
                    id: "vscode_cache".to_string(),
                    name: "VS Code Editor Cache".to_string(),
                    description: "Editor runtime web cache and extension preview buffers".to_string(),
                    category: "Developer".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![vscode_cache],
                    extensions: vec![],
                    min_age_hours: 0,
                    enabled_by_default: true,
                });
            }
        }

        // 18. Rust Cargo Registry Cache (Developer Caches)
        if let Some(home) = dirs::home_dir() {
            let cargo_cache = home.join(".cargo").join("registry").join("cache");
            if cargo_cache.exists() {
                rules.push(CleanerRule {
                    id: "cargo_cache".to_string(),
                    name: "Rust Cargo Registry Cache".to_string(),
                    description: "Pre-downloaded .crate archives from crates.io".to_string(),
                    category: "Developer".to_string(),
                    risk_level: RiskLevel::Medium,
                    target_paths: vec![cargo_cache],
                    extensions: vec!["crate".into()],
                    min_age_hours: 0,
                    enabled_by_default: false,
                });
            }
        }

        // 19. DirectX Shader Cache (BleachBit & Game Optimization)
        if let Some(local_app_data) = dirs::data_local_dir() {
            let d3d_cache = local_app_data.join("D3DSCache");
            if d3d_cache.exists() {
                rules.push(CleanerRule {
                    id: "d3d_shader_cache".to_string(),
                    name: "DirectX Shader Cache".to_string(),
                    description: "Pre-compiled GPU shader binaries that can be safely rebuilt on demand".to_string(),
                    category: "Gaming".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![d3d_cache],
                    extensions: vec![],
                    min_age_hours: 24,
                    enabled_by_default: true,
                });
            }

            // 20. NVIDIA GPU Shader Cache
            let nvidia_cache = local_app_data.join("NVIDIA").join("DXCache");
            if nvidia_cache.exists() {
                rules.push(CleanerRule {
                    id: "nvidia_shader_cache".to_string(),
                    name: "NVIDIA DX Shader Cache".to_string(),
                    description: "Compiled graphics shader cache for NVIDIA GeForce GPUs".to_string(),
                    category: "Gaming".to_string(),
                    risk_level: RiskLevel::Low,
                    target_paths: vec![nvidia_cache],
                    extensions: vec!["bin".into(), "toc".into()],
                    min_age_hours: 48,
                    enabled_by_default: true,
                });
            }
        }

        // 21. Windows Component-Based Servicing (CBS) Logs
        let cbs_logs = PathBuf::from("C:\\Windows\\Logs\\CBS");
        if cbs_logs.exists() {
            rules.push(CleanerRule {
                id: "win_cbs_logs".to_string(),
                name: "Windows CBS Servicing Logs".to_string(),
                description: "Archived component installation and servicing logs".to_string(),
                category: "Diagnostics".to_string(),
                risk_level: RiskLevel::Low,
                target_paths: vec![cbs_logs],
                extensions: vec!["log".into(), "cab".into()],
                min_age_hours: 72,
                enabled_by_default: true,
            });
        }

        rules
    }
}

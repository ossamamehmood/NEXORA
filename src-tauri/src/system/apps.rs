use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstalledApp {
    pub id: String,
    pub name: String,
    pub publisher: String,
    pub version: String,
    pub install_date: String,
    pub estimated_size_bytes: u64,
    pub uninstall_string: Option<String>,
}

pub struct ApplicationManager;

impl ApplicationManager {
    /// Enumerates installed software from Windows Registry (HKLM, WOW6432Node, and HKCU)
    pub fn get_installed_applications() -> Vec<InstalledApp> {
        let mut apps = Vec::new();

        #[cfg(target_os = "windows")]
        {
            use winreg::enums::*;
            use winreg::RegKey;

            let roots = [
                (HKEY_LOCAL_MACHINE, "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall"),
                (HKEY_LOCAL_MACHINE, "Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall"),
                (HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall"),
            ];

            for (hkey, path) in &roots {
                let root_key = RegKey::predef(*hkey);
                if let Ok(uninstall_key) = root_key.open_subkey(path) {
                    for key_name in uninstall_key.enum_keys().filter_map(|k| k.ok()) {
                        if let Ok(app_key) = uninstall_key.open_subkey(&key_name) {
                            // Check if marked as hidden system component
                            let is_system: u32 = app_key.get_value("SystemComponent").unwrap_or(0);
                            if is_system == 1 {
                                continue;
                            }

                            if let Ok(display_name) = app_key.get_value::<String, _>("DisplayName") {
                                if display_name.trim().is_empty() {
                                    continue;
                                }

                                let publisher: String = app_key.get_value("Publisher").unwrap_or_else(|_| "Unknown Publisher".into());
                                let version: String = app_key.get_value("DisplayVersion").unwrap_or_else(|_| "1.0.0".into());
                                let install_date: String = app_key.get_value("InstallDate").unwrap_or_else(|_| "Unknown".into());
                                let size_kb: u32 = app_key.get_value("EstimatedSize").unwrap_or(0);
                                let uninstall_cmd: Option<String> = app_key.get_value("UninstallString").ok();

                                // Prevent duplicates across registry roots
                                if !apps.iter().any(|a: &InstalledApp| a.name == display_name) {
                                    apps.push(InstalledApp {
                                        id: format!("{}_{}", key_name, apps.len()),
                                        name: display_name,
                                        publisher,
                                        version,
                                        install_date,
                                        estimated_size_bytes: (size_kb as u64) * 1024,
                                        uninstall_string: uninstall_cmd,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        // Sort alphabetically by app name
        apps.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
        apps
    }
}

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StartupEntry {
    pub id: String,
    pub name: String,
    pub command: String,
    pub location: String, // "HKCU\\Run", "HKLM\\Run", or "Startup Folder"
    pub enabled: bool,
    pub is_protected: bool,
}

pub struct StartupManager;

impl StartupManager {
    /// Enumerates startup entries from Windows Registry and Startup Folder
    pub fn get_startup_entries() -> Vec<StartupEntry> {
        let mut entries = Vec::new();

        #[cfg(target_os = "windows")]
        {
            use winreg::enums::*;
            use winreg::RegKey;

            // 1. Current User Run Key
            let hkcu = RegKey::predef(HKEY_CURRENT_USER);
            if let Ok(run_key) = hkcu.open_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\Run") {
                // Check StartupApproved if available
                let approved_key = hkcu.open_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\Run").ok();

                for item in run_key.enum_values().filter_map(|x| x.ok()) {
                    let name = item.0;
                    let command = item.1.to_string();
                    let mut enabled = true;

                    if let Some(ref app_key) = approved_key {
                        if let Ok(val) = app_key.get_raw_value(&name) {
                            // If first byte is 0x03, item is disabled
                            if !val.bytes.is_empty() && (val.bytes[0] % 2 != 0 && val.bytes[0] != 0) {
                                enabled = false;
                            }
                        }
                    }

                    let is_protected = Self::is_protected_app(&name, &command);

                    entries.push(StartupEntry {
                        id: format!("hkcu_{}", name),
                        name,
                        command,
                        location: "HKCU\\Run".to_string(),
                        enabled,
                        is_protected,
                    });
                }
            }

            // 2. Local Machine Run Key
            let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
            if let Ok(run_key) = hklm.open_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\Run") {
                for item in run_key.enum_values().filter_map(|x| x.ok()) {
                    let name = item.0;
                    let command = item.1.to_string();
                    let is_protected = Self::is_protected_app(&name, &command);

                    entries.push(StartupEntry {
                        id: format!("hklm_{}", name),
                        name,
                        command,
                        location: "HKLM\\Run".to_string(),
                        enabled: true,
                        is_protected,
                    });
                }
            }
        }

        // 3. User Startup Folder
        if let Some(app_data) = dirs::data_dir() {
            let startup_dir = app_data.join("Microsoft").join("Windows").join("Start Menu").join("Programs").join("Startup");
            if startup_dir.exists() {
                if let Ok(read_dir) = std::fs::read_dir(startup_dir) {
                    for entry in read_dir.filter_map(|e| e.ok()) {
                        let path = entry.path();
                        if path.is_file() {
                            let file_name = path.file_stem().and_then(|s| s.to_str()).unwrap_or("Shortcut").to_string();
                            entries.push(StartupEntry {
                                id: format!("folder_{}", file_name),
                                name: file_name,
                                command: path.to_string_lossy().to_string(),
                                location: "Startup Folder".to_string(),
                                enabled: true,
                                is_protected: false,
                            });
                        }
                    }
                }
            }
        }

        entries
    }

    /// Toggles a startup entry non-destructively using StartupApproved
    pub fn toggle_entry(entry_id: &str, enable: bool) -> Result<(), String> {
        #[cfg(target_os = "windows")]
        {
            use winreg::enums::*;
            use winreg::RegKey;

            if let Some(name) = entry_id.strip_prefix("hkcu_") {
                let hkcu = RegKey::predef(HKEY_CURRENT_USER);
                let (approved_key, _) = hkcu.create_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\Run")
                    .map_err(|e| e.to_string())?;

                // Windows binary flag: 0x02 = Enabled, 0x03 = Disabled by user
                let data = vec![if enable { 0x02u8 } else { 0x03u8 }, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
                let raw_val = winreg::RegValue {
                    vtype: REG_BINARY,
                    bytes: data,
                };
                approved_key.set_raw_value(name, &raw_val).map_err(|e| e.to_string())?;
                return Ok(());
            }
        }

        Ok(())
    }

    fn is_protected_app(name: &str, command: &str) -> bool {
        let combined = format!("{} {}", name, command).to_lowercase();
        combined.contains("windows defender")
            || combined.contains("securityhealth")
            || combined.contains("realtek")
            || combined.contains("intel")
            || combined.contains("nvidia")
            || combined.contains("amd")
            || combined.contains("audio")
    }
}

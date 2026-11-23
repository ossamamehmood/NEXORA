use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::sync::Mutex;
use chrono::Local;
use serde::{Deserialize, Serialize};

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;

fn create_hidden_command(program: &str) -> Command {
    let mut cmd = Command::new(program);
    #[cfg(target_os = "windows")]
    cmd.creation_flags(CREATE_NO_WINDOW);
    cmd
}

#[cfg(target_os = "windows")]
mod win_priority {
    use std::ffi::c_void;

    const PROCESS_QUERY_LIMITED_INFORMATION: u32 = 0x1000;
    const PROCESS_SET_INFORMATION: u32 = 0x0200;

    pub const IDLE_PRIORITY_CLASS: u32 = 0x00000040;
    pub const BELOW_NORMAL_PRIORITY_CLASS: u32 = 0x00004000;
    pub const NORMAL_PRIORITY_CLASS: u32 = 0x00000020;
    pub const ABOVE_NORMAL_PRIORITY_CLASS: u32 = 0x00008000;
    pub const HIGH_PRIORITY_CLASS: u32 = 0x00000080;
    pub const REALTIME_PRIORITY_CLASS: u32 = 0x00000100;

    #[link(name = "kernel32")]
    extern "system" {
        fn OpenProcess(dwDesiredAccess: u32, bInheritHandle: i32, dwProcessId: u32) -> *mut c_void;
        fn GetPriorityClass(hProcess: *mut c_void) -> u32;
        fn SetPriorityClass(hProcess: *mut c_void, dwPriorityClass: u32) -> i32;
        fn CloseHandle(hObject: *mut c_void) -> i32;
    }

    pub fn priority_str_to_u32(p: &str) -> u32 {
        match p.to_lowercase().as_str() {
            "high" => HIGH_PRIORITY_CLASS,
            "abovenormal" | "above_normal" => ABOVE_NORMAL_PRIORITY_CLASS,
            "belownormal" | "below_normal" => BELOW_NORMAL_PRIORITY_CLASS,
            "idle" => IDLE_PRIORITY_CLASS,
            "realtime" => REALTIME_PRIORITY_CLASS,
            _ => NORMAL_PRIORITY_CLASS,
        }
    }

    pub fn priority_u32_to_str(p: u32) -> &'static str {
        match p {
            HIGH_PRIORITY_CLASS => "High",
            ABOVE_NORMAL_PRIORITY_CLASS => "AboveNormal",
            BELOW_NORMAL_PRIORITY_CLASS => "BelowNormal",
            IDLE_PRIORITY_CLASS => "Idle",
            REALTIME_PRIORITY_CLASS => "Realtime",
            _ => "Normal",
        }
    }

    pub fn get_process_priority(pid: u32) -> Option<String> {
        let handle = unsafe { OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, 0, pid) };
        if handle.is_null() {
            return None;
        }
        let prio = unsafe { GetPriorityClass(handle) };
        unsafe { CloseHandle(handle) };
        if prio == 0 {
            None
        } else {
            Some(priority_u32_to_str(prio).to_string())
        }
    }

    pub fn set_process_priority(pid: u32, target: &str) -> bool {
        let prio_val = priority_str_to_u32(target);
        let handle = unsafe { OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_SET_INFORMATION, 0, pid) };
        if handle.is_null() {
            return false;
        }
        let res = unsafe { SetPriorityClass(handle, prio_val) };
        unsafe { CloseHandle(handle) };
        res != 0
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameProfile {
    pub id: String,
    pub name: String,
    pub executable: String,
    pub priority: String, // "High", "AboveNormal", "Normal"
    pub auto_detect: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetectedGame {
    pub name: String,
    pub executable: String,
    pub pid: u32,
    pub cpu_usage: f32,
    pub memory_bytes: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BackgroundAppCandidate {
    pub pid: u32,
    pub name: String,
    pub memory_bytes: u64,
    pub cpu_usage: f32,
    pub is_safe_to_close: bool,
    pub category: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GamingLogEntry {
    pub timestamp: String,
    pub event_type: String, // "Power", "Priority", "Process", "Detection"
    pub message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GamingModeState {
    pub is_enabled: bool,
    pub preset: String, // "Balanced", "Performance", "Custom"
    pub active_game: Option<DetectedGame>,
    pub session_start: Option<String>,
    pub session_duration_seconds: u64,
    pub original_power_scheme_guid: Option<String>,
    pub current_power_scheme_name: String,
    pub managed_processes_count: usize,
    pub activity_logs: Vec<GamingLogEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct RecoveryJournal {
    original_power_scheme_guid: Option<String>,
    modified_priorities: HashMap<u32, String>,
}

pub struct GamingEngine {
    state: Mutex<GamingModeState>,
    custom_profiles: Mutex<Vec<GameProfile>>,
    original_priorities: Mutex<HashMap<u32, String>>,
    recovery_file: PathBuf,
}

impl GamingEngine {
    pub fn init() -> Self {
        let recovery_dir = dirs::data_local_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("NEXORA");
        let _ = fs::create_dir_all(&recovery_dir);
        let recovery_file = recovery_dir.join("gaming_recovery.json");

        // Crash recovery safeguard check: if recovery file exists, system was terminated abnormally
        if recovery_file.exists() {
            if let Ok(content) = fs::read_to_string(&recovery_file) {
                if let Ok(journal) = serde_json::from_str::<RecoveryJournal>(&content) {
                    if let Some(ref guid) = journal.original_power_scheme_guid {
                        let _ = create_hidden_command("powercfg")
                            .args(["/setactive", guid])
                            .output();
                    }
                    for (pid, orig_prio) in journal.modified_priorities {
                        #[cfg(target_os = "windows")]
                        win_priority::set_process_priority(pid, &orig_prio);
                    }
                }
            }
            let _ = fs::remove_file(&recovery_file);
        }

        let current_scheme = Self::query_active_power_scheme_name();

        let initial_state = GamingModeState {
            is_enabled: false,
            preset: "Performance".to_string(),
            active_game: None,
            session_start: None,
            session_duration_seconds: 0,
            original_power_scheme_guid: None,
            current_power_scheme_name: current_scheme,
            managed_processes_count: 0,
            activity_logs: vec![GamingLogEntry {
                timestamp: Local::now().to_rfc3339(),
                event_type: "System".to_string(),
                message: "Gaming Engine initialized with zero background hooks.".to_string(),
            }],
        };

        let default_profiles = vec![
            GameProfile { id: "p1".into(), name: "Counter-Strike 2".into(), executable: "cs2.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p2".into(), name: "Valorant".into(), executable: "valorant-win64-shipping.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p3".into(), name: "Cyberpunk 2077".into(), executable: "cyberpunk2077.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p4".into(), name: "Dota 2".into(), executable: "dota2.exe".into(), priority: "AboveNormal".into(), auto_detect: true },
            GameProfile { id: "p5".into(), name: "Grand Theft Auto V".into(), executable: "gta5.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p6".into(), name: "Fortnite".into(), executable: "fortniteclient-win64-shipping.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p7".into(), name: "Elden Ring".into(), executable: "eldenring.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p8".into(), name: "Apex Legends".into(), executable: "r5apex.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p9".into(), name: "Helldivers 2".into(), executable: "helldivers2.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p10".into(), name: "Overwatch 2".into(), executable: "overwatch.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p11".into(), name: "Rocket League".into(), executable: "rocketleague.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p12".into(), name: "Rainbow Six Siege".into(), executable: "rainbowsix.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p13".into(), name: "Call of Duty / Warzone".into(), executable: "cod.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p14".into(), name: "Baldur's Gate 3".into(), executable: "bg3_dx11.exe".into(), priority: "High".into(), auto_detect: true },
            GameProfile { id: "p15".into(), name: "Starfield".into(), executable: "starfield.exe".into(), priority: "High".into(), auto_detect: true },
        ];

        Self {
            state: Mutex::new(initial_state),
            custom_profiles: Mutex::new(default_profiles),
            original_priorities: Mutex::new(HashMap::new()),
            recovery_file,
        }
    }

    fn query_active_power_scheme() -> Option<(String, String)> {
        let output = create_hidden_command("powercfg")
            .arg("/getactivescheme")
            .output()
            .ok()?;
        let stdout = String::from_utf8_lossy(&output.stdout);
        // Format: Power Scheme GUID: c008d0e7-ab71-4902-b36f-655c7e4be0c9  (High Performance)
        if let Some(pos) = stdout.find("GUID:") {
            let rest = stdout[pos + 5..].trim();
            let parts: Vec<&str> = rest.split_whitespace().collect();
            if !parts.is_empty() {
                let guid = parts[0].to_string();
                let name = if let Some(start) = rest.find('(') {
                    if let Some(end) = rest.find(')') {
                        rest[start + 1..end].trim().to_string()
                    } else {
                        "Custom Scheme".to_string()
                    }
                } else {
                    "Standard Scheme".to_string()
                };
                return Some((guid, name));
            }
        }
        None
    }

    fn query_active_power_scheme_name() -> String {
        Self::query_active_power_scheme()
            .map(|(_, name)| name)
            .unwrap_or_else(|| "Balanced".to_string())
    }

    pub fn get_state(&self) -> GamingModeState {
        let mut state = self.state.lock().unwrap().clone();
        if state.is_enabled {
            if let Some(ref start_str) = state.session_start {
                if let Ok(start_time) = chrono::DateTime::parse_from_rfc3339(start_str) {
                    state.session_duration_seconds = (Local::now().timestamp() - start_time.timestamp()).max(0) as u64;
                }
            }
        }
        state.current_power_scheme_name = Self::query_active_power_scheme_name();
        state
    }

    pub fn detect_active_game(&self) -> Option<DetectedGame> {
        let processes = crate::monitoring::TelemetryEngine::get_processes_list();
        let profiles = self.custom_profiles.lock().unwrap();

        for process in processes {
            let proc_name = process.name.to_lowercase();
            for profile in profiles.iter() {
                let exec_lower = profile.executable.to_lowercase();
                if proc_name == exec_lower || proc_name.starts_with(&exec_lower.replace(".exe", "")) {
                    return Some(DetectedGame {
                        name: profile.name.clone(),
                        executable: profile.executable.clone(),
                        pid: process.pid,
                        cpu_usage: process.cpu_usage,
                        memory_bytes: process.memory_bytes,
                    });
                }
            }
        }
        None
    }

    pub fn toggle_gaming_mode(&self, enable: bool, preset: String) -> Result<GamingModeState, String> {
        let mut state = self.state.lock().map_err(|e| e.to_string())?;

        if enable {
            // 1. Record original power scheme
            let original_scheme = Self::query_active_power_scheme();
            if let Some((ref guid, ref name)) = original_scheme {
                state.original_power_scheme_guid = Some(guid.clone());
                state.activity_logs.insert(0, GamingLogEntry {
                    timestamp: Local::now().to_rfc3339(),
                    event_type: "Power".to_string(),
                    message: format!("Recorded original power scheme '{}' ({})", name, guid),
                });
            }

            // 2. Set power plan to High Performance if preset requires it
            if preset == "Performance" || preset == "Custom" {
                // High Performance GUID: 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c
                let res = create_hidden_command("powercfg")
                    .args(["/setactive", "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c"])
                    .output();
                if res.is_ok() {
                    state.activity_logs.insert(0, GamingLogEntry {
                        timestamp: Local::now().to_rfc3339(),
                        event_type: "Power".to_string(),
                        message: "Switched active power plan to High Performance (zero core parking)".to_string(),
                    });
                }
            }

            // 3. Detect and elevate game priority
            drop(state); // drop lock before detecting
            let detected = self.detect_active_game();
            let mut state = self.state.lock().map_err(|e| e.to_string())?;

            if let Some(ref game) = detected {
                self.apply_game_priority_internal(game.pid, "High")?;
                state.activity_logs.insert(0, GamingLogEntry {
                    timestamp: Local::now().to_rfc3339(),
                    event_type: "Priority".to_string(),
                    message: format!("Elevated process '{}' (PID {}) priority to High", game.name, game.pid),
                });
            }

            state.is_enabled = true;
            state.preset = preset;
            state.active_game = detected;
            state.session_start = Some(Local::now().to_rfc3339());
            state.session_duration_seconds = 0;
            state.current_power_scheme_name = Self::query_active_power_scheme_name();

            let active_preset = state.preset.clone();
            state.activity_logs.insert(0, GamingLogEntry {
                timestamp: Local::now().to_rfc3339(),
                event_type: "Session".to_string(),
                message: format!("Gaming Mode activated in '{}' profile.", active_preset),
            });

            // Write recovery journal to disk
            let journal = RecoveryJournal {
                original_power_scheme_guid: state.original_power_scheme_guid.clone(),
                modified_priorities: self.original_priorities.lock().unwrap().clone(),
            };
            if let Ok(json) = serde_json::to_string(&journal) {
                let _ = fs::write(&self.recovery_file, json);
            }

            Ok(state.clone())
        } else {
            // Restore everything
            if let Some(orig_guid) = state.original_power_scheme_guid.take() {
                let _ = create_hidden_command("powercfg")
                    .args(["/setactive", &orig_guid])
                    .output();
                state.activity_logs.insert(0, GamingLogEntry {
                    timestamp: Local::now().to_rfc3339(),
                    event_type: "Power".to_string(),
                    message: format!("Restored original power scheme ({})", orig_guid),
                });
            }

            // Restore process priorities natively via Win32 API in 0ms (no cmd/powershell popups)
            let mut orig_prios = self.original_priorities.lock().unwrap();
            for (pid, orig_prio) in orig_prios.drain() {
                #[cfg(target_os = "windows")]
                win_priority::set_process_priority(pid, &orig_prio);
            }

            state.is_enabled = false;
            state.active_game = None;
            state.session_start = None;
            state.session_duration_seconds = 0;
            state.original_power_scheme_guid = None;
            state.current_power_scheme_name = Self::query_active_power_scheme_name();

            state.activity_logs.insert(0, GamingLogEntry {
                timestamp: Local::now().to_rfc3339(),
                event_type: "Session".to_string(),
                message: "Gaming Mode deactivated. All system optimizations safely restored.".to_string(),
            });

            let _ = fs::remove_file(&self.recovery_file);
            Ok(state.clone())
        }
    }

    fn apply_game_priority_internal(&self, pid: u32, target_priority: &str) -> Result<(), String> {
        #[cfg(target_os = "windows")]
        {
            if let Some(orig) = win_priority::get_process_priority(pid) {
                let mut orig_map = self.original_priorities.lock().unwrap();
                orig_map.entry(pid).or_insert(orig);
            }

            if win_priority::set_process_priority(pid, target_priority) {
                Ok(())
            } else {
                Err(format!("Could not adjust priority for PID {}", pid))
            }
        }
        #[cfg(not(target_os = "windows"))]
        Ok(())
    }

    pub fn get_background_process_candidates(&self) -> Vec<BackgroundAppCandidate> {
        let processes = crate::monitoring::TelemetryEngine::get_processes_list();

        let protected = [
            "explorer.exe", "dwm.exe", "csrss.exe", "lsass.exe", "smss.exe", "services.exe",
            "winlogon.exe", "svchost.exe", "system", "registry", "conhost.exe", "fontdrvhost.exe",
            "msmpeng.exe", "securityhealthservice.exe", "nissrv.exe", "audiodg.exe", "nvcontainer.exe",
            "nvcplui.exe", "radeonsofware.exe", "spoolsv.exe", "nexora.exe"
        ];

        let mut candidates = Vec::new();

        for proc_ in processes {
            let name = proc_.name.to_lowercase();
            if protected.iter().any(|&p| p == name || name.starts_with(p)) {
                continue;
            }

            let mem = proc_.memory_bytes;
            let cpu = proc_.cpu_usage;

            // Candidate if using significant memory (> 100 MB) or CPU (> 0.8%)
            if mem > 100 * 1024 * 1024 || cpu > 0.8 {
                let category = if name.contains("chrome") || name.contains("edge") || name.contains("firefox") || name.contains("brave") {
                    "Web Browser".to_string()
                } else if name.contains("discord") || name.contains("slack") || name.contains("teams") {
                    "Communication".to_string()
                } else if name.contains("steam") || name.contains("epic") || name.contains("origin") {
                    "Game Launcher".to_string()
                } else if name.contains("onedrive") || name.contains("dropbox") {
                    "Cloud Sync".to_string()
                } else {
                    "Background App".to_string()
                };

                candidates.push(BackgroundAppCandidate {
                    pid: proc_.pid,
                    name: proc_.name,
                    memory_bytes: mem,
                    cpu_usage: cpu,
                    is_safe_to_close: true,
                    category,
                });
            }
        }

        candidates.sort_by(|a, b| b.memory_bytes.cmp(&a.memory_bytes));
        candidates.truncate(20);
        candidates
    }

    pub fn close_background_process(&self, pid: u32) -> Result<bool, String> {
        match crate::monitoring::ProcessMonitor::terminate_process(pid) {
            Ok(killed) => {
                if killed {
                    let mut state = self.state.lock().unwrap();
                    state.managed_processes_count += 1;
                    state.activity_logs.insert(0, GamingLogEntry {
                        timestamp: Local::now().to_rfc3339(),
                        event_type: "Process".to_string(),
                        message: format!("Safely closed background application (PID {})", pid),
                    });
                }
                Ok(killed)
            }
            Err(e) => Err(e),
        }
    }

    pub fn get_custom_profiles(&self) -> Vec<GameProfile> {
        self.custom_profiles.lock().unwrap().clone()
    }

    pub fn add_custom_profile(&self, profile: GameProfile) {
        let mut profiles = self.custom_profiles.lock().unwrap();
        profiles.push(profile);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_gaming_engine_init() {
        let engine = GamingEngine::init();
        let state = engine.get_state();
        assert!(!state.is_enabled, "Gaming mode should initialize disabled");
        assert_eq!(state.preset, "Performance");
        assert!(state.session_start.is_none());
        assert_eq!(state.managed_processes_count, 0);

        let profiles = engine.get_custom_profiles();
        assert!(profiles.len() >= 6, "Default game profiles should be preloaded");
        assert!(profiles.iter().any(|p| p.executable.eq_ignore_ascii_case("Cyberpunk2077.exe")));
        assert!(profiles.iter().any(|p| p.executable.eq_ignore_ascii_case("cs2.exe")));
    }

    #[test]
    fn test_add_custom_profile() {
        let engine = GamingEngine::init();
        let custom = GameProfile {
            id: "test-game-1".to_string(),
            name: "Test Game Online".to_string(),
            executable: "TestGame.exe".to_string(),
            priority: "High".to_string(),
            auto_detect: true,
        };
        engine.add_custom_profile(custom);

        let profiles = engine.get_custom_profiles();
        let found = profiles.iter().find(|p| p.executable == "TestGame.exe");
        assert!(found.is_some());
        assert_eq!(found.unwrap().name, "Test Game Online");
        assert_eq!(found.unwrap().priority, "High");
    }

    #[test]
    fn test_recovery_journal_serialization() {
        let mut map = HashMap::new();
        map.insert(1234, "Normal".to_string());
        map.insert(5678, "BelowNormal".to_string());

        let journal = RecoveryJournal {
            original_power_scheme_guid: Some("381b4222-f694-41f0-9685-ff5bb260df2e".to_string()),
            modified_priorities: map,
        };

        let serialized = serde_json::to_string(&journal).expect("Serialization failed");
        let deserialized: RecoveryJournal = serde_json::from_str(&serialized).expect("Deserialization failed");

        assert_eq!(deserialized.original_power_scheme_guid, Some("381b4222-f694-41f0-9685-ff5bb260df2e".to_string()));
        assert_eq!(deserialized.modified_priorities.get(&1234).unwrap(), "Normal");
        assert_eq!(deserialized.modified_priorities.get(&5678).unwrap(), "BelowNormal");
    }

    #[test]
    fn test_protected_process_exclusion() {
        let protected = [
            "explorer.exe", "dwm.exe", "csrss.exe", "lsass.exe", "smss.exe", "services.exe",
            "winlogon.exe", "svchost.exe", "system", "registry", "conhost.exe", "fontdrvhost.exe",
            "msmpeng.exe", "securityhealthservice.exe", "nissrv.exe", "audiodg.exe", "nvcontainer.exe",
            "nvcplui.exe", "radeonsofware.exe", "spoolsv.exe", "nexora.exe"
        ];

        let engine = GamingEngine::init();
        let candidates = engine.get_background_process_candidates();

        for candidate in candidates {
            let lower = candidate.name.to_lowercase();
            assert!(!protected.contains(&lower.as_str()), "Protected process {} must not be closed", lower);
        }
    }
}

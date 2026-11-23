use serde::{Deserialize, Serialize};
use std::sync::{Mutex, OnceLock};
use std::time::{Duration, Instant};
use sysinfo::{Pid, System};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessItem {
    pub pid: u32,
    pub name: String,
    pub memory_bytes: u64,
    pub cpu_usage: f32,
    pub is_system_critical: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RealtimeMetrics {
    pub cpu_usage_pct: f32,
    pub used_memory_bytes: u64,
    pub total_memory_bytes: u64,
    pub processes_count: usize,
}

#[cfg(target_os = "windows")]
#[repr(C)]
#[derive(Copy, Clone, Default, Debug)]
struct WinFileTime {
    dw_low_date_time: u32,
    dw_high_date_time: u32,
}

#[cfg(target_os = "windows")]
impl WinFileTime {
    fn to_u64(&self) -> u64 {
        ((self.dw_high_date_time as u64) << 32) | (self.dw_low_date_time as u64)
    }
}

#[cfg(target_os = "windows")]
#[link(name = "kernel32")]
extern "system" {
    fn GetSystemTimes(
        lp_idle_time: *mut WinFileTime,
        lp_kernel_time: *mut WinFileTime,
        lp_user_time: *mut WinFileTime,
    ) -> i32;
}

#[cfg(target_os = "windows")]
fn get_win_system_times() -> Option<(u64, u64, u64)> {
    let mut idle = WinFileTime::default();
    let mut kernel = WinFileTime::default();
    let mut user = WinFileTime::default();

    let success = unsafe { GetSystemTimes(&mut idle, &mut kernel, &mut user) };
    if success != 0 {
        Some((idle.to_u64(), kernel.to_u64(), user.to_u64()))
    } else {
        None
    }
}

struct TelemetryState {
    sys: System,
    last_win_times: Option<(u64, u64, u64)>,
    last_sample_instant: Instant,
    cached_cpu_pct: f32,
}

static TELEMETRY_STATE: OnceLock<Mutex<TelemetryState>> = OnceLock::new();

fn get_telemetry_state() -> &'static Mutex<TelemetryState> {
    TELEMETRY_STATE.get_or_init(|| {
        let mut sys = System::new_all();
        sys.refresh_all();

        #[cfg(target_os = "windows")]
        {
            let initial_times = get_win_system_times();
            // Perform a tiny 50ms baseline wait only once at cold engine startup
            std::thread::sleep(Duration::from_millis(50));
            let second_times = get_win_system_times();

            let initial_cpu = if let (Some((i1, k1, u1)), Some((i2, k2, u2))) = (initial_times, second_times) {
                let delta_kernel = k2.saturating_sub(k1);
                let delta_user = u2.saturating_sub(u1);
                let delta_idle = i2.saturating_sub(i1);
                let delta_total = delta_kernel + delta_user;
                if delta_total > 0 {
                    let busy = delta_total.saturating_sub(delta_idle);
                    ((busy as f64 / delta_total as f64) * 100.0).clamp(0.0, 100.0) as f32
                } else {
                    sys.global_cpu_info().cpu_usage()
                }
            } else {
                sys.global_cpu_info().cpu_usage()
            };

            Mutex::new(TelemetryState {
                sys,
                last_win_times: second_times,
                last_sample_instant: Instant::now(),
                cached_cpu_pct: initial_cpu,
            })
        }

        #[cfg(not(target_os = "windows"))]
        {
            Mutex::new(TelemetryState {
                sys,
                last_win_times: None,
                last_sample_instant: Instant::now(),
                cached_cpu_pct: 0.0,
            })
        }
    })
}

pub struct TelemetryEngine;

impl TelemetryEngine {
    pub fn get_cpu_usage() -> f32 {
        let mut state = match get_telemetry_state().lock() {
            Ok(guard) => guard,
            Err(poisoned) => poisoned.into_inner(),
        };

        let now = Instant::now();
        // If sampled less than 200ms ago, return the cached metric to avoid division jitter
        if now.duration_since(state.last_sample_instant) < Duration::from_millis(200) {
            return state.cached_cpu_pct;
        }

        #[cfg(target_os = "windows")]
        {
            if let Some(curr_times) = get_win_system_times() {
                if let Some(prev_times) = state.last_win_times {
                    let delta_kernel = curr_times.1.saturating_sub(prev_times.1);
                    let delta_user = curr_times.2.saturating_sub(prev_times.2);
                    let delta_idle = curr_times.0.saturating_sub(prev_times.0);
                    let delta_total = delta_kernel + delta_user;

                    if delta_total > 0 {
                        let busy = delta_total.saturating_sub(delta_idle);
                        let pct = ((busy as f64 / delta_total as f64) * 100.0).clamp(0.0, 100.0) as f32;
                        let rounded = (pct * 10.0).round() / 10.0;
                        state.cached_cpu_pct = rounded;
                    }
                }
                state.last_win_times = Some(curr_times);
                state.last_sample_instant = now;
                return state.cached_cpu_pct;
            }
        }

        state.sys.refresh_cpu();
        let fallback = state.sys.global_cpu_info().cpu_usage();
        state.cached_cpu_pct = fallback;
        state.last_sample_instant = now;
        fallback
    }

    pub fn get_metrics() -> RealtimeMetrics {
        let cpu_usage = Self::get_cpu_usage();

        let mut state = match get_telemetry_state().lock() {
            Ok(guard) => guard,
            Err(poisoned) => poisoned.into_inner(),
        };

        state.sys.refresh_memory();
        state.sys.refresh_processes();

        RealtimeMetrics {
            cpu_usage_pct: cpu_usage,
            used_memory_bytes: state.sys.used_memory(),
            total_memory_bytes: state.sys.total_memory(),
            processes_count: state.sys.processes().len(),
        }
    }

    pub fn get_processes_list() -> Vec<ProcessItem> {
        let mut state = match get_telemetry_state().lock() {
            Ok(guard) => guard,
            Err(poisoned) => poisoned.into_inner(),
        };

        state.sys.refresh_processes();
        state.sys.refresh_cpu();

        let mut list: Vec<ProcessItem> = state
            .sys
            .processes()
            .iter()
            .map(|(&pid, proc)| {
                let name = proc.name().to_string();
                let is_critical = ProcessMonitor::is_critical_process(&name);
                ProcessItem {
                    pid: pid.as_u32(),
                    name,
                    memory_bytes: proc.memory(),
                    cpu_usage: proc.cpu_usage(),
                    is_system_critical: is_critical,
                }
            })
            .collect();

        list.sort_by(|a, b| b.memory_bytes.cmp(&a.memory_bytes));
        list
    }

    pub fn get_cpu_brand_and_cores() -> (String, usize) {
        let state = match get_telemetry_state().lock() {
            Ok(guard) => guard,
            Err(poisoned) => poisoned.into_inner(),
        };

        let brand = state
            .sys
            .cpus()
            .first()
            .map(|c| c.brand().to_string())
            .unwrap_or_else(|| "Unknown Processor".into());
        let cores = state.sys.cpus().len();
        (brand, cores)
    }
}

pub struct ProcessMonitor;

impl ProcessMonitor {
    pub fn get_processes() -> Vec<ProcessItem> {
        TelemetryEngine::get_processes_list()
    }

    pub fn get_realtime_metrics() -> RealtimeMetrics {
        TelemetryEngine::get_metrics()
    }

    pub fn terminate_process(pid: u32) -> Result<bool, String> {
        let mut state = match get_telemetry_state().lock() {
            Ok(guard) => guard,
            Err(poisoned) => poisoned.into_inner(),
        };

        state.sys.refresh_processes();
        let sys_pid = Pid::from_u32(pid);
        if let Some(proc) = state.sys.process(sys_pid) {
            let name = proc.name().to_string();
            if Self::is_critical_process(&name) {
                return Err(format!("Process '{}' (PID {}) is a protected Windows system component and cannot be terminated.", name, pid));
            }
            if proc.kill() {
                Ok(true)
            } else {
                Err(format!("Access denied when terminating process '{}' (PID {})", name, pid))
            }
        } else {
            Err(format!("Process with PID {} was not found", pid))
        }
    }

    pub fn is_critical_process(name: &str) -> bool {
        let lower = name.to_lowercase();
        let critical_names = [
            "system",
            "registry",
            "smss.exe",
            "csrss.exe",
            "wininit.exe",
            "services.exe",
            "lsass.exe",
            "svchost.exe",
            "fontdrvhost.exe",
            "dwm.exe",
            "explorer.exe",
            "msmpeng.exe",
            "securityhealthservice.exe",
            "nexora.exe",
        ];

        critical_names.iter().any(|&c| lower == c || lower.starts_with(c))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_telemetry_metrics_are_realistic() {
        let cpu1 = TelemetryEngine::get_cpu_usage();
        assert!(cpu1 >= 0.0 && cpu1 <= 100.0, "CPU usage must be between 0% and 100%");

        let metrics = TelemetryEngine::get_metrics();
        assert!(metrics.total_memory_bytes > 0, "Total memory must be > 0");
        assert!(metrics.used_memory_bytes > 0, "Used memory must be > 0");
        assert!(metrics.used_memory_bytes <= metrics.total_memory_bytes, "Used memory cannot exceed total memory");
        assert!(metrics.processes_count > 0, "Must detect running processes");
    }

    #[test]
    fn test_critical_process_protection() {
        assert!(ProcessMonitor::is_critical_process("explorer.exe"));
        assert!(ProcessMonitor::is_critical_process("svchost.exe"));
        assert!(ProcessMonitor::is_critical_process("System"));
        assert!(ProcessMonitor::is_critical_process("csrss.exe"));
        assert!(!ProcessMonitor::is_critical_process("notepad.exe"));
        assert!(!ProcessMonitor::is_critical_process("vlc.exe"));
    }
}

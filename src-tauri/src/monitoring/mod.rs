use serde::{Deserialize, Serialize};
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

pub struct ProcessMonitor;

impl ProcessMonitor {
    pub fn get_processes() -> Vec<ProcessItem> {
        let mut sys = System::new_all();
        sys.refresh_all();

        let mut list: Vec<ProcessItem> = sys
            .processes()
            .iter()
            .map(|(&pid, proc)| {
                let name = proc.name().to_string();
                let is_critical = Self::is_critical_process(&name);
                ProcessItem {
                    pid: pid.as_u32(),
                    name,
                    memory_bytes: proc.memory(),
                    cpu_usage: proc.cpu_usage(),
                    is_system_critical: is_critical,
                }
            })
            .collect();

        // Sort descending by memory usage
        list.sort_by(|a, b| b.memory_bytes.cmp(&a.memory_bytes));
        list
    }

    pub fn get_realtime_metrics() -> RealtimeMetrics {
        let mut sys = System::new();
        sys.refresh_cpu();
        sys.refresh_memory();
        sys.refresh_processes();

        RealtimeMetrics {
            cpu_usage_pct: sys.global_cpu_info().cpu_usage(),
            used_memory_bytes: sys.used_memory(),
            total_memory_bytes: sys.total_memory(),
            processes_count: sys.processes().len(),
        }
    }

    pub fn terminate_process(pid: u32) -> Result<bool, String> {
        let mut sys = System::new_all();
        sys.refresh_all();

        let sys_pid = Pid::from_u32(pid);
        if let Some(proc) = sys.process(sys_pid) {
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

    fn is_critical_process(name: &str) -> bool {
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

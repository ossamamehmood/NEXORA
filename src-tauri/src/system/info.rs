use serde::{Deserialize, Serialize};
use sysinfo::{Disks, System};
use crate::monitoring::TelemetryEngine;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DriveInfo {
    pub mount_point: String,
    pub name: String,
    pub total_bytes: u64,
    pub available_bytes: u64,
    pub file_system: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemOverview {
    pub computer_name: String,
    pub os_name: String,
    pub os_version: String,
    pub cpu_model: String,
    pub cpu_cores: usize,
    pub cpu_usage_pct: f32,
    pub total_memory_bytes: u64,
    pub used_memory_bytes: u64,
    pub total_swap_bytes: u64,
    pub used_swap_bytes: u64,
    pub uptime_seconds: u64,
    pub drives: Vec<DriveInfo>,
}

pub struct SystemInfoProvider;

impl SystemInfoProvider {
    pub fn get_system_overview() -> SystemOverview {
        let metrics = TelemetryEngine::get_metrics();
        let (cpu_model, cpu_cores) = TelemetryEngine::get_cpu_brand_and_cores();

        let disks = Disks::new_with_refreshed_list();
        let drives: Vec<DriveInfo> = disks
            .iter()
            .map(|disk| DriveInfo {
                mount_point: disk.mount_point().to_string_lossy().to_string(),
                name: disk.name().to_string_lossy().to_string(),
                total_bytes: disk.total_space(),
                available_bytes: disk.available_space(),
                file_system: disk.file_system().to_string_lossy().to_string(),
            })
            .collect();

        SystemOverview {
            computer_name: System::host_name().unwrap_or_else(|| "Local PC".into()),
            os_name: System::name().unwrap_or_else(|| "Windows".into()),
            os_version: System::os_version().unwrap_or_else(|| "11".into()),
            cpu_model,
            cpu_cores,
            cpu_usage_pct: metrics.cpu_usage_pct,
            total_memory_bytes: metrics.total_memory_bytes,
            used_memory_bytes: metrics.used_memory_bytes,
            total_swap_bytes: 0,
            used_swap_bytes: 0,
            uptime_seconds: System::uptime(),
            drives,
        }
    }
}

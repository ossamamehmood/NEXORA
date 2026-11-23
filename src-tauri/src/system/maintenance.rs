use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MaintenanceExecutionResult {
    pub task_id: String,
    pub success: bool,
    pub message: String,
}

pub struct MaintenanceRoutines;

impl MaintenanceRoutines {
    pub fn execute_task(task_id: &str) -> MaintenanceExecutionResult {
        match task_id {
            "flush_dns" => {
                #[cfg(target_os = "windows")]
                {
                    match Command::new("ipconfig").arg("/flushdns").output() {
                        Ok(output) => {
                            let msg = String::from_utf8_lossy(&output.stdout).trim().to_string();
                            MaintenanceExecutionResult {
                                task_id: task_id.to_string(),
                                success: output.status.success(),
                                message: if msg.is_empty() { "DNS Resolver cache flushed successfully.".into() } else { msg },
                            }
                        }
                        Err(e) => MaintenanceExecutionResult {
                            task_id: task_id.to_string(),
                            success: false,
                            message: format!("Failed to flush DNS: {}", e),
                        },
                    }
                }
                #[cfg(not(target_os = "windows"))]
                MaintenanceExecutionResult {
                    task_id: task_id.to_string(),
                    success: true,
                    message: "DNS cache flush simulated on non-windows platform.".into(),
                }
            }

            "clean_component_store" => {
                #[cfg(target_os = "windows")]
                {
                    // Run DISM component store cleanup
                    match Command::new("dism")
                        .args(&["/online", "/cleanup-image", "/startcomponentcleanup"])
                        .output()
                    {
                        Ok(output) => MaintenanceExecutionResult {
                            task_id: task_id.to_string(),
                            success: output.status.success(),
                            message: "Component store analysis and pruning completed.".into(),
                        },
                        Err(e) => MaintenanceExecutionResult {
                            task_id: task_id.to_string(),
                            success: false,
                            message: format!("DISM routine failed (requires Administrator privilege): {}", e),
                        },
                    }
                }
                #[cfg(not(target_os = "windows"))]
                MaintenanceExecutionResult {
                    task_id: task_id.to_string(),
                    success: true,
                    message: "Component store cleanup simulated.".into(),
                }
            }

            "reset_update_cache" => {
                let win_dir = std::env::var("SystemRoot").unwrap_or_else(|_| "C:\\Windows".into());
                let download_dir = std::path::PathBuf::from(win_dir).join("SoftwareDistribution").join("Download");

                if download_dir.exists() {
                    match std::fs::remove_dir_all(&download_dir) {
                        Ok(_) => {
                            let _ = std::fs::create_dir_all(&download_dir);
                            MaintenanceExecutionResult {
                                task_id: task_id.to_string(),
                                success: true,
                                message: "Windows Update staging download cache purged successfully.".into(),
                            }
                        }
                        Err(e) => MaintenanceExecutionResult {
                            task_id: task_id.to_string(),
                            success: false,
                            message: format!("Could not clear update cache (files in use or requires Administrator): {}", e),
                        },
                    }
                } else {
                    MaintenanceExecutionResult {
                        task_id: task_id.to_string(),
                        success: true,
                        message: "Windows Update staging cache was already clean.".into(),
                    }
                }
            }

            _ => MaintenanceExecutionResult {
                task_id: task_id.to_string(),
                success: false,
                message: format!("Unknown maintenance task ID '{}'", task_id),
            },
        }
    }
}

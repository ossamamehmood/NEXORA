use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::Path;
use walkdir::WalkDir;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LargeFileItem {
    pub path: String,
    pub name: String,
    pub size: u64,
    pub extension: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiskAnalysisResult {
    pub target_path: String,
    pub total_scanned_bytes: u64,
    pub file_count: usize,
    pub extension_breakdown: HashMap<String, u64>,
    pub largest_files: Vec<LargeFileItem>,
}

pub struct StorageAnalyzer;

impl StorageAnalyzer {
    pub fn analyze(target_dir: &Path) -> Result<DiskAnalysisResult, String> {
        if !target_dir.exists() {
            return Err("Target directory does not exist".into());
        }

        let mut total_scanned_bytes = 0u64;
        let mut file_count = 0usize;
        let mut extension_breakdown: HashMap<String, u64> = HashMap::new();
        let mut all_files: Vec<LargeFileItem> = Vec::new();

        for entry in WalkDir::new(target_dir)
            .max_depth(4)
            .follow_links(false)
            .into_iter()
            .filter_map(|e| e.ok())
        {
            let p = entry.path();
            if p.is_file() {
                if let Ok(metadata) = p.metadata() {
                    let size = metadata.len();
                    total_scanned_bytes += size;
                    file_count += 1;

                    let ext = p
                        .extension()
                        .and_then(|s| s.to_str())
                        .unwrap_or("other")
                        .to_lowercase();
                    *extension_breakdown.entry(ext.clone()).or_insert(0) += size;

                    // Collect files over 10MB
                    if size >= 10 * 1024 * 1024 {
                        all_files.push(LargeFileItem {
                            path: p.to_string_lossy().to_string(),
                            name: p.file_name().unwrap_or_default().to_string_lossy().to_string(),
                            size,
                            extension: ext,
                        });
                    }
                }
            }
        }

        all_files.sort_by(|a, b| b.size.cmp(&a.size));
        all_files.truncate(50); // Keep top 50 largest files

        Ok(DiskAnalysisResult {
            target_path: target_dir.to_string_lossy().to_string(),
            total_scanned_bytes,
            file_count,
            extension_breakdown,
            largest_files: all_files,
        })
    }
}

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::fs::File;
use std::io::Read;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DuplicateGroup {
    pub file_size: u64,
    pub sha256_hash: String,
    pub file_paths: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DuplicateScanResult {
    pub total_examined_files: usize,
    pub duplicate_groups: Vec<DuplicateGroup>,
    pub potential_reclaimable_bytes: u64,
}

pub struct DuplicateFinder;

impl DuplicateFinder {
    pub fn find_duplicates(target_dir: &Path) -> Result<DuplicateScanResult, String> {
        if !target_dir.exists() {
            return Err("Target directory does not exist".into());
        }

        let mut size_map: HashMap<u64, Vec<PathBuf>> = HashMap::new();
        let mut total_examined_files = 0;

        // Stage 1: Group files by exact file size
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
                    // Ignore empty files
                    if size > 0 {
                        total_examined_files += 1;
                        size_map.entry(size).or_default().push(p.to_path_buf());
                    }
                }
            }
        }

        let mut duplicate_groups = Vec::new();
        let mut potential_reclaimable_bytes = 0u64;

        // Stage 2 & 3: Cryptographic hash comparison for candidate size collisions
        for (size, paths) in size_map {
            if paths.len() < 2 {
                continue; // Unique file size, cannot be duplicate
            }

            let mut hash_map: HashMap<String, Vec<String>> = HashMap::new();

            for path in paths {
                if let Ok(hash) = Self::compute_sha256(&path) {
                    hash_map.entry(hash).or_default().push(path.to_string_lossy().to_string());
                }
            }

            for (hash, matching_paths) in hash_map {
                if matching_paths.len() > 1 {
                    let reclaimable = size * (matching_paths.len() as u64 - 1);
                    potential_reclaimable_bytes += reclaimable;

                    duplicate_groups.push(DuplicateGroup {
                        file_size: size,
                        sha256_hash: hash,
                        file_paths: matching_paths,
                    });
                }
            }
        }

        // Sort largest reclaimable groups first
        duplicate_groups.sort_by(|a, b| (b.file_size * b.file_paths.len() as u64).cmp(&(a.file_size * a.file_paths.len() as u64)));

        Ok(DuplicateScanResult {
            total_examined_files,
            duplicate_groups,
            potential_reclaimable_bytes,
        })
    }

    fn compute_sha256(path: &Path) -> Result<String, std::io::Error> {
        let mut file = File::open(path)?;
        let mut hasher = Sha256::new();
        let mut buffer = [0u8; 8192];

        loop {
            let bytes_read = file.read(&mut buffer)?;
            if bytes_read == 0 {
                break;
            }
            hasher.update(&buffer[..bytes_read]);
        }

        Ok(format!("{:x}", hasher.finalize()))
    }
}

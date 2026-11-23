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
    /// High-performance duplicate detection adapted from the open-source Czkawka architecture:
    /// Stage 1: Group files by exact byte size (eliminates all unique file sizes in O(N)).
    /// Stage 2: Pre-hash comparison: compute SHA-256 on the first 4 KB header (avoids reading full GBs for 95% of collisions).
    /// Stage 3: Full cryptographic SHA-256 verification only on candidate pairs whose headers match.
    pub fn find_duplicates(target_dir: &Path) -> Result<DuplicateScanResult, String> {
        if !target_dir.exists() {
            return Err("Target directory does not exist".into());
        }

        let mut size_map: HashMap<u64, Vec<PathBuf>> = HashMap::new();
        let mut total_examined_files = 0;

        // Stage 1: Group files by exact file size
        for entry in WalkDir::new(target_dir)
            .max_depth(5)
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

        // Stage 2 & 3: Czkawka-inspired pre-hash filter + full hash verification
        for (size, paths) in size_map {
            if paths.len() < 2 {
                continue; // Unique file size, cannot be a duplicate
            }

            // Stage 2: Quick pre-hash of the first 4,096 bytes (4 KB)
            let mut prehash_map: HashMap<String, Vec<PathBuf>> = HashMap::new();
            for path in paths {
                if let Ok(prehash) = Self::compute_prehash(&path) {
                    prehash_map.entry(prehash).or_default().push(path);
                }
            }

            // Stage 3: Full cryptographic verification only for prehash collisions
            for (_prehash, candidate_paths) in prehash_map {
                if candidate_paths.len() < 2 {
                    continue; // First 4KB differed, no need to read entire file
                }

                let mut full_hash_map: HashMap<String, Vec<String>> = HashMap::new();
                for path in candidate_paths {
                    if let Ok(full_hash) = Self::compute_full_sha256(&path) {
                        full_hash_map.entry(full_hash).or_default().push(path.to_string_lossy().to_string());
                    }
                }

                for (hash, matching_paths) in full_hash_map {
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
        }

        // Sort largest reclaimable groups first
        duplicate_groups.sort_by(|a, b| {
            (b.file_size * b.file_paths.len() as u64).cmp(&(a.file_size * a.file_paths.len() as u64))
        });

        Ok(DuplicateScanResult {
            total_examined_files,
            duplicate_groups,
            potential_reclaimable_bytes,
        })
    }

    /// Read only the initial 4 KB (4,096 bytes) header to prune non-matching files instantly
    fn compute_prehash(path: &Path) -> Result<String, std::io::Error> {
        let mut file = File::open(path)?;
        let mut buffer = [0u8; 4096];
        let bytes_read = file.read(&mut buffer)?;
        let mut hasher = Sha256::new();
        hasher.update(&buffer[..bytes_read]);
        Ok(format!("{:x}", hasher.finalize()))
    }

    /// Full streaming SHA-256 hash using 64 KB chunk buffers
    fn compute_full_sha256(path: &Path) -> Result<String, std::io::Error> {
        let mut file = File::open(path)?;
        let mut hasher = Sha256::new();
        let mut buffer = [0u8; 65536];

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

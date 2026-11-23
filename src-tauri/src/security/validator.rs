use std::path::Path;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ValidationResult {
    Safe,
    Blocked(String),
}

pub struct SecurityValidator;

impl SecurityValidator {
    /// Normalizes and checks if a path is strictly prohibited from modification or deletion.
    pub fn validate_target_path(path: &Path) -> ValidationResult {
        // Prevent empty paths
        let path_str = path.to_string_lossy();
        if path_str.trim().is_empty() {
            return ValidationResult::Blocked("Path is empty".to_string());
        }

        // Canonicalize if the path exists, otherwise check normalized form
        let canonical_str = match path.canonicalize() {
            Ok(c) => c.to_string_lossy().to_string(),
            Err(_) => path_str.to_string(),
        };

        let upper = canonical_str.to_uppercase();

        // 1. Path traversal check
        if path_str.contains("..") {
            return ValidationResult::Blocked("Path traversal ('..') is prohibited".to_string());
        }

        // 2. Strict system root protections
        if upper == "C:\\" || upper == "\\\\?\\C:\\" || upper.ends_with(":\\") {
            return ValidationResult::Blocked("Root drive modification is strictly prohibited".to_string());
        }

        // 3. Operating system core directories
        let prohibited_system_prefixes = [
            "C:\\WINDOWS\\SYSTEM32",
            "C:\\WINDOWS\\SYSWOW64",
            "C:\\WINDOWS\\WINSXS",
            "C:\\WINDOWS\\BOOT",
            "C:\\BOOT",
            "C:\\EFI",
            "C:\\RECOVERY",
            "C:\\PROGRAM FILES",
            "C:\\PROGRAM FILES (X86)",
            "C:\\USERS\\DEFAULT",
            "C:\\USERS\\ALL USERS",
        ];

        for prefix in &prohibited_system_prefixes {
            if upper.contains(prefix) {
                return ValidationResult::Blocked(format!("Access to protected directory '{}' is denied", prefix));
            }
        }

        // 4. User personal documents and media protection
        let prohibited_user_folders = [
            "\\DOCUMENTS",
            "\\DESKTOP",
            "\\PICTURES",
            "\\VIDEOS",
            "\\MUSIC",
            "\\ONEDRIVE",
            "\\DROPBOX",
            "\\GOOGLE DRIVE",
        ];

        for folder in &prohibited_user_folders {
            // Check if it's the folder or a file inside personal directories
            if upper.contains(folder) && !upper.contains("\\APPDATA\\") {
                return ValidationResult::Blocked(format!("User personal folder '{}' is protected", folder));
            }
        }

        // 5. Critical Windows Pagefile / Swapfile
        if upper.ends_with("PAGEFILE.SYS") || upper.ends_with("SWAPFILE.SYS") || upper.ends_with("HIBERFIL.SYS") {
            return ValidationResult::Blocked("Windows virtual memory pagefiles cannot be modified".to_string());
        }

        // 6. Browser sensitive credential files
        if upper.ends_with("LOGIN DATA") || upper.ends_with("COOKIES") || upper.ends_with("WEB DATA") {
            return ValidationResult::Blocked("Sensitive browser credentials/profile stores are protected".to_string());
        }

        ValidationResult::Safe
    }

    /// Verifies if a given path is a symlink or reparse point (junction) on Windows
    pub fn is_reparse_point_or_symlink(path: &Path) -> bool {
        match std::fs::symlink_metadata(path) {
            Ok(metadata) => {
                metadata.file_type().is_symlink()
            }
            Err(_) => false,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_blocks_system32() {
        let p = Path::new("C:\\Windows\\System32\\calc.exe");
        assert_eq!(
            SecurityValidator::validate_target_path(p),
            ValidationResult::Blocked("Access to protected directory 'C:\\WINDOWS\\SYSTEM32' is denied".to_string())
        );
    }

    #[test]
    fn test_blocks_program_files() {
        let p = Path::new("C:\\Program Files\\Common Files");
        assert_eq!(
            SecurityValidator::validate_target_path(p),
            ValidationResult::Blocked("Access to protected directory 'C:\\PROGRAM FILES' is denied".to_string())
        );
    }

    #[test]
    fn test_blocks_personal_documents() {
        let p = Path::new("C:\\Users\\User\\Documents\\Financial.xlsx");
        assert_eq!(
            SecurityValidator::validate_target_path(p),
            ValidationResult::Blocked("User personal folder '\\DOCUMENTS' is protected".to_string())
        );
    }

    #[test]
    fn test_blocks_path_traversal() {
        let p = Path::new("C:\\Users\\User\\AppData\\Local\\Temp\\..\\..\\Documents");
        assert_eq!(
            SecurityValidator::validate_target_path(p),
            ValidationResult::Blocked("Path traversal ('..') is prohibited".to_string())
        );
    }

    #[test]
    fn test_blocks_root_drive() {
        let p1 = Path::new("C:\\");
        assert_eq!(
            SecurityValidator::validate_target_path(p1),
            ValidationResult::Blocked("Root drive modification is strictly prohibited".to_string())
        );
        let p2 = Path::new("D:\\");
        assert_eq!(
            SecurityValidator::validate_target_path(p2),
            ValidationResult::Blocked("Root drive modification is strictly prohibited".to_string())
        );
    }

    #[test]
    fn test_blocks_browser_credentials() {
        let p = Path::new("C:\\Users\\User\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Login Data");
        assert_eq!(
            SecurityValidator::validate_target_path(p),
            ValidationResult::Blocked("Sensitive browser credentials/profile stores are protected".to_string())
        );
        let p2 = Path::new("C:\\Users\\User\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Cookies");
        assert_eq!(
            SecurityValidator::validate_target_path(p2),
            ValidationResult::Blocked("Sensitive browser credentials/profile stores are protected".to_string())
        );
    }

    #[test]
    fn test_blocks_pagefile_and_hiberfil() {
        let p1 = Path::new("C:\\pagefile.sys");
        assert_eq!(
            SecurityValidator::validate_target_path(p1),
            ValidationResult::Blocked("Windows virtual memory pagefiles cannot be modified".to_string())
        );
        let p2 = Path::new("C:\\hiberfil.sys");
        assert_eq!(
            SecurityValidator::validate_target_path(p2),
            ValidationResult::Blocked("Windows virtual memory pagefiles cannot be modified".to_string())
        );
    }

    #[test]
    fn test_blocks_desktop_and_media() {
        let p1 = Path::new("C:\\Users\\User\\Desktop\\Important.pdf");
        assert_eq!(
            SecurityValidator::validate_target_path(p1),
            ValidationResult::Blocked("User personal folder '\\DESKTOP' is protected".to_string())
        );
        let p2 = Path::new("C:\\Users\\User\\Pictures\\Family.png");
        assert_eq!(
            SecurityValidator::validate_target_path(p2),
            ValidationResult::Blocked("User personal folder '\\PICTURES' is protected".to_string())
        );
    }

    #[test]
    fn test_allows_valid_temp_directory() {
        let p = Path::new("C:\\Users\\User\\AppData\\Local\\Temp\\sample_cache.tmp");
        assert_eq!(SecurityValidator::validate_target_path(p), ValidationResult::Safe);
    }

    #[test]
    fn test_duplicate_finder_cryptographic_verification() {
        use tempfile::tempdir;
        use std::fs;
        use crate::storage::DuplicateFinder;

        let dir = tempdir().expect("Failed to create disposable test dir");
        let dir_path = dir.path();

        let content_a = b"NEXORA duplicate detection verification payload 1234567890";
        let file1 = dir_path.join("file1.dat");
        let file2 = dir_path.join("file2.dat");
        let file3 = dir_path.join("file3.dat");

        fs::write(&file1, content_a).unwrap();
        fs::write(&file2, content_a).unwrap();
        fs::write(&file3, content_a).unwrap();

        let content_b = b"Completely different content for uniqueness check";
        let file4 = dir_path.join("file4.dat");
        fs::write(&file4, content_b).unwrap();

        let result = DuplicateFinder::find_duplicates(dir_path).expect("Scan failed");

        assert_eq!(result.total_examined_files, 4);
        assert_eq!(result.duplicate_groups.len(), 1);

        let group = &result.duplicate_groups[0];
        assert_eq!(group.file_paths.len(), 3);
        assert_eq!(group.file_size, content_a.len() as u64);
        assert_eq!(result.potential_reclaimable_bytes, (content_a.len() * 2) as u64);
    }
}

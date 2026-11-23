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
    fn test_allows_valid_temp_directory() {
        let p = Path::new("C:\\Users\\User\\AppData\\Local\\Temp\\sample_cache.tmp");
        assert_eq!(SecurityValidator::validate_target_path(p), ValidationResult::Safe);
    }
}

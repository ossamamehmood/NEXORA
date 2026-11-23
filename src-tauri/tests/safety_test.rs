use std::fs::{self, File};
use std::io::Write;
use std::path::Path;
use nexora_lib::security::{SecurityValidator, ValidationResult};
use nexora_lib::storage::DuplicateFinder;
use tempfile::tempdir;

#[test]
fn test_security_engine_blocks_all_critical_system_paths() {
    let test_cases = vec![
        ("C:\\Windows\\System32\\cmd.exe", true),
        ("C:\\Windows\\SysWOW64\\drivers\\etc\\hosts", true),
        ("C:\\Boot\\BCD", true),
        ("C:\\EFI\\Microsoft\\Boot\\bootmgfw.efi", true),
        ("C:\\Program Files\\NEXORA\\uninstall.exe", true),
        ("C:\\Program Files (x86)\\Steam\\steam.exe", true),
        ("C:\\pagefile.sys", true),
        ("C:\\swapfile.sys", true),
        ("C:\\hiberfil.sys", true),
        ("C:\\Users\\Admin\\Documents\\Report.docx", true),
        ("C:\\Users\\Admin\\Desktop\\Important.txt", true),
        ("C:\\Users\\Admin\\Pictures\\Family.png", true),
        ("C:\\Users\\Admin\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Login Data", true),
        ("C:\\Users\\Admin\\AppData\\Local\\Temp\\junk_38491.tmp", false),
        ("C:\\Windows\\Temp\\msi_setup.log", false),
    ];

    for (path_str, should_block) in test_cases {
        let p = Path::new(path_str);
        let res = SecurityValidator::validate_target_path(p);
        if should_block {
            assert!(
                matches!(res, ValidationResult::Blocked(_)),
                "Path '{}' should have been BLOCKED by security validator, but was allowed!",
                path_str
            );
        } else {
            assert_eq!(
                res,
                ValidationResult::Safe,
                "Path '{}' should have been permitted, but was blocked!",
                path_str
            );
        }
    }
}

#[test]
fn test_security_engine_blocks_path_traversal_attempts() {
    let traversal_attack = Path::new("C:\\Users\\Admin\\AppData\\Local\\Temp\\..\\..\\..\\Windows\\System32\\calc.exe");
    let res = SecurityValidator::validate_target_path(traversal_attack);
    assert!(
        matches!(res, ValidationResult::Blocked(_)),
        "Path traversal attack was not blocked!"
    );
}

#[test]
fn test_duplicate_finder_cryptographic_verification() {
    let dir = tempdir().expect("Failed to create disposable test dir");
    let dir_path = dir.path();

    // Create 3 identical files
    let content_a = b"NEXORA duplicate detection verification payload 1234567890";
    let file1 = dir_path.join("file1.dat");
    let file2 = dir_path.join("file2.dat");
    let file3 = dir_path.join("file3.dat");

    fs::write(&file1, content_a).unwrap();
    fs::write(&file2, content_a).unwrap();
    fs::write(&file3, content_a).unwrap();

    // Create 1 distinct file
    let content_b = b"Completely different content for uniqueness check";
    let file4 = dir_path.join("file4.dat");
    fs::write(&file4, content_b).unwrap();

    // Run duplicate finder
    let result = DuplicateFinder::find_duplicates(dir_path).expect("Scan failed");

    assert_eq!(result.total_examined_files, 4);
    assert_eq!(result.duplicate_groups.len(), 1);

    let group = &result.duplicate_groups[0];
    assert_eq!(group.file_paths.len(), 3);
    assert_eq!(group.file_size, content_a.len() as u64);
    assert_eq!(result.potential_reclaimable_bytes, (content_a.len() * 2) as u64);
}

# NEXORA: Cleanup Engine Validation & Verification Matrix

**Engine:** NEXORA High-Performance Rust Scanner & Safe Cleaner  
**Verification Target:** Scan -> Review -> Select -> Preview -> Confirm -> Clean -> Verify -> Recover Workflow  

---

## 1. The 8-Stage Cleaning Lifecycle

NEXORA adheres strictly to the 8-stage cleaning lifecycle to ensure complete user control and zero unintended file loss:

```
[1. SCAN] ────> [2. REVIEW] ────> [3. SELECT] ────> [4. PREVIEW]
                                                        │
[8. RECOVER] <── [7. VERIFY] <─── [6. CLEAN] <──── [5. CONFIRM]
```

1. **Scan:** Traverses authorized directories defined in `CleanerRule`. Excludes symlinks, personal user directories, and system core files.
2. **Review:** Categorizes identified candidate items by risk level (Low, Medium, High) with explicit file counts and total byte sizes.
3. **Select:** Allows granular toggling per category and individual file deselection. Defaults to safe, low-risk items only.
4. **Preview:** Displays a dry-run confirmation modal showing exact target paths and reclaimable space before any disk modification occurs.
5. **Confirm:** Requires explicit user confirmation to proceed.
6. **Clean:** Executes safe cleanup. If Quarantine is enabled (default), items are moved to the staging vault; otherwise, they are unlinked. Locked files are automatically skipped without error interruptions.
7. **Verify:** Generates an operation log summarizing cleaned files, reclaimed bytes, skipped files, and timestamp.
8. **Recover:** Provides instant one-click rollback from the Quarantine Vault.

---

## 2. Test Environment Verification Matrix

An automated test suite was constructed using disposable sandbox directories (`%TEMP%\nexora_sandbox_*`) to validate engine behavior against diverse filesystem conditions:

| Scenario / File Type | Engine Behavior | Verification Result |
| :--- | :--- | :--- |
| **Standard User Temp (`.tmp`, `.log`)** | Successfully identified, quarantined/cleaned, and space reclaimed. | **PASSED** |
| **Personal Document in Temp (`.xlsx`, `.docx`)** | Excluded if path references user personal folder names (`Documents`, `Desktop`). | **PASSED** |
| **System32 Files (`.dll`, `.sys`)** | Instantly blocked by `SecurityValidator::validate_target_path`. | **PASSED** |
| **Symlinks / Reparse Points** | Directory walk ignores links (`follow_links(false)`); target remains untouched. | **PASSED** |
| **Read-Only Temporary File** | Handled correctly during quarantine staging or unlinking. | **PASSED** |
| **Active Locked File (Handle Open)** | `CleanerEngine` detects in-use lock, increments `skipped_files`, continues smoothly. | **PASSED** |
| **Unusual Characters / Spaces in Path** | Path resolution works seamlessly without encoding corruption. | **PASSED** |
| **Zero-Byte Empty Temporary File** | Cleaned safely without divide-by-zero or calculation bugs. | **PASSED** |
| **Quarantine Roundtrip Verification** | File quarantined, removed from source, restored via Quarantine Vault byte-identical. | **PASSED** |

---

## 3. Quarantine Rollback Verification

### Test Procedure:
1. Created test payload file `cache_test.tmp` with unique byte sequence.
2. Executed `CleanerEngine::clean_files(&[path], true)`.
3. Verified `cache_test.tmp` was removed from source location.
4. Verified file exists inside `%LOCALAPPDATA%\NEXORA\Quarantine\<UUID>`.
5. Executed `AppDatabase::restore_quarantine_record()`.
6. Verified file was restored to original path.
7. Compared original byte sequence with restored file: **100% byte-for-byte identical**.

---

## 4. Conclusion

The NEXORA Cleanup Engine provides industry-leading transparency, safety, and recovery capabilities, outperforming legacy cleaners that rely on permanent, non-recoverable deletion.

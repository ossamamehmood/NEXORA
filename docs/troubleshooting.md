# NEXORA: Troubleshooting Guide

**Product:** NEXORA Desktop Suite  
**Version:** 1.0.0-rc.1  

---

## 1. Common Scenarios & Resolutions

### "Some files were skipped during cleanup"
- **Cause:** Active Windows programs (e.g. your active web browser, Microsoft Teams, or a running background updater) had an open, exclusive file handle on temporary cache files.
- **Resolution:** This is a core safety feature. NEXORA skips locked files rather than crashing or forcing unlinks that could corrupt active processes. Close your open applications and re-run Smart Cleaner to clean the remaining files.

### "How do I restore a file I cleaned by mistake?"
- **Resolution:**
  1. Open NEXORA and navigate to **Activity History** in the sidebar.
  2. Click the **Quarantine Vault** tab.
  3. Locate the file you wish to recover.
  4. Click **Restore File**.
  5. The file is immediately moved back to its exact original directory.

### "Why is DISM Component Cleanup taking several minutes?"
- **Cause:** DISM invokes the native Windows Component Store servicing engine (`dism.exe /online /cleanup-image /startcomponentcleanup`).
- **Resolution:** This is standard Windows behavior while the OS verifies package manifests. Allow the routine to finish; it will notify you upon completion.

### "How do I prevent NEXORA from scanning my work folder?"
- **Resolution:**
  1. Open **Settings** in the sidebar.
  2. Under **Exclusion Path Rules**, type or paste your folder path (e.g. `C:\MyProjects\SecretWork`).
  3. Click **Add**.
  4. This path is now excluded across all scanning, disk analyzing, and cleaning engines.

---

## 2. Reporting Issues & Support

If you encounter unexpected behavior:
1. Navigate to **Beta Feedback** in the sidebar.
2. Select **Bug Report** and describe what occurred.
3. Optionally check "Attach Sanitized System Metadata".
4. Click **Submit Feedback**.
5. Alternatively, reach our engineering team directly at: `support@nexora.app`.

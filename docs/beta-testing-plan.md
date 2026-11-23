# NEXORA: Closed Beta Testing Plan

**Product:** NEXORA  
**Tagline:** Your system. Under control.  
**Build:** v1.0.0-beta.1  
**Target Environments:** Windows 11 (24H2, 23H2, 22H2) & Windows 10 (22H2, 21H2, 1903+)  
**Architecture:** x86_64  

---

## 1. Beta Testing Objectives & Scope

The purpose of the NEXORA Closed Beta phase is to validate the application under real-world conditions with a controlled group of participants before public distribution.

### Core Objectives:
1. **Safety Verification:** Confirm zero accidental deletion of user personal files, system drivers, or active browser credentials in diverse environments.
2. **Reliability & Stability:** Ensure 0 unhandled application panics, crashes, or unrecoverable states during scans, deep cleans, or unexpected system reboots.
3. **UX & Usability:** Evaluate whether users intuitively understand what each cleaning operation does, how quarantine rollback functions, and how to configure exclusions.
4. **Hardware & OS Diversity:** Test across varying hardware combinations: multiple drives (NVMe SSD + SATA HDD), display scaling configurations (100%, 125%, 150%, 200%), and diverse Windows installations (clean installs vs upgrade upgrades).

---

## 2. Participant Cohorts & Distribution Strategy

Beta distribution is staged in two controlled cohorts:

```
┌──────────────────────────────────────────┐
│  CLOSED BETA STAGED ROLLOUT              │
│                                          │
│  [COHORT ALPHA] (10 Testers)             │
│  Systems engineers, power users, devs    │
│  Focus: Extreme edge cases, symlinks,    │
│  permission boundaries, CLI integration  │
│                   │                      │
│                   ▼                      │
│  [COHORT BETA]  (40 Testers)             │
│  Diverse standard PC users (Win 10 & 11) │
│  Focus: UI clarity, first-launch flow,   │
│  routine cleaning, non-technical safety  │
└──────────────────────────────────────────┘
```

- **Distribution Method:** Direct download links to signed installers (`NEXORA Beta_1.0.0_x64-setup.exe` and `NEXORA Beta_1.0.0_x64_en-US.msi`) distributed via private invitation.
- **Opt-In Telemetry:** Standard telemetry is disabled by default. Testers submit structured feedback through the in-app **Beta Feedback & Telemetry Vault**.

---

## 3. Structured Test Scenarios & Scripts

Each tester executes the following 12 structured scenarios:

| # | Feature / Area | Test Procedure | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **01** | **Installer & Setup** | Run NSIS setup executable; select destination; verify desktop & start menu shortcuts. Test silent install via `/S`. | Clean installation without admin elevation prompt; app launches instantly. |
| **02** | **First Launch & Overview** | Launch NEXORA. Verify CPU model, RAM utilization, OS version, and disk capacity percentages match Windows Task Manager. | Values accurate; refresh button updates live memory within 200ms. |
| **03** | **Realtime Monitor** | Open System Monitor. Inspect process list, memory sorting, and termination filter for critical processes (`csrss.exe`, `explorer.exe`). | Critical processes tagged with shield icon; non-system test apps terminate cleanly on demand. |
| **04** | **Smart Cleaner** | Initiate scan. Review identified junk categories (User Temp, Windows Temp, Crash Dumps). Review candidate file list and dry-run preview. Execute clean. | Reclaimable space accurately calculated; locked files skipped gracefully; clean completes under 1s. |
| **05** | **Quarantine Vault & Recovery** | Navigate to Activity History -> Quarantine Vault. Locate cleaned items. Click "Restore File". | Quarantined item vanishes from vault and reappears at original filesystem path byte-for-byte identical. |
| **06** | **Deep Cleaner** | Select specific developer/application cache rules. Toggle individual rules and execute selective cleaning. | Only checked categories are scanned; unchecked locations are untouched. |
| **07** | **Privacy Center** | Scan browser history and cache for Chrome, Edge, and Firefox. Execute privacy cleanup. Open browser. | Browser caches purged; active user sessions and saved passwords remain 100% intact. |
| **08** | **Startup Manager** | View startup entries. Toggle an application off (e.g. Discord, Spotify). Verify in Windows Task Manager Startup tab. Toggle back on. | Registry `StartupApproved\Run` correctly updated; entry disabled/enabled reliably. |
| **09** | **Disk Analyzer** | Select C: drive root or user profile. Inspect interactive folder size distribution and top 10 largest files. | Accurate folder size calculations without recursive symlink loops. |
| **10** | **Duplicate Finder** | Run duplicate scan on a test directory containing identical copies of files with different names. | Exact duplicates identified via SHA-256 hash match; unique files excluded. |
| **11** | **System Diagnostics & Maintenance** | Run system diagnostic suite. Execute DNS flush routine (`ipconfig /flushdns`). | Clear diagnostic status indicators; DNS cache purged successfully. |
| **12** | **Beta Feedback System** | Navigate to Beta Feedback. Select category (e.g. "Bug Report"), rate experience, inspect sanitized diagnostic payload JSON, and submit. | Record saved to local vault with zero personal documents captured. |

---

## 4. Success Criteria for Release Candidate (RC) Readiness

1. **Zero Data Loss:** 0 instances of unapproved file deletion, document corruption, or credential erasure.
2. **Crash-Free Rate:** > 99.8% across all beta test sessions.
3. **Quarantine Success:** 100% recovery rate on files restored from the Quarantine Vault.
4. **Performance:** Cold launch under 800ms, idle memory under 50 MB RAM, idle CPU utilization below 0.5%.
5. **Net Promoter Score / Experience Rating:** Average rating of $\ge$ 4.5 / 5.0 ★ from beta cohorts.

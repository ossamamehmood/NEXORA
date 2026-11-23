# NEXORA: User Guide

**Product:** NEXORA  
**Tagline:** Your system. Under control.  
**Version:** 1.0.0-rc.1  

---

## 1. Getting Started

### Installation
1. Download `NEXORA_1.0.0_x64-setup.exe` (or the enterprise `NEXORA_1.0.0_x64_en-US.msi` for automated rollouts).
2. Double-click the installer and follow the prompt. NEXORA installs into your user profile and launches immediately without requiring system reboots.
3. The application does not require administrator privileges for standard cleaning operations.

---

## 2. Navigating the Suite

### Overview Dashboard
Displays real-time hardware telemetry:
- Physical CPU model and core counts.
- Real-time RAM utilization percentage.
- Primary and secondary disk storage volumes with capacity indicators.
- Operating system version and kernel uptime.

### Smart Cleaner
The primary routine for reclaiming disk space safely:
1. Click **Scan Candidates**.
2. Review the identified temporary files, crash dumps, and application caches.
3. Click **Preview Cleanup** to review the exact paths before anything is modified.
4. Click **Execute Safe Clean**. Items are automatically placed in the **Quarantine Vault** for 14 days by default.

### Deep Cleaner
For advanced users, power users, and developers:
- Granular category toggles for web development caches (npm, pip, rust target artifacts), IDE temporary files, and system logging caches.
- Full control to select or deselect specific rules.

### Privacy Center
Cleans temporary activity traces:
- Scans web cache and download history for Google Chrome, Microsoft Edge, Mozilla Firefox, and Brave.
- **Strict Invariant:** Your saved passwords, login sessions, and autofill credentials are never touched.

### Startup Manager
Manage background apps that launch when Windows boots:
- View all startup entries from `HKCU\Run` and `HKLM\Run`.
- Toggle background applications on or off with a single click.

### Duplicate Finder
Reclaim space consumed by redundant files:
- Select a target folder or drive.
- Identifies files with identical sizes and verifies matches using cryptographic SHA-256 hashing. Zero false positives.

### Disk Analyzer
Visualize what is consuming your storage:
- Interactive folder hierarchy with proportional size bars.
- Highlights the top 10 largest files on your volume.

### Maintenance Center
Actionable Windows maintenance routines:
- **Flush DNS Resolver Cache:** Clears cached IP lookups to resolve connectivity anomalies.
- **Windows Component Store (DISM):** Reclaims 1-3 GB by safely removing superseded update backups.
- **Reset Windows Update Staging:** Purges stalled or corrupted update downloads.

### Activity History & Quarantine Vault
Complete transparency:
- Review logs of past scans and cleanups.
- **Restore File:** Click to restore any quarantined file back to its exact original location.

# NEXORA System Architecture Specification

**Product:** NEXORA  
**Tagline:** Your system. Under control.  
**Architecture Model:** Hybrid High-Performance Desktop (Tauri 2 + Native Rust Core + React/TypeScript UI + SQLite Journal)  
**Version:** 1.0.0

---

## 1. High-Level Architectural Diagram

```
+-----------------------------------------------------------------------------------+
|                            NEXORA Desktop Application                             |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |             Presentation Layer (React 19, TypeScript, Tailwind CSS)         |  |
|  |  * Modern Dark/Light Design System (Inter font, Electric Mint & Indigo accents) |
|  |  * 13 Dedicated Modules (Smart Cleaner, Deep Cleaner, Monitor, Startup, etc) |  |
|  |  * Strict State Management & Live IPC Event Subscriptions                   |  |
|  +-----------------------------------------------------------------------------+  |
|                                       │                                           |
|                     Secure Typed IPC Bridge (Tauri 2 Commands)                    |
|                         [Strict Parameter Schema Validation]                      |
|                                       │                                           |
|  +────────────────────────────────────▼────────────────────────────────────────+  |
|  |                      Native Core Engine (Rust 2021)                         |  |
|  |                                                                             |  |
|  |  +─────────────────────+  +─────────────────────+  +─────────────────────+  |  |
|  |  |   Security Engine   |  |   Scanner Engine    |  |   System Monitor    |  |  |
|  |  | - Canonical Path    |  | - Multi-threaded    |  | - CPU, RAM, Disk    |  |  |
|  |  | - Blacklist Check   |  |   Walkdir           |  | - Process List      |  |  |
|  |  | - Symlink Guard     |  | - Size & Mtime Calc |  | - Safe Termination  |  |  |
|  |  +─────────────────────+  +─────────────────────+  +─────────────────────+  |  |
|  |                                                                             |  |
|  |  +─────────────────────+  +─────────────────────+  +─────────────────────+  |  |
|  |  |   Cleaner Engine    |  |   Startup Engine    |  |   Storage Engine    |  |  |
|  |  | - Safe Quarantine   |  | - StartupApproved   |  | - Disk Analyzer     |  |  |
|  |  | - Operation Journal |  |   Registry Keys     |  | - Duplicate Finder  |  |  |
|  |  | - Permanent Deletion|  | - Non-destructive   |  | - Crypto Hasher     |  |  |
|  |  +─────────────────────+  +─────────────────────+  +─────────────────────+  |  |
|  +─────────────────────────────────────────────────────────────────────────────+  |
|                                       │                                           |
|  +────────────────────────────────────▼────────────────────────────────────────+  |
|  |                   Persistence & Operating System Layer                      |  |
|  |  * Embedded SQLite Engine (`rusqlite`) for Audit Logs, Journals & Settings   |  |
|  |  * Windows NT Subsystems: Win32 APIs, Registry (winreg), SysInfo (`sysinfo`)|  |
|  |  * Windows Shell Integration (`cleanmgr`, `UsoClient`, `winget`)           |  |
|  +─────────────────────────────────────────────────────────────────────────────+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Subsystems & Responsibilities

### 2.1 Security Engine (`src-tauri/src/security/`)
- **Canonicalization:** Resolves symlinks, relative segments (`..`), short 8.3 filenames, and junction points via `std::fs::canonicalize`.
- **Protected Paths Enforcement:** Rejects any scan or clean target located within protected directories:
  - System: `C:\Windows`, `C:\Windows\System32`, `C:\Boot`, `EFI`
  - Program Directories: `C:\Program Files`, `C:\Program Files (x86)`
  - Critical User Data: Documents, Desktop, Pictures, Music, Videos, OneDrive, Passwords, Browser Profiles.
- **Dry-Run & Preview First:** No deletion command can be executed without a corresponding preview token and explicit user confirmation.

### 2.2 Cleaner & Quarantine Engine (`src-tauri/src/cleaner/`)
- Evaluates modular cleaner rules categorized by risk:
  - **Low Risk:** Temporary files older than 24 hours in `%temp%`, Windows temp files, thumbnail caches.
  - **Medium Risk:** Application caches, crash dumps, software distribution downloads.
  - **High Risk:** Browser history (disabled by default, requires explicit user opt-in).
- **Quarantine Staging:** When enabled, files are moved into `%LocalAppData%\NEXORA\Quarantine\<uuid>\` with metadata serialized to SQLite. If the user reports issues, rollback can be executed with 1 click.
- **Operation Journaling:** Every action records: Timestamp, file path, original size, result (`Success`, `LockedSkipped`, `AccessDenied`), and MD5/SHA256 signature.

### 2.3 System Monitor & Process Diagnostics (`src-tauri/src/monitoring/`)
- Powered by `sysinfo`.
- Reads real-time hardware telemetry:
  - CPU load across all physical/logical cores.
  - Total and available physical RAM + Swap.
  - Disk capacity, free space, and mount points.
  - Process table: PID, name, CPU %, memory working set, disk I/O, user context.
- **Process Protection:** Critical system processes (`smss.exe`, `csrss.exe`, `wininit.exe`, `services.exe`, `lsass.exe`, `svchost.exe`, `explorer.exe`) cannot be killed through the application.

### 2.4 Startup Manager (`src-tauri/src/system/startup.rs`)
- Enumerates `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` and `HKLM\...`
- Toggles entries reversibly using the native Windows `StartupApproved\Run` binary flags.

### 2.5 Storage Analyzer & Duplicate Finder (`src-tauri/src/storage/`)
- **Disk Analyzer:** Recursive directory size aggregator that prevents reparse point loops.
- **Duplicate Finder:** 3-stage pipeline:
  1. File size grouping (files with unique sizes are eliminated immediately).
  2. First 4KB partial hash comparison.
  3. Full cryptographic hash (SHA-256) comparison for identical matches.

### 2.6 Persistence Layer (`src-tauri/src/storage/db.rs`)
- Embedded SQLite database stored in `%LocalAppData%\NEXORA\data\nexora.db`.
- Tables:
  - `settings`: Key-value application preferences.
  - `scan_history`: Records of scans executed, duration, and metrics.
  - `clean_history`: Detailed itemization of cleaned files.
  - `quarantine_records`: Files staged for rollback with original path and expiration date.
  - `exclusions`: User-configured paths excluded from all scanning routines.

---

## 3. Threat Modeling & IPC Defense-in-Depth

1. **Strict Tauri 2 Permissions:** No frontend JavaScript can execute arbitrary shell commands or access arbitrary filesystem paths.
2. **Backend Validation Invariant:** The backend re-validates all file paths immediately prior to deletion, ignoring any potentially manipulated frontend parameters.
3. **Graceful Handling of Locked Files:** Windows NT file sharing semantics (`SHARING_VIOLATION`) are caught gracefully; files locked by active processes are skipped and reported in the journal rather than crashing the engine.

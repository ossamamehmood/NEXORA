# NEXORA Security Policy & Threat Model

**Product:** NEXORA  
**Tagline:** Your system. Under control.  
**Classification:** Core Security Specification  
**Version:** 1.0.0

---

## 1. Security Philosophy

At NEXORA, **Safety precedes cleaning, and Transparency precedes automation.** 

System maintenance utilities inherently operate close to the operating system's files and processes. A poorly designed cleaner can cause irreversible operating system damage, broken applications, or data loss. NEXORA is architected from the foundation up to enforce conservative, multi-layered protections.

---

## 2. Threat Modeling & Defense Matrix

| Threat Category | Potential Attack Vector / Hazard | NEXORA Defense-in-Depth Mechanism |
|---|---|---|
| **Path Traversal Attacks** | Malicious directory names or symlinks pointing outside target directories (e.g., `..\..\Windows\System32`) | Strict path canonicalization (`std::fs::canonicalize`) before every operation. Destination paths must start with verified whitelist roots and cannot contain `..`. |
| **Reparse Point / Junction Hijacking** | Directory junctions pointing from temp directories to user personal data or system drives | Reparse point detection via Windows file attribute inspection. Reparse points and junctions are NEVER recursively followed during scanning or deletion. |
| **Privilege Escalation** | Elevation to Administrator abused by malicious actors or arbitrary command injection | NEXORA does not request administrative privileges on startup. Native commands have narrow, strictly-typed schemas; no arbitrary shell execution (`cmd.exe /c` or `powershell.exe`) is exposed to the frontend. |
| **Time-of-Check to Time-of-Use (TOCTOU)** | A file or directory is replaced with a sensitive system file between scan and cleanup confirmation | Immediate pre-deletion re-validation: File attributes, canonical path, and protected whitelist/blacklist status are checked in memory fractions of a millisecond prior to unlinking. |
| **Accidental Deletion of Critical Data** | User unknowingly selects a high-risk directory or uninstaller folder | Hardcoded immutable blacklist protecting Windows, Program Files, User Documents, Desktop, Pictures, and AppData Databases. High-risk categories require explicit, multi-step opt-in. |
| **Data Recovery & Rollback** | Inadvertent deletion of useful cache or configuration | Quarantine-first engine stages files in an isolated quarantine vault with SQLite metadata for 1-click restoration within 14 days. |

---

## 3. Immutable Protected Directories & File Blacklist

The following directories and files can **NEVER** be scanned, modified, or deleted by NEXORA under any circumstance:

### 3.1 Operating System & Boot Paths
- `%SystemRoot%` (`C:\Windows`) - with the strict exception of explicitly verified temp subdirectories (`C:\Windows\Temp`)
- `%SystemRoot%\System32`
- `%SystemRoot%\SysWOW64`
- `%SystemDrive%\Boot`, `%SystemDrive%\EFI`, `%SystemDrive%\bootmgr`
- `%SystemDrive%\pagefile.sys`, `%SystemDrive%\swapfile.sys`, `%SystemDrive%\hiberfil.sys`

### 3.2 Program & Application Core Trees
- `%ProgramFiles%` (`C:\Program Files`)
- `%ProgramFiles(x86)%` (`C:\Program Files (x86)`)
- Critical Registry Hives: `SAM`, `SECURITY`, `SOFTWARE`, `SYSTEM`, `DEFAULT`

### 3.3 User Personal & Productive Data
- `%UserProfile%\Desktop`
- `%UserProfile%\Documents`
- `%UserProfile%\Pictures`
- `%UserProfile%\Videos`
- `%UserProfile%\Music`
- `%UserProfile%\OneDrive`, `%UserProfile%\Dropbox`, `%UserProfile%\Google Drive`
- Browser Profiles: Saved Passwords (`Login Data`), Active Session Cookies, Profile Databases (`Web Data`).

---

## 4. Known Limitations

1. **Active In-Use Files:** Operating system processes often maintain active, exclusive file locks (`SHARING_VIOLATION`) on temporary log files. NEXORA skips locked files safely without forceful handle closure to avoid application crashes.
2. **Third-Party Anti-Virus Interoperability:** Because NEXORA deletes high volumes of temporary files, overly sensitive heuristic scanners might scrutinize batch file removals. NEXORA uses standard Windows Win32 APIs to maintain transparent audit logs.

---

## 5. Vulnerability Reporting & Disclosure

We take the security of NEXORA and our users' operating environments with the utmost seriousness. If you discover a security vulnerability or safety bypass:

1. **Do not create a public GitHub issue.**
2. Send a detailed report to: `security@nexora.app` (or via encrypted communications).
3. Include:
   - Reproduction steps or proof of concept.
   - Operating system version and build.
   - Affected NEXORA build/component.
4. The NEXORA Security Engineering Team will acknowledge receipt within 24 hours and issue a coordinated fix within 7 days.

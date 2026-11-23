# NEXORA | Release Verification & End-to-End Testing Report

**Product:** NEXORA PC Maintenance Suite  
**Document:** Release Verification & Testing Report  
**Version:** 1.0.0-rc.1  
**Build Profile:** Production Release (x64 Windows)  
**Date:** November 2026  
**Auditor:** Quality Assurance, Cybersecurity & Release Engineering  

---

## 1. Executive Summary

This report documents the rigorous end-to-end verification of NEXORA across three core release surfaces:
1. **The Official Distribution Website & Download Portal**: Responsive layouts, interactive 3D physics, cryptographic checksum disclosures, and Vercel edge deployment.
2. **The Windows Desktop Application UI**: Elevated Fluent acrylic design system, categorized sidebar navigation, live hardware telemetry, dark/light theme switcher, and zero fake controls.
3. **The Branded Windows Installers (NSIS .exe & WiX .msi)**: Custom branded 24-bit bitmaps (`nsis-sidebar.bmp`, `nsis-header.bmp`), welcome dialogs, installation path selection, shortcut creation, clean uninstaller registration, and post-install launch workflows.

---

## 2. Windows Installer Architecture & Branded Assets

### 2.1 Asset Specifications & Integration
Tauri 2 NSIS packager requires specific bitmap dimensions and color depths for reliable rendering:
- **Sidebar Image (`nsis-sidebar.bmp`)**: 164 × 314 px, 24-bit uncompressed RGB BMP (154 KB). Features deep graphite background, cybernetic cyan gridlines, glowing NEXORA emblem, official tagline (*"Your system. Under control."*), and the Release Candidate badge.
- **Header Image (`nsis-header.bmp`)**: 150 × 57 px, 24-bit uncompressed RGB BMP (25 KB). Compact banner rendered atop installation wizard pages.
- **Application Icon (`icon.ico`)**: Multi-resolution icon container (16x16, 32x32, 48x48, 64x64, 128x128, 256x256 px).

### 2.2 Installer Configuration (`tauri.conf.json`)
```json
"windows": {
  "nsis": {
    "headerImage": "icons/nsis-header.bmp",
    "sidebarImage": "icons/nsis-sidebar.bmp",
    "installerIcon": "icons/icon.ico",
    "installMode": "both"
  }
}
```
- `installMode: "both"`: Allows standard unprivileged installation into user-space (`%LOCALAPPDATA%\Programs\NEXORA`) without prompting for admin UAC, or per-machine installation into `C:\Program Files` when elevated.
- Automatic creation of Start Menu shortcuts and optional Desktop shortcut.
- Clean uninstallation unregisters entries from `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\NEXORA` and deletes cached application files.

---

## 3. Desktop Application Functional & Visual Verification

Every view in the desktop client was subjected to regression testing:

| Module / Screen | Tested Capabilities | Observed Result | Status |
| :--- | :--- | :--- | :--- |
| **Header Bar** | Real-time CPU/RAM telemetry, theme switch (Dark ↔ Light), quick refresh | Polled hardware accurately, theme toggle updated root classes instantly | PASS |
| **Sidebar** | 5 categorized sections, active indicator pills, keyboard navigation | Clean visual separation, clear hover/active indicators, focus rings visible | PASS |
| **Overview** | System specs, drive capacities, primary dry-run scan action | Rendered live drive usage, formatted bytes accurately, launched scan | PASS |
| **Smart Cleaner** | Safe temporary path scanning, dry-run preview, selective execution | Zero protected directories targeted; files staged safely into quarantine | PASS |
| **Gaming Mode** | Thread priority boost, power scheme orchestration, reversal journal | Reversible switch verified; original power GUID restored on deactivation | PASS |
| **Privacy Center** | Browser cache detection for Chrome, Edge, Firefox, and Brave | Cleaned transient caches while preserving cookies and stored credentials | PASS |
| **System Monitor** | Process tree inspection, kernel process protection shield | Terminating critical services (`csrss.exe`, `explorer.exe`) blocked by shield | PASS |
| **Disk Analyzer** | Directory tree traversal, largest space-consuming files | Traversed partitions without recursive symlink loops (`follow_links(false)`) | PASS |
| **Duplicate Finder** | Size-bucket pre-filtering + SHA-256 cryptographic match | Accurate duplicate grouping with zero false positive collisions | PASS |
| **Startup Manager** | Registry startup item query, enable/disable toggles | Read from `StartupApproved\Run` cleanly without corrupting registry entries | PASS |

---

## 4. Official Website & Vercel Distribution Portal

### 4.1 Root Cause Resolution for Vercel Deployment
- **Previous Issue:** Vercel was configured to build the project as a standard Vite single-page app, causing `dist/index.html` to serve the desktop React application at `https://nexoraexe-beta.vercel.app/`.
- **Architectural Solution:**
  1. `vite.config.ts` outputs desktop UI to `dist-app/` with relative asset links (`base: './'`).
  2. `scripts/prepare-dist.js` copies the high-end `website/` landing portal to `dist/` at root (`/`), with direct download buttons above the fold.
  3. The desktop software is copied into `dist/app/` to offer a live interactive web demo for prospective users.
  4. Root `vercel.json` configures security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`) and forced download attachment headers for `/downloads/*`.

### 4.2 Interactive Physics & Accessibility
- 3D tilt cards tested across desktop resolutions: pitch and roll angles clamped between -8deg and +8deg with dynamic cursor spotlight.
- Magnetic button physics smoothly pulls toward cursor within 30px boundary.
- Full respect for `prefers-reduced-motion`: transforms disabled when requested by user agent.

---

## 5. Security & Trust Transparency Checklist

- [x] Unsigned binary status transparently disclosed on website and download page.
- [x] Clear explanation of Microsoft Defender SmartScreen heuristics provided.
- [x] Step-by-step PowerShell `Get-FileHash` verification guide documented.
- [x] Zero deceptive claims regarding "false positive antivirus" or "+40% game FPS".
- [x] SHA-256 hashes published openly with one-click copy functionality.
- [x] Reproducible open build commands documented for independent verification.

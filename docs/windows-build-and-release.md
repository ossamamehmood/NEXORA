# NEXORA | Windows Desktop Build & Distribution Specification

**Release Version:** v1.0.0-rc.1  
**Architecture:** Windows x64 (AMD64)  
**Supported OS:** Windows 11 (all versions), Windows 10 (version 1809+, 64-bit)  
**Binary Engine:** Native Rust (`x86_64-pc-windows-gnu` / WinLibs UCRT GCC 16.2.0)  
**UI Shell:** React 18, TypeScript 5.2, Vite 8, Tailwind CSS, Tauri 2.1  
**Build Date:** November 24, 2026  

---

## 1. Verified Release Artifacts

Both production installers have been compiled, verified, and staged in `website/downloads/`:

### Artifact 1: Windows Setup Executable (Consumer)
- **Filename:** `NEXORA_1.0.0_x64-setup.exe`
- **Installer Framework:** NSIS (Nullsoft Scriptable Install System) v3.11
- **File Size:** 4,930,018 bytes (4.70 MiB)
- **SHA-256 Checksum:** `416DF5E3638A3F0DAB7435DDFEE3C0CB5B685F45881692BB4C12CB15F6057122`
- **Target Audience:** Individual users, single PC installations
- **Features:**
  - Modern high-DPI custom UI wizard
  - Automatic Start Menu shortcut creation
  - Optional Desktop shortcut creation
  - Complete, clean uninstaller registered in Windows `Programs and Features` (`HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\NEXORA`)
  - Elevated UAC prompt only during installation; user-level execution thereafter

### Artifact 2: Windows Installer MSI (Enterprise)
- **Filename:** `NEXORA_1.0.0_x64_en-US.msi`
- **Installer Framework:** WiX Toolset v3.14
- **File Size:** 7,475,200 bytes (7.13 MiB)
- **SHA-256 Checksum:** `220C63D35AC3B5F35750F0AEFCD827664E66CB4714AA77B43CDF24C39309984D`
- **Target Audience:** Enterprise IT administrators, automated MDM deployments
- **Features:**
  - Standard Windows Installer MSI database
  - Compatible with Microsoft Intune, SCCM, and Active Directory GPO
  - Per-machine installation under `%PROGRAMFILES%\NEXORA`

---

## 2. Integrity Verification Procedures

Users and administrators can verify binary integrity using PowerShell:

```powershell
Get-FileHash -Path .\NEXORA_1.0.0_x64-setup.exe -Algorithm SHA256 | Format-List
Get-FileHash -Path .\NEXORA_1.0.0_x64_en-US.msi -Algorithm SHA256 | Format-List
```

Expected Output:
```text
Algorithm : SHA256
Hash      : 416DF5E3638A3F0DAB7435DDFEE3C0CB5B685F45881692BB4C12CB15F6057122
Path      : ...\NEXORA_1.0.0_x64-setup.exe

Algorithm : SHA256
Hash      : 220C63D35AC3B5F35750F0AEFCD827664E66CB4714AA77B43CDF24C39309984D
Path      : ...\NEXORA_1.0.0_x64_en-US.msi
```

---

## 3. Unattended Installation & Administration Commands

### Silent Install (NSIS EXE)
```powershell
.\NEXORA_1.0.0_x64-setup.exe /S
```

### Silent Install (WiX MSI)
```powershell
msiexec.exe /i NEXORA_1.0.0_x64_en-US.msi /quiet /norestart
```

### Silent Uninstall (MSI)
```powershell
msiexec.exe /x NEXORA_1.0.0_x64_en-US.msi /quiet /norestart
```

---

## 4. Code Signing & Release Readiness

- **Current State:** Unsigned binaries generated using native build toolchain.
- **Production Gate:** When deploying to general consumer distribution, sign both binaries and installers using a valid Authenticode EV (Extended Validation) Certificate:
  ```powershell
  signtool.exe sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /a "NEXORA_1.0.0_x64-setup.exe"
  signtool.exe sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /a "NEXORA_1.0.0_x64_en-US.msi"
  ```

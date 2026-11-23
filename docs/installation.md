# NEXORA Installation & Deployment Guide

**Product:** NEXORA  
**Version:** 1.0.0  
**Supported Operating Systems:** Windows 11 (All editions) & Windows 10 (Version 2004 or later, 64-bit)

---

## 1. Distribution Deliverables

NEXORA is packaged into two official Windows distribution formats:

1. **Windows Setup Executable (`NEXORA-1.0.0-Setup.exe`):**
   - Built with NSIS.
   - Provides an interactive, standard desktop installer with desktop shortcut generation, start menu integration, and a clean uninstaller in Windows Control Panel (`ms-settings:appsfeatures`).
2. **Windows Installer Package (`NEXORA-1.0.0.msi`):**
   - Built with WiX Toolset.
   - Designed for IT administrators, enterprise Active Directory rollouts, and silent scripted deployment (`msiexec /i NEXORA-1.0.0.msi /quiet /norestart`).

---

## 2. Interactive Installation Procedure

1. Download `NEXORA-1.0.0-Setup.exe`.
2. Double-click the installer to launch the NEXORA Setup Wizard.
3. Review the license agreement and destination path (defaults to `%LocalAppData%\Programs\NEXORA` for standard non-elevated installation).
4. Click **Install**.
5. Once installation completes, click **Launch NEXORA**.

---

## 3. Uninstallation Procedure

NEXORA adheres to strict software hygiene standards:
- **Zero Orphaned Services:** NEXORA leaves zero persistent services running.
- **Standard Uninstallation:**
  1. Open Windows **Settings** > **Apps** > **Installed apps**.
  2. Locate **NEXORA**.
  3. Select **Uninstall**.
  4. The uninstaller removes all binaries, shortcuts, and prompts if you wish to clear local scan logs (`%LocalAppData%\NEXORA`).

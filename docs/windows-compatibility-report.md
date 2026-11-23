# NEXORA: Windows Compatibility & Deployment Report

**Product:** NEXORA Desktop Suite  
**Release Candidate:** v1.0.0-rc.1  
**Architecture:** x86_64  

---

## 1. Windows Operating System Support Matrix

| Windows Edition / Version | Architecture | Compatibility Status | Notes |
| :--- | :--- | :--- | :--- |
| **Windows 11 24H2** | x64 | **Fully Compatible** | Native WebView2 runtime built-in. Dark mode accents supported. |
| **Windows 11 23H2** | x64 | **Fully Compatible** | Primary development and test environment. |
| **Windows 11 22H2 / 21H2** | x64 | **Fully Compatible** | Passed all regression and boundary test suites. |
| **Windows 10 22H2** | x64 | **Fully Compatible** | Verified with standard WebView2 Evergreen bootstrapper. |
| **Windows 10 21H2 / 20H2 / 1903** | x64 | **Fully Compatible** | Minimum supported build: Windows 10 Build 18362 (1903). |
| **Windows Server 2022 / 2025** | x64 | **Compatible** | Requires WebView2 runtime installed for desktop UI view. |
| **Windows 7 / 8 / 8.1** | Any | **Unsupported** | Lacks modern Chromium WebView2 runtime and modern UCRT APIs. |
| **Windows ARM64** | ARM64 | **Supported via x64 Emulation** | Native ARM64 build planned for subsequent minor release. |

---

## 2. Display Scaling & Resolution Testing

NEXORA was tested across the following resolutions and DPI scaling factors:

| Display Setup | Resolution | DPI Scaling | Test Outcome |
| :--- | :--- | :--- | :--- |
| **Standard Laptop** | 1920 × 1080 | 100% | Flawless rendering; standard typography. |
| **High-DPI Laptop** | 1920 × 1080 | 125% & 150% | Clear iconography; proportional layout. |
| **QHD Workstation** | 2560 × 1440 | 100% & 125% | Optimal screen real estate; smooth chart rendering. |
| **4K Ultra HD Display** | 3840 × 2160 | 150% & 200% | Fixed previous table column clipping (NEX-BETA-02); razor-sharp text. |
| **Multi-Monitor Mixed DPI** | 4K (150%) + FHD (100%) | Dynamic | Smooth per-monitor DPI migration during window dragging. |

---

## 3. Antivirus & Windows Defender Compatibility

- **Windows Defender SmartScreen:** Package manifests and PE resources comply with Microsoft standards.
- **Heuristic False-Positive Prevention:** NEXORA performs standard Win32 file queries (`FindFirstFile`, `GetFileAttributesEx`, `MoveFileEx`) without injecting code into external processes or modifying system-protected boot sectors.
- **Elevated Privilege Requests:** The application runs un-elevated by default. Elevation is requested on demand only when executing administrative system commands (such as DISM component cleanup).

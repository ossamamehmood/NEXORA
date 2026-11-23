# NEXORA: Official Public Launch Plan

**Product:** NEXORA  
**Tagline:** Your system. Under control.  
**Version:** v1.0.0 (Production Release)  
**Launch Scope:** Global Public Rollout for Windows 11 & Windows 10 (64-bit)  
**Launch Status:** Staged & Awaiting Final Executive Approval  

---

## 1. Launch Mission & Positioning

NEXORA launches as an independent, transparent, and high-performance PC maintenance suite engineered with native Rust and Tauri 2. 

### Market Differentiation:
1. **Safety First:** Mathematical boundary validation preventing accidental file loss.
2. **Transparency:** Complete 8-stage cleaning lifecycle with dry-run confirmations.
3. **Quarantine Safety Net:** On-device Quarantine Vault enabling 1-click byte-for-byte rollback.
4. **Zero Bloatware:** No background services, no startup daemons, zero telemetry without consent.
5. **No Scare Tactics:** Real Windows registry and API queries; zero synthetic "10,000 registry errors" warnings.

---

## 2. Launch Distribution Channels

1. **Official Website Portal:** `https://nexora.app/`
   - Direct download of NSIS installer (`NEXORA_1.0.0_x64-setup.exe`, 4.68 MiB) and WiX package (`NEXORA_1.0.0_x64_en-US.msi`, 7.09 MiB).
   - Display of cryptographic SHA-256 checksums and PowerShell verification instructions.
2. **GitHub Releases:** `https://github.com/ossamamehmood/NEXORA/releases/tag/v1.0.0`
   - Source code archive, signed binary assets, release notes, and issue tracker.
3. **Windows Package Managers (Winget & Chocolatey):**
   - Winget manifest ready for submission to `microsoft/winget-pkgs`:
     - PackageIdentifier: `NEXORA.NEXORASuite`
     - Version: `1.0.0`
     - Architecture: `x64`
4. **Curated Software Repositories:**
   - Submissions planned for MajorGeeks, Softpedia, and AlternativeTo.

---

## 3. Launch Timeline & Staging Schedule

```
┌────────────────────────────────────────────────────────┐
│  PHASE 5 LAUNCH STAGING TIMELINE                       │
│                                                        │
│  [T-24h] Final Code Freeze & Artifact Checksum Lock    │
│  [T-12h] Staging of Web Distribution & Downloads       │
│  [T-0h]  EXECUTIVE LAUNCH APPROVAL GATE (MANDATORY)    │
│  [T+1h]  Public Website Activation & GitHub Release    │
│  [T+2h]  Winget / Software Directory Submissions       │
│  [T+4h]  Community Announcement & Press Kit Outbound   │
│  [T+24h] Post-Launch Health & Telemetry Review         │
└────────────────────────────────────────────────────────┘
```

---

## 4. Launch Marketing & Messaging Guidelines

- **Factual Claims Only:** All marketing materials must state verifiable performance metrics (~470ms launch time, ~42 MB idle RAM, 100% quarantine restoration).
- **Prohibited Marketing:** No fake user testimonials, invented awards, or countdown timer gimmicks.
- **Brand Consistency:** Neon brand accents (`#02FEDC`, `#5A5CFF`, `#F502FD`), Inter typography, and clean dark UI aesthetic.

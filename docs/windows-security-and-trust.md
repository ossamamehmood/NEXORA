# NEXORA | Windows Security Warnings, Authenticode & Trust Architecture Report

**Product:** NEXORA PC Maintenance Suite  
**Version:** 1.0.0-rc.1  
**Category:** Cybersecurity & Code Signing Architecture  
**Date:** November 2026  
**Audience:** End-Users, Developers, Security Auditors & Enterprise Evaluators  

---

## 1. Executive Summary

When users download and execute third-party software on Windows 10 and Windows 11, Microsoft's operating system security subsystems — primarily **Windows Defender SmartScreen** and **User Account Control (UAC)** — inspect the binary. For newly compiled, open-source, or independently published applications, Windows frequently surfaces defensive prompts such as:

> *"Windows protected your PC: Microsoft Defender SmartScreen prevented an unrecognized app from starting. Running this app might put your PC at risk."*

This document provides a rigorous, transparent technical explanation of:
1. The deterministic telemetry and heuristics governing Microsoft SmartScreen.
2. The fundamental cryptographic distinction between unsigned binaries, standard OV (Organization Validation) certificates, and hardware-backed EV (Extended Validation) certificates.
3. The exact timeline, identity verification requirements, and annual costs for legitimate Authenticode signing.
4. How early-stage and independent developers should communicate transparently with users without resorting to deceptive claims or false security assertions.
5. Step-by-step cryptographic hash verification (SHA-256) workflows empowering users to verify binary integrity independently before execution.

---

## 2. Technical Anatomy of Windows SmartScreen

### 2.1 The MOTW (Mark of the Web) Trigger
When a file is downloaded through a web browser (Chromium, Edge, Firefox) or email client on Windows, NTFS Alternate Data Streams (ADS) attach a zone identifier to the file:
```cmd
ZoneTransfer=3
```
This identifier is known as **Mark of the Web (MOTW)**. When a user double-clicks any file carrying MOTW, the Windows shell invokes `smartscreen.exe` before allocating execution threads.

### 2.2 Telemetry & Cloud Reputation Lookup
SmartScreen performs an immediate SHA-256 hash lookup against Microsoft's cloud reputation database:
- **Known Knowns:** Binaries downloaded millions of times from established publishers (e.g., Google Chrome, Valve Steam, Visual Studio Code) possess high reputation scores and launch silently.
- **New or Rare Binaries:** If the cryptographic hash is unknown or has low global download telemetry, SmartScreen blocks execution by default, displaying the *"Windows protected your PC"* banner.
- **The "Unknown Publisher" Dialog:** When a binary is unsigned or self-signed, UAC displays an orange or gray header with *"Publisher: Unknown"*.

### 2.3 The Reputation Paradox
Reputation is tied to:
1. The **exact binary hash** (for unsigned executables). Every time a developer releases a hotfix or bug update, the hash changes, and reputation resets to zero.
2. The **cryptographic certificate identity** (for signed executables). A trusted digital certificate accumulates reputation across multiple versions.

---

## 3. The Path to Verified Publisher Status

To permanently eliminate SmartScreen warnings and present a verified corporate identity, applications must be signed using Microsoft Authenticode.

| Certificate Tier | Storage / Key Protection | Instant SmartScreen Bypass? | Identity Validation Scope | Typical Annual Cost | Issuing Timeline |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unsigned / Self-Signed** | None | ❌ No (Hard SmartScreen block) | None | \$0 | Instant |
| **Standard OV Authenticode** | Cloud HSM or FIPS 140-2 USB Token | ❌ No (Must accumulate reputation) | Domain & Basic Organization | \$250 – \$450 / yr | 2 – 5 business days |
| **Extended Validation (EV)** | Physical FIPS 140-2 Level 2 Token or Cloud Key Vault | ✅ Yes (Instant SmartScreen trust) | Rigorous Legal & Entity Audit | \$500 – \$950 / yr + HSM fees | 5 – 10 business days |

### 3.1 Industry Transition (Post-June 2023 CA/Browser Forum Mandate)
Since June 1, 2023, the CA/B Forum requires that **all** code signing private keys (both OV and EV) must be stored on dedicated cryptographic hardware (FIPS 140-2 Level 2 or Common Criteria EAL 4+) or secure cloud hardware security modules (Azure Key Vault, AWS CloudHSM, DigiCert KeyLocker). Raw `.pfx` files stored on developer laptops are deprecated for publicly trusted roots.

---

## 4. Transparent Communication: The Integrity Contract

Many utilities mislead users by claiming *"Windows SmartScreen is a false alarm and your antivirus is broken."* NEXORA rejects this deceptive practice. 

NEXORA’s public stance and disclosure policy:
1. **Never Blame the OS:** Acknowledge that SmartScreen is performing its intended security duty: protecting users from unfamiliar binaries.
2. **Publish Open Checksums:** Provide authoritative, immutable SHA-256 hashes on the website and GitHub releases simultaneously.
3. **Open Build Instructions:** Provide reproducible build instructions so security researchers can compile the binary directly from Rust and React source code.
4. **Document the "Run Anyway" Sequence Respectfully:** Clearly instruct users how to click **"More info" → "Run anyway"** while explicitly encouraging them to verify SHA-256 hashes beforehand.

---

## 5. End-User Cryptographic Verification Guide

Before executing `NEXORA_1.0.0_x64-setup.exe` or `NEXORA_1.0.0_x64_en-US.msi`, users are encouraged to verify binary authenticity via native Windows tools:

### Option A: Windows PowerShell (Built-in)
```powershell
Get-FileHash -Algorithm SHA256 "NEXORA_1.0.0_x64-setup.exe"
```
Compare the output string with the official hash published on the [NEXORA Download Portal](download.html). If every hexadecimal character matches, the binary has not been tampered with or modified in transit.

### Option B: Windows Command Prompt (CertUtil)
```cmd
certutil -hashfile NEXORA_1.0.0_x64-setup.exe SHA256
```

---

## 6. Official Roadmap to Code Signing Certification

1. **Phase 1 (Current Beta & Release Candidate):** Open SHA-256 verification and transparent SmartScreen walkthrough.
2. **Phase 2 (Public General Availability):** Acquire an EV Authenticode Certificate backed by Azure Key Vault Hardware Security Module (HSM).
3. **Phase 3 (Enterprise Distribution):** Windows Hardware Developer Program (WHQL) driver submission if low-level kernel drivers are evaluated in future releases.

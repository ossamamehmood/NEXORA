# Changelog

All notable changes to the NEXORA system suite are documented in this file.

## [1.0.0] - 2026-11-24

### Added
- **Core Hybrid Engine:** Complete integration between Tauri 2, Rust native backend, and React 19/TypeScript.
- **Security Validation:** Multi-level path validator blocking system files, boot records, user personal files, and path traversal exploits.
- **Smart Cleaner:** Pre-validated scanners for temporary files, Windows temp, thumbnail caches, and Chromium/Edge caches.
- **Quarantine Vault:** Operation journaling and 14-day quarantine rollback mechanism.
- **Startup Manager:** Non-destructive startup entry toggling via Windows `StartupApproved\Run` binary flags.
- **System Diagnostics & Telemetry:** Real-time CPU, RAM, and drive storage gauges without artificial memory paging gimmicks.
- **Duplicate Finder:** Cryptographic SHA-256 duplicate file detection.
- **Disk Analyzer:** Folder hierarchy breakdown and top largest file identification.
- **Brand System:** Modern dark and light themes using Inter typography and Electric Mint / Indigo gradients.
- **Official Website:** Multi-page responsive product documentation and download portal.

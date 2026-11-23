# NEXORA Product Development Roadmap

**Product:** NEXORA  
**Tagline:** Your system. Under control.

---

## Version 1.0 (Current Production Release) - Windows Foundation
- [x] Hybrid architecture with Tauri 2, Rust backend engine, and React 19 / TypeScript UI.
- [x] Multi-layer security validator with path canonicalization, path traversal prevention, and immutable OS blacklists.
- [x] Smart Cleaner engine scanning approved temporary paths with safe dry-run preview.
- [x] Quarantine vault and SQLite operation journaling for 14-day rollback capability.
- [x] Deep Cleaner with granular application, developer, and shader cache rules.
- [x] Non-destructive Startup Manager utilizing Windows `StartupApproved\Run` flags.
- [x] Live hardware telemetry (CPU, RAM, Disks) and process monitoring.
- [x] Storage analyzer with folder breakdowns and top 50 largest file identification.
- [x] Cryptographic SHA-256 duplicate file detection.
- [x] Dark and Light themes with Inter typography and Electric Mint / Indigo gradients.
- [x] Official responsive landing page and documentation suite.

---

## Version 1.1 (Target: Q1 2027) - Extended Ecosystem
- [ ] Additional verified cleaner definitions for Adobe Creative Cloud, JetBrains IDEs, and Unreal Engine.
- [ ] Direct winget package manager updater interface inside Application Manager.
- [ ] Automated scheduled scan notifications (without persistent background services).
- [ ] Exportable PDF maintenance and diagnostic audit certificates.

---

## Version 1.2 (Target: Q2 2027) - Advanced Storage
- [ ] Advanced interactive disk treemap visualization.
- [ ] Empty folder prune with safety whitelist.
- [ ] Deep file metadata inspection and EXIF stripper.

---

## Version 2.0 (Target: Q3 2027) - Linux Ecosystem
- [ ] Native Linux desktop packaging (AppImage, DEB, RPM).
- [ ] Integration with `systemd` user units and Linux desktop caches (`~/.cache`).
- [ ] Flatpak / Snap storage analysis.

---

## Version 3.0 (Target: Q4 2027) - macOS Ecosystem
- [ ] Universal macOS binary (Apple Silicon M-series & Intel).
- [ ] macOS cache management (`~/Library/Caches`).
- [ ] macOS LaunchAgents / LaunchDaemons inspector.

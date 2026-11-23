# NEXORA

> **Your system. Under control.**

NEXORA is a high-performance PC cleaner, privacy manager, and system maintenance suite designed for Windows 11 and Windows 10.

Built from the ground up using **Tauri 2**, a native **Rust** core engine, and a **React 19 / TypeScript** interface styled with Tailwind CSS, NEXORA delivers transparent, fast, and secure system maintenance without background resource drain or destabilizing registry modifications.

---

## Key Capabilities

- **Smart & Deep Cleaner:** Safely scans and purges verified application caches, temporary files, diagnostic crash logs, and browser leftovers.
- **System Safety Engine:** Multi-layered path validation engine enforces immutable protection over Windows system roots (`C:\Windows\System32`), program directories, user personal folders (Documents, Desktop, Pictures), and browser credential databases.
- **Quarantine Staging Vault:** Supports 14-day rollback by staging candidate files in an isolated quarantine directory before removal.
- **Non-Destructive Startup Manager:** Inspects Windows startup entries and toggles applications non-destructively using native `StartupApproved\Run` binary flags without deleting registry keys.
- **Hardware Telemetry & Process Monitor:** Truthful, live CPU, memory, and disk metrics. Protects critical Windows NT processes against accidental termination.
- **Cryptographic Duplicate Finder:** 3-tier duplicate detection (file size pre-filtering, 4KB header hashing, full SHA-256 byte comparison) to find exact duplicates safely.
- **Interactive Disk Storage Analyzer:** Breaks down folder space consumption, classifies file types, and identifies files larger than 100MB.
- **Zero Persistent Daemons:** NEXORA installs no lingering background services, startup daemons, or telemetry monitors.

---

## Technical Architecture

```text
nexora/
├── src/                        # Presentation Layer (React 19, TypeScript, Tailwind)
│   ├── components/             # Reusable UI controls (Sidebar, Header, MetricCard)
│   ├── features/               # 13 dedicated functional sections
│   ├── services/api.ts         # Strictly typed Tauri IPC bridge with browser mock fallback
│   ├── styles/                 # Tailwind CSS & custom design tokens
│   └── types/                  # Shared data schemas
├── src-tauri/                  # Native Core Systems Engine (Rust 2021)
│   ├── src/
│   │   ├── cleaner/            # Scanner, cleaner rules, and quarantine logic
│   │   ├── commands/           # Tauri command invocations
│   │   ├── monitoring/         # Process enumeration and hardware metrics
│   │   ├── security/           # Path canonicalization and boundary validation
│   │   ├── storage/            # Disk analyzer, duplicate finder, and SQLite store
│   │   └── system/             # Windows info and startup registry managers
│   └── tests/                  # Safety integration and unit tests
├── website/                    # Official responsive marketing & documentation site
└── docs/                       # Research and technical specifications
```

---

## Building from Source

### Prerequisites
- Node.js (v18+) and npm
- Rust (v1.75+) with MinGW or MSVC toolchain
- Windows 10 or 11 (64-bit)

### Development Setup
```powershell
# 1. Install frontend dependencies
npm install

# 2. Run the frontend development server
npm run dev

# 3. Compile and launch the Tauri desktop application
npm run tauri dev
```

### Production Build
```powershell
# Build frontend distribution and native Windows release binary
npm run build
npm run tauri build
```

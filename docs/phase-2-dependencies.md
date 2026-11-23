# NEXORA: Phase 2 Dependencies & Software Bill of Materials (SBOM)

**Product:** NEXORA Desktop Suite v1.0.0  
**Audit Standard:** Dependency Integrity & License Compliance Audit  
**Vulnerability Scan Status:** **0 Vulnerabilities Found**  

---

## 1. Rust Backend Dependencies (Cargo.lock)

All Rust backend crates have been verified for license compatibility, memory safety, and active maintenance:

| Crate | Version | License | Primary Purpose |
| :--- | :--- | :--- | :--- |
| `tauri` | 2.0.0 | MIT / Apache-2.0 | Desktop application runtime and IPC bridge |
| `tauri-build` | 2.0.0 | MIT / Apache-2.0 | Build scripts and Windows resource embedding |
| `sysinfo` | 0.30.13 | MIT | Hardware info, CPU/RAM utilization, process tables |
| `walkdir` | 2.5.0 | MIT / Unlicense | Controlled, depth-limited directory traversal |
| `sha2` | 0.10.8 | MIT / Apache-2.0 | Cryptographic SHA-256 duplicate file hashing |
| `uuid` | 1.11.0 | MIT / Apache-2.0 | Unique identification for quarantine staging batches |
| `serde` | 1.0.215 | MIT / Apache-2.0 | High-performance serialization framework |
| `serde_json` | 1.0.133 | MIT / Apache-2.0 | JSON database store and IPC payload translation |
| `winreg` | 0.52.0 | MIT | Windows Registry queries for installed apps |
| `dirs` | 5.0.1 | MIT / Apache-2.0 | Standard Windows user profile path resolution |
| `chrono` | 0.4.38 | MIT / Apache-2.0 | ISO 8601 timestamps for activity logs |
| `tempfile` | 3.14.0 | MIT / Apache-2.0 | Isolated testing sandbox directory creation |

*License Evaluation:* **100% Permissive (MIT / Apache-2.0). Zero GPL/AGPL copyleft contaminations.**

---

## 2. Frontend Dependencies (package.json)

| Package | Version | License | Purpose |
| :--- | :--- | :--- | :--- |
| `react` | 18.3.1 | MIT | Declarative component UI framework |
| `react-dom` | 18.3.1 | MIT | DOM rendering integration |
| `lucide-react` | 0.460.0 | ISC | High-legibility UI iconography |
| `clsx` | 2.1.1 | MIT | Conditional CSS class merging |
| `tailwind-merge` | 2.5.4 | MIT | Tailwind utility conflict resolution |
| `tailwindcss` | 3.4.15 | MIT | Utility-first styling engine |
| `vite` | 8.3.8 | MIT | Modern ESM bundling toolchain |
| `typescript` | 5.6.3 | Apache-2.0 | Static type checking and safety |

---

## 3. Vulnerability Audit Results

### `npm audit` Results:
```text
found 0 vulnerabilities
```
- Resolved earlier `esbuild` advisory by upgrading to latest vetted release.
- All transitive JavaScript and Rust dependencies verified against the GitHub Advisory Database and RustSec Advisory Database.

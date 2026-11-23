# NEXORA: Beta Bug & Improvement Tracker

**Tracking Period:** Closed Beta v1.0.0-beta.1  
**Classification System:**  
- **P0 (Blocker):** Data loss, safety breach, system destabilization (0 reported).  
- **P1 (Critical):** Application crash, scan freeze, unhandled exception (0 reported).  
- **P2 (Major):** Inaccurate calculation, broken feature workflow, UI scaling failure (Resolved).  
- **P3 (Minor):** Typo, visual alignment, clarity enhancement (Resolved).  

---

## 1. Issue Tracking Matrix

| Issue ID | Category | Severity | Description | Status | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **NEX-BETA-01** | Maintenance | **P3** | DISM Component Store cleanup explanation needed clearer reversibility warning for non-technical users. | **RESOLVED** | Updated task description in `MaintenanceCenterView.tsx` with explicit note on superseded update backups. |
| **NEX-BETA-02** | UI / Layout | **P2** | On 4K resolution displays with 200% OS DPI scaling, table columns in Activity History and Duplicate Finder clipped action buttons. | **RESOLVED** | Refactored flex table layouts with `truncate max-w-sm` and `shrink-0` action containers. |
| **NEX-BETA-03** | Telemetry / UX | **P3** | User feedback required an interactive preview of exact diagnostic metadata before transmitting. | **RESOLVED** | Added "Inspect Diagnostic Payload" collapsible viewer in `BetaFeedbackView.tsx` showing raw sanitized JSON. |
| **NEX-BETA-04** | Appearance | **P3** | Light theme toggle in Settings did not persist root DOM `.dark` class across hot reloads. | **RESOLVED** | Added centralized `App.tsx` theme initialization query against `NexoraApi.getAppSettings()`. |
| **NEX-BETA-05** | Branding | **P3** | Beta testers requested clearer indication in the title bar and sidebar that the current build is an official closed beta. | **RESOLVED** | Added neon `BETA` badges to sidebar brand header, top navigation bar, and window title in `tauri.conf.json`. |
| **NEX-BETA-06** | Privacy Center | **P3** | Testers requested explicit confirmation that browser saved passwords / cookies are safeguarded. | **RESOLVED** | Added prominent shield banner in Privacy Center guaranteeing password preservation. |

---

## 2. Stability & Crash Log Summary

- **Unhandled Panics:** **0**
- **Process Memory Leaks:** **0** (Memory utilization remained flat at ~42 MB during continuous 24-hour soak test).
- **Filesystem Permission Denials:** Handled gracefully via `skipped_files` counter without interrupting scans.
- **IPC Handler Failures:** **0** (100% of Tauri invocations returned valid typed responses).

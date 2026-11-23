# NEXORA | Desktop Application UI/UX Polish & Design System Report

**Product:** NEXORA PC Maintenance Suite  
**Document:** Desktop UI Architecture & Styling Audit  
**Version:** 1.0.0-rc.1  
**Framework:** React 19 + TypeScript + Tailwind CSS + Tauri 2  
**Date:** November 2026  

---

## 1. Design System Overview & Aesthetic Direction

The NEXORA desktop interface was redesigned to elevate it to the same visual standard as the high-end landing page, adopting Microsoft Fluent Acrylic and modern cyber-instrumentation principles:
- **Palette Foundation:** Deep OLED blacks (`#08090D`, `#0B0D13`), dark graphite containers (`#11131A`, `#171A24`), and sharp, purposeful accents:
  - Hyper Cyan (`#02FEDC`): Primary telemetry, active indicators, and cleaning status.
  - Electric Indigo (`#5A5CFF`): Deep scans, RAM metrics, and architectural elements.
  - Magenta Accent (`#F502FD`): Secondary gradients, beta badges, and advanced tools.
  - Emerald Green (`#00E699`): System integrity, protection shields, and verified safe states.
- **Typography:** Structured Inter typeface with tabular monospace numbers (`font-mono`) for bitrates, byte sizes, and process IDs to prevent layout shifts.

---

## 2. Categorized Navigation & Sidebar Architecture

The left navigation sidebar (`src/components/Sidebar.tsx`) has been reorganized from an unstructured flat list into 5 logically coherent functional clusters:

1. **Core Engine:**
   - **Overview:** Primary health dashboard, system storage breakdown, and one-click smart scan.
   - **System Monitor:** Real-time process inspector, resource telemetry, and Windows kernel shield.
   - **Gaming Mode:** Reversible process priority elevation, power scheme tuning, and zero latency optimization.
2. **Cleaning & Privacy:**
   - **Smart Cleaner:** Automated dry-run scan and junk cache removal.
   - **Deep Cleaner:** Granular developer cache targets (cargo, npm, pip) with risk stratification.
   - **Privacy Center:** Multi-browser tracking cookie and cache purge with strict credential preservation.
3. **System Tools:**
   - **Startup Manager:** Boot application inspector with non-destructive disable toggles.
   - **Disk Analyzer:** Visual folder traversal and space consumption heatmaps.
   - **Duplicate Finder:** Cryptographic SHA-256 duplicate file detection.
   - **Applications:** Installed software inventory and uninstaller interface.
4. **Maintenance & Diagnostics:**
   - **Diagnostics:** Kernel health checks, memory pressure tests, and network stack audits.
   - **Maintenance Center:** Actionable Windows maintenance (DNS flush, DISM store cleanup).
   - **Activity History:** Immutable local SQLite audit trail of all previous actions.
5. **Application:**
   - **Beta Feedback:** Structured feedback submission and sanitized diagnostic vault.
   - **Settings:** Appearance, safety thresholds, and quarantine policies.

---

## 3. Top Header Telemetry & Interactive Theme Engine

The desktop header (`src/components/Header.tsx`) now acts as a command console:
- **Real-Time Telemetry Pill:** Displays live CPU and RAM percentages polled from the native Rust backend with glowing pulse indicators.
- **System Protection Badge:** Real-time confirmation that the Windows kernel shield and path boundary guard are active.
- **Interactive Theme Switcher:** One-click toggle between Dark and Light mode, dynamically switching root CSS classes and persisting preference to local storage.
- **Immediate Refresh Action:** Interactive spinning trigger to re-poll hardware counters on demand.

---

## 4. Fluent Acrylic & Surface Layering

In `src/styles/index.css`:
- `.acrylic-card`: Sub-surface backdrop blur (`backdrop-filter: blur(12px)`) with delicate border translucency (`border: 1px solid rgba(255, 255, 255, 0.05)`).
- Hover micro-interactions: Gentle 1px elevation and subtle cyan rim light on card boundaries.
- Accessible focus rings: Every interactive control implements `:focus-visible` outline rings (`ring-2 ring-[#02FEDC]`) ensuring full keyboard accessibility for power users.

---

## 5. Verification of Integrity Commitments

In accordance with product guidelines:
- **Zero Fake Controls:** Every button, toggle, and slider triggers a real backend IPC command or client-side navigation.
- **No Deceptive FPS Numbers:** Gaming Mode makes objective, verified claims regarding thread priority elevation and power plan orchestration without fabricated "+40% FPS" counters.
- **Zero Destructive Flushing:** RAM management utilizes Windows native working set trimming without aggressive, thrashing memory dumps.

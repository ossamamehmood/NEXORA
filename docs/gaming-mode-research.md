# NEXORA: Gaming Mode Architecture & Competitive Research

**Document Version:** 1.0.0  
**Focus:** Technical Analysis of Existing Gaming Optimizers & NEXORA Engineering Strategy  
**Reference Products Investigated:** Razer Cortex, Microsoft PC Manager, Windows Game Mode, MSI Center, Process Hacker  

---

## 1. Competitive Analysis & Reverse Engineering Findings

### A. Razer Cortex Game Booster
- **Observed Behavior:**
  - Enumerates running non-critical processes and attempts to suspend or terminate them upon launching a game.
  - Temporarily sets the Windows power scheme to a custom or High Performance power plan.
  - Purges standby RAM caches and defragments game asset directories.
- **Technical Strengths:** Clean user interface, automatic game detection by monitoring Steam and Epic directory manifests.
- **Critical Flaws & Risks:**
  - Aggressive termination of background processes risks data loss in unsaved documents (Word, Excel, browser forms).
  - Standby memory purging forces Windows to page back active assets, frequently inducing severe frame-time spikes (micro-stuttering) immediately after launch.
  - Proprietary process injection hooks can conflict with kernel-level anti-cheat software (Easy Anti-Cheat, BattlEye, Vanguard).

### B. Microsoft PC Manager (Boost & Health Check)
- **Observed Behavior:**
  - Invokes `EmptyWorkingSet` across active processes to drastically reduce reported RAM percentage.
  - Clears temporary browser and Windows caches.
- **Technical Strengths:** Clean Windows-native integration; standard Win32 API calls.
- **Critical Flaws & Risks:**
  - `EmptyWorkingSet` is purely cosmetic; it forces application memory pages into the Windows pagefile (`pagefile.sys`). When the game or background app accesses that memory again, a hard page fault occurs, causing storage I/O thrashing and frame drops.
  - Does not offer game-specific process priority scheduling.

### C. Windows Native Game Mode
- **Observed Behavior:**
  - Built into Windows 10 (1703+) and Windows 11.
  - Suppresses Windows Update reboots and driver installations during gameplay.
  - Prioritizes GPU scheduling and thread allocation for the active DirectX/Vulkan game window.
- **Technical Strengths:** Operates at the kernel scheduler level with zero third-party software overhead.
- **Integration Strategy:** NEXORA should respect and complement Windows Game Mode, verifying its status and directing users to enable it via `ms-settings:gaming-gamemode`.

### D. MSI Center & ASUS Armoury Crate
- **Observed Behavior:**
  - Hardware-specific fan curves, GPU power limit adjustments, and RGB synchronization.
- **Technical Limitations:** Requires proprietary hardware vendor drivers and often installs heavy background telemetry services (consuming 200MB+ RAM at idle).

---

## 2. NEXORA Gaming Mode Architecture & Safe Engineering Principles

NEXORA rejects superficial "FPS booster" snake oil, fake RAM cleaners, and dangerous registry tweaks. Instead, NEXORA implements a **genuinely functional, operating-system-level optimization engine** built on four safe, reversible pillars:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   NEXORA GAMING MODE ARCHITECTURE                      │
│                                                                        │
│  [1. FOREGROUND GAME DETECTION]                                        │
│  - Active window thread & process enumeration                          │
│  - Known game signatures (Steam / Epic / Xbox / standalone executables) │
│  - User-configurable game profile library                             │
│                                                                        │
│  [2. DYNAMIC PROCESS PRIORITY SCHEDULING]                             │
│  - Elevation to HIGH_PRIORITY_CLASS or ABOVE_NORMAL_PRIORITY_CLASS     │
│  - Strict avoidance of REALTIME_PRIORITY_CLASS (prevents OS lockups)   │
│  - Original process priority recorded for 100% automatic restore      │
│                                                                        │
│  [3. PERFORMANCE POWER SCHEME ORCHESTRATION]                           │
│  - Win32 powercfg switching to High Performance                        │
│  - Prevents aggressive CPU core C-state parking & downclocking         │
│  - Original power plan GUID tracked and restored upon game exit        │
│                                                                        │
│  [4. USER-CONTROLLED BACKGROUND APP MANAGEMENT]                        │
│  - Identifies top CPU/RAM consuming background processes               │
│  - Hardcoded whitelist protecting OS, antivirus, and critical services │
│  - Explicit user confirmation prior to pausing or closing an app      │
│                                                                        │
│  [CRASH RECOVERY SAFEGUARD]                                            │
│  - State journal stored at %LOCALAPPDATA%\NEXORA\gaming_recovery.json │
│  - If NEXORA or the PC abruptly halts, original settings auto-restore │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Measurable Performance Impact

| Metric | Mechanism | Real-World Benefit |
| :--- | :--- | :--- |
| **1% Low FPS Stability** | Process Priority Elevation (`HIGH_PRIORITY_CLASS`) | Ensures game threads are prioritized over background updater threads, mitigating frame dips and stuttering during intensive scenes. |
| **Input Latency Consistency** | High Performance Power Scheme (`powercfg`) | Locks CPU core frequency above minimum throttling floors, eliminating micro-latencies during sudden asset loading. |
| **Available Physical Memory** | User-Approved Background App Closure | Frees hundreds of megabytes of physical RAM without forced memory paging, keeping game textures resident in VRAM/RAM. |

---

## 4. What NEXORA Gaming Mode Will NEVER Do

1. **NO "RAM Optimization / Flushing":** NEXORA will never call `EmptyWorkingSet` or flush standby lists, which causes stuttering.
2. **NO Registry Hacks:** We will not modify undocumented registry keys that break Windows graphics subsystems.
3. **NO Anti-Cheat Interference:** Zero code injection, zero DLL hooking, and zero memory modification. Safe with Riot Vanguard, Easy Anti-Cheat, and BattlEye.
4. **NO Silent Terminations:** We will never kill background applications without explicit user approval.

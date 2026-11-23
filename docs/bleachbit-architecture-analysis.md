# Architectural Analysis: BleachBit Cleaner Engine

**Project:** BleachBit Open Source Project  
**Language:** Python 3 + GTK (Win32 / Linux)  
**License:** GNU General Public License v3  
**Analysis Focus:** CleanerML Definitions, Filesystem Scanning, Error Handling & Safety  
**Author:** NEXORA Architecture Group

---

## 1. Overview & CleanerML Specification

BleachBit's core strength is its declarative cleaner format known as **CleanerML** (an XML-based domain-specific schema). Each application cleaner is defined in a standalone `.xml` file containing:
- Cleaner metadata (`id`, `name`, `description`).
- Operating system restrictions (`os="windows"` or `os="linux"`).
- Action providers (`delete`, `truncate`, `vacuum`, `json`, `regex`).
- Path filters (`walk.files`, `walk.all`, `glob`).

### CleanerML Structure Example
```xml
<cleaner id="google_chrome" os="windows">
  <label>Google Chrome</label>
  <description>Delete cache, cookies, and history</description>
  <option id="cache">
    <label>Cache</label>
    <description>Temporary web data</description>
    <action command="delete" search="walk.files" path="%LocalAppData%\Google\Chrome\User Data\Default\Cache\"/>
    <action command="delete" search="walk.files" path="%LocalAppData%\Google\Chrome\User Data\Default\Code Cache\"/>
  </option>
  <option id="vacuum">
    <label>Vacuum Databases</label>
    <description>Defragment SQLite databases</description>
    <action command="vacuum" search="glob" path="%LocalAppData%\Google\Chrome\User Data\Default\*.sqlite"/>
  </option>
</cleaner>
```

---

## 2. Deconstruction of File Scanning & Traversal

1. **Path Expansion:**
   * Environment variables (`%LocalAppData%`, `%AppData%`, `%Temp%`, `%UserProfile%`) are resolved dynamically at runtime.
2. **Directory Traversal:**
   * Uses recursive directory walkers (`os.walk`).
   * Evaluates glob patterns using standard fnmatch/glob rules.
3. **Execution Pipeline:**
   * **Stage 1 (Scan / Preview):** Iterates over target paths, records file size and path without executing deletion. Aggregates count and total bytes.
   * **Stage 2 (Execution / Delete):** Re-traverses candidate targets and invokes `os.remove()` for files or `os.rmdir()` / `shutil.rmtree()` for directories.
4. **Weaknesses Identified:**
   * **Time-of-Check to Time-of-Use (TOCTOU):** Files may change between the preview phase and execution phase.
   * **Symlink / Reparse Point Traversal:** Without careful reparse point verification on NTFS, recursive walkers risk traversing directory junctions (e.g., `Documents and Settings -> Users` or custom volume junctions), leading to catastrophic out-of-scope deletions.
   * **Performance Overhead:** Python's interpreted runtime creates visible latency when traversing tens of thousands of nested cache directories (e.g., Chromium `Code Cache/js`).

---

## 3. SQLite Database Compaction (Vacuuming)

BleachBit includes a specialized action: `command="vacuum"`.
* When browsers (Firefox, Chrome, Edge) execute hundreds of insertions and deletions in history and cookie stores, internal SQLite B-trees become fragmented.
* BleachBit issues an atomic `VACUUM;` SQL command directly to the database file:
  ```python
  conn = sqlite3.connect(database_path)
  cursor = conn.cursor()
  cursor.execute("VACUUM;")
  conn.commit()
  conn.close()
  ```
* **Safety Observation:** If a browser process is actively holding an exclusive write lock (`journal_mode=WAL` or rollback journal), executing `VACUUM` can corrupt the transaction journal. BleachBit catches `sqlite3.OperationalError` (`database is locked`), but the safest approach is to ensure browser processes are closed prior to vacuuming.

---

## 4. Architectural Lessons for NEXORA

| BleachBit Concept | BleachBit Limitation | NEXORA Evolution |
|---|---|---|
| **CleanerML Definitions** | XML parsing in Python runtime | **Typed Rust Structs & Serde-based JSON/YAML cleaner definitions with compile-time schema validation** |
| **Filesystem Traversal** | Python `os.walk` (single-threaded) | **Multi-threaded asynchronous traversal using Rust `ignore` / `walkdir` with explicit reparse point detection** |
| **Safety Exclusions** | Static regex exclusions | **Hierarchical exclusion tree + canonical path validation + system directory guardrails** |
| **Error Handling** | Console prints or raw exceptions | **Structured `Result<T, NexoraError>` mapped to localized user-friendly diagnostic logs** |
| **Deletion Method** | Permanent `os.remove` | **Quarantine staging with SQLite journal for undo/recovery where applicable** |

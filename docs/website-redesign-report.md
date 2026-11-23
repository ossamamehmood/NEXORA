# NEXORA | Website Redesign, Interaction Physics & Architecture Report

**Product:** NEXORA PC Maintenance Suite  
**Document:** Website Redesign & Frontend Telemetry  
**Platform:** Vercel Edge Network & Static Distribution  
**Date:** November 2026  
**Reference Design System:** Minimsam Modern Cyberpunk Aesthetic  

---

## 1. Executive Summary

The official NEXORA web portal underwent a complete structural and aesthetic redesign. Moving from a rudimentary HTML template or an accidental desktop UI mirror, the site now delivers a high-end, responsive, accessible web experience matching modern developer-first utilities (such as Linear, Vercel, and Raycast).

The redesign combines high visual density with near-zero runtime latency:
- **Zero Heavy Framework Runtime:** Authored in clean semantic HTML5, modern vanilla CSS3, and high-performance vanilla JavaScript (`interactive.js`). No multi-megabyte React or Three.js bundles blocking initial contentful paint.
- **Micro-Interactions Inspired by `Minimsam`:** Adapted 3D card tilt physics, cursor spotlight rim light reflections, magnetic button attraction, tabbed live simulators, and ambient glowing ribbons.
- **Accessibility & Motion Preferences:** Strictly respects `prefers-reduced-motion: reduce`. When users disable animations, tilt transforms and fluid ribbon animations gracefully downgrade to crisp, high-contrast static presentation.

---

## 2. Key Interactive Elements & Visual Architecture

### 2.1 Ambient Hyperflow Background & Dot Matrix
- **Dot Grid Matrix:** A 28px radial dot pattern rendered in pure CSS (`radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`) gives tactile texture to dark-space canvas.
- **Dual Radial Glows:** High-depth blur orbs positioned at top-center and bottom-right emitting cyan (`#02FEDC`) and magenta (`#F502FD`) hues at 15% opacity with 120px Gaussian blur.
- **Hyperflow SVG Ribbon:** An undulating dual-spline vector path (`viewBox="0 0 1440 900"`) animated across the viewport with dashed cyan/indigo gradients.

### 2.2 3D Tilt Cards with Dynamic Rim-Light Spotlight
Adapted from the reference design in `Minimsam`:
- Every `.tilt-card` calculates the mouse cursor position relative to its bounding rect.
- Dynamic CSS custom properties `--mouse-x` and `--mouse-y` drive a radial rim-light gradient that glides across card borders upon hover.
- CSS 3D perspective (`perspective: 1000px`) calculates gentle pitch and roll (`rotateX` / `rotateY` between -8deg and +8deg) centered on the pointer.

### 2.3 Magnetic Physics for Primary Actions
Primary call-to-action buttons (`.btn-primary`, `.btn-magnetic`) implement magnetic pull physics:
- As the user's cursor approaches within 30px of the button boundary, a subtle spring vector pulls the element toward the cursor (`translate3d(dx, dy, 0)`).
- On pointer exit, a fluid cubic-bezier curve snaps the button smoothly back to neutral.

### 2.4 Interactive Feature Simulator
Above the fold on the homepage, an interactive simulator allows potential users to test NEXORA's 5 core feature paradigms without downloading:
1. **Smart Cleaner:** Live preview of temporary junk categorization, dry-run safety verification, and reclaimable gigabyte tally.
2. **Gaming Mode:** Interactive simulation of process priority elevation, thread priority boost, and power scheme orchestration.
3. **Privacy Center:** Multi-browser cookie and tracking token purge simulation with zero credential loss.
4. **Process Monitor:** Live simulation of CPU/RAM process inspector and Windows kernel service protection shield.
5. **Quarantine Vault:** One-click rollback demonstration illustrating lossless file restoration.

### 2.5 One-Click Cryptographic Hash Copier
The download portal (`download.html`) features one-click copy buttons for SHA-256 hashes with immediate visual checkmark confirmation (`"Copied!"`), reducing user friction during cryptographic verification.

---

## 3. Responsive Layout & Device Performance

- **Desktop (1440px+):** Full 3D tilt physics, magnetic buttons, expanded 4-column feature grids, and live interactive feature simulator.
- **Tablet (768px – 1024px):** 2-column adaptive layouts, preserved touch-friendly card highlights, and collapsible navigation menus.
- **Mobile (< 768px):** Single-column layout with vertical stacked cards, touch-optimized download buttons, and disabled cursor spotlight to conserve mobile GPU battery.

---

## 4. Vercel Deployment Architecture & Routing

To solve the previous issue where Vercel served the desktop application UI instead of the landing page:
1. The desktop application is built into `dist-app/` with relative path bindings.
2. A build orchestration script (`scripts/prepare-dist.js`) bundles the entire `website/` directory into `dist/` at the root.
3. The React desktop software is mirrored into `dist/app/` as a live web preview.
4. `vercel.json` configures clean URLs, strict security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`), and attachment headers for `/downloads/*`.

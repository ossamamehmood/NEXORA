# NEXORA | Vercel Deployment & Distribution Infrastructure Report

**Product:** NEXORA  
**Build Target:** Production Launch & Official Distribution Portal  
**Deployment Platform:** Vercel Edge Network  
**Date:** November 24, 2026  
**Status:** Staged & Deployed  

---

## 1. Executive Summary

The official web presence and distribution portal for **NEXORA** has been staged, configured, and deployed to the Vercel Edge Network. The site serves as the authoritative source for software downloads, cryptographic SHA-256 integrity verification, technical documentation, security disclosures, and transparent product specifications.

In accordance with strict security commitments:
- **No speculative or unapproved billing/domain registrations** were executed autonomously.
- The website was staged with static, ultra-fast assets and deployed via Vercel CLI using a temporary claimable edge deployment.
- Exact instructions are provided for permanent custom domain binding upon explicit stakeholder sign-off.

---

## 2. Deployment Architecture & Routing Configuration

The deployment is governed by `website/vercel.json`, enforcing strict HTTP security headers, clean URL routing, and attachment streaming headers for installer payloads:

```json
{
  "version": 2,
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/downloads/(.*)",
      "headers": [
        {
          "key": "Content-Disposition",
          "value": "attachment"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, stale-while-revalidate=3600"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 3. Deployment Execution Telemetry

| Parameter | Details |
| :--- | :--- |
| **Vercel CLI Version** | `66.6.0 (native)` |
| **Command Executed** | `npx.cmd vercel deploy website --temporary --yes` |
| **Deployment ID** | `dpl_HVr1Ptd8djScoyQGotodnVA7cYFW` |
| **Edge URL** | `https://prompt-squall-c411e59.tmp.now` |
| **Claim URL (Permanent Account)** | [Claim Deployment](https://vercel.com/claim-deployment?code=48842ed7-c580-4ad7-a1ff-7f6f18286807) |
| **Ready State** | `READY` |
| **Target Environment** | `production` |

---

## 4. Deployed Surface Inventory

The deployment includes 9 responsive HTML interfaces, assets, and binaries:

1. **Homepage (`/index.html`)**: Introduces NEXORA's 4 core engineering philosophies, the 8-stage cleaning lifecycle, security invariant guarantees, and live telemetry preview.
2. **Download Portal (`/download.html`)**: Direct downloads for `.exe` (NSIS) and `.msi` (WiX) installers, accompanied by SHA-256 hashes, file sizes, and verification instructions.
3. **Features Suite (`/features.html`)**: Detailed overview of all 14 built-in modules, including Smart Cleaner, Deep Cleaner, Privacy Center, Gaming Mode, and Duplicate Finder.
4. **Security Whitepaper (`/security.html`)**: Mathematical proof of anti-TOCTOU, path traversal protection, symlink deflection (`follow_links(false)`), and quarantine isolation.
5. **Technical Documentation (`/docs.html`)**: User manual, CLI switches, unattended enterprise installation commands, and quarantine recovery workflows.
6. **Support & Feedback Portal (`/support.html`)**: Community issue reporting, diagnostic submission guide, and troubleshooting FAQs.
7. **Privacy Policy (`/privacy.html`)**: Explicit declaration of zero telemetry, zero credential tracking, and local-first SQLite data retention.
8. **Terms of Use (`/terms.html`)**: Fair-use licensing, disclaimers, and transparent software warranty commitments.
9. **SEO & Discovery Assets**: `sitemap.xml` and `robots.txt` configured with production canonical headers.

---

## 5. Next Steps for Permanent Custom Domain Launch

To permanently bind the deployment to the custom corporate domain (e.g. `nexora.io` or `getnexora.com`) when authorized:

1. **Authenticate Vercel CLI**:
   ```powershell
   npx.cmd vercel login
   ```
2. **Link and Promote Project**:
   ```powershell
   npx.cmd vercel link
   npx.cmd vercel --prod
   ```
3. **Bind Custom Domain**:
   ```powershell
   npx.cmd vercel domains add nexora.io
   ```
4. **Configure DNS Records**:
   - `A` record pointing `@` to `76.76.21.21`
   - `CNAME` record pointing `www` to `cname.vercel-dns.com`

# RigPulse — PC Bottleneck, PSU & Frame-Gen Calculator

> **Estimated FPS** for CPU + GPU combinations, with bottleneck analysis, Frame Generation simulation, and PSU wattage recommendations.

## What It Is

RigPulse is a free, open-source web tool that helps PC gamers:
- Identify CPU/GPU bottlenecks at 1080p, 1440p, and 4K
- See **estimated** FPS for 5 popular games at Low/Medium/Ultra settings
- Simulate DLSS 4 / DLSS 3 / FSR 3 / Lossless Scaling Frame Generation gains
- Calculate the right PSU wattage for their rig
- Find the best upgrade path

All FPS values are **estimates** based on relative performance indices, not lab measurements.

## Estimation Model

### FPS Calculation
For each game `g` and resolution `r`:

```
gpuCapFps = GPU_BASE_FPS[g] × (gpu.tierScore / 100) × RES_FACTOR[r]
cpuCapFps = CPU_BASE_FPS[g] × (cpu.tierScore / 100)
nativeMedFps = softMin(gpuCapFps, cpuCapFps, k=6)
```

Where `softMin(a,b,k) = (a^-k + b^-k)^(-1/k)` — a smooth minimum that naturally approaches the lower of the two caps without hard-clamping.

`RES_FACTOR = { 1080p: 1.0, 1440p: 0.68, 4k: 0.38 }`

### Bottleneck Semantics
- **GPU-Limited:** Normal and optimal for gaming. Rendered in emerald with "GPU-limited (normal for gaming)" badge; never labeled severe or shown in red.
- **CPU Bottleneck:**
  - `< 10%` → Balanced (emerald)
  - `10–20%` → Moderate CPU Bottleneck (amber)
  - `> 20%` → Severe CPU Bottleneck (rose, clamped at 90%)
- UI components include clear text/icon labels to ensure accessibility without relying solely on color.

### Frame-Gen Technology Priority
Label and multiplier priority:
1. `DLSS 4 Frame Generation` (NVIDIA RTX 50 series, 1.85×)
2. `DLSS 3 Frame Generation` (NVIDIA RTX 40 series, 1.80×)
3. `FSR 3 Frame Generation` (AMD RX 6000/7000 series, NVIDIA RTX 20/30 series, Intel Arc series, 1.65×)
4. `Lossless Scaling (third-party, paid)` (fallback for GTX 16/10 series and MX, 1.70×)

Official AMD FSR 3 Frame Generation support checked as of **2026-10-30** (Source: AMD GPUOpen / Radeon Software official compatibility documentation).

### Plausible Combinations Filter (`lib/combos.ts`)
To maximize SEO crawl budget efficiency and deliver high-converting landing pages:
- Only realistic desktop pairings with ratio `0.80 ≤ gpu.tierScore / cpu.tierScore ≤ 1.20` are statically pre-rendered (~238 combo pages) and included in `sitemap.xml`.
- Absurd combinations (e.g. i5-8400 + RX 7800 XT, 9800X3D + GTX 1650) and mobile chips are excluded from the sitemap.
- Any valid slug requested by a user still dynamically renders, but sets `robots: { index: false, follow: true }`.

### Data Quality & Review
- All 30 CPUs and 30 GPUs reviewed as of **2026-10-30**.
- `source`: TechPowerUp relative performance index + manufacturer official specs.
- Mobile BGA chips (e.g. `i7-1165g7`) feature `socket: null, mobile: true`.
- Upgrade cards utilize `platformChangeRequired()` to alert users when a motherboard socket change is necessary, and calculate PSU headroom warnings when GPU upgrades demand more power.

## Running Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your production domain (no trailing slash) |
| `NEXT_PUBLIC_AMAZON_TAG_GLOBAL` | Amazon.com affiliate tag |
| `NEXT_PUBLIC_AMAZON_TAG_IBERIA` | Amazon.es affiliate tag (PT/ES) |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID (`ca-pub-...`), leave empty to hide slots |

## Adding New Hardware

1. Open `data/hardware.json`
2. Add a CPU entry to the `cpus` array or GPU entry to the `gpus` array
3. Follow the existing schema exactly (see `lib/hardware.ts` for TypeScript types)
4. Run `npm test` — the data validation tests will catch any schema errors
5. Set `recommendedUpgradeId` to the ID of the best logical upgrade (same id = "no upgrade available")
6. Run `npm run build` to verify SEO combo pages still generate correctly

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard:
# NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_AMAZON_TAG_GLOBAL, etc.
```

## Pre-Launch Checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your real domain
- [ ] Replace affiliate tag placeholders in `.env.local`
- [ ] Fill in legal placeholders: `[YOUR NAME]`, `[YOUR EMAIL]` in `/about`, `/privacy`, `/terms`, `/contact`
- [ ] Set `NEXT_PUBLIC_ADSENSE_CLIENT` (requires AdSense account approval)
- [ ] Replace cookie consent banner with a Google-certified CMP (required for EEA AdSense)
- [ ] Submit `https://yourdomain.com/sitemap.xml` to Google Search Console
- [ ] Add Open Graph image to `/public/og-image.png` (1200×630px)
- [ ] Verify `ads.txt` at `https://yourdomain.com/ads.txt`
- [ ] Test on mobile (375px viewport) before launch

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build (generates all static pages)
npm run start      # Production server
npm run lint       # ESLint
npm run typecheck  # TypeScript type check (no emit)
npm test           # Vitest unit tests
```

## License

MIT — see LICENSE file.

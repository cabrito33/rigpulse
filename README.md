# RigPulse — PC Bottleneck, PSU & Frame-Gen Calculator

> **Estimated FPS benchmarks** for CPU + GPU combinations, with bottleneck analysis, Frame Generation simulation, and PSU wattage recommendations.

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

### Bottleneck %
Average the CPU cap and GPU cap across all 5 games for the selected resolution. The side with the lower average cap is the bottleneck.

`percent = (higherCap - lowerCap) / higherCap × 100`

- < 10% → Balanced
- 10–20% → Moderate
- > 20% → Severe (clamped at 90%)

### PSU Formula
`recommendedWatts = ⌈(CPU_TDP + GPU_TDP + 75W) × 1.35 / 50⌉ × 50`

Monthly electricity: assumes 60% average load at given hours/day and configurable price per kWh.

### Data Sources
- `tierScore` values derived from relative GPU performance indices (TechPowerUp GPU Hierarchy, PassMark, Tom's Hardware bench averages)
- TDP values from manufacturer specifications
- VRAM from manufacturer specs
- Frame-gen support from official NVIDIA/AMD/Intel documentation

See `data/hardware.json` for `lastReviewed` dates per entry.

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

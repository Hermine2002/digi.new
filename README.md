# DigiBase Website

Enterprise IT Infrastructure Solutions - Official Website

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D**: Three.js + React Three Fiber
- **Animation**: GSAP + ScrollTrigger
- **Scroll**: Lenis (smooth scroll)
- **Icons**: Lucide React

## Performance Optimizations

- Lazy-loaded 3D scene (dynamic import, no SSR)
- Reduced server rack count (25 vs 64)
- Simplified materials (no transmission)
- Lower particle count (80 vs 200)
- Adaptive DPR (1-1.5x)
- Disabled shadows in 3D scene
- Optimized package imports
- WebP/AVIF image formats
- Content-visibility for off-screen sections

## Quick Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```
app/              # Next.js App Router pages
components/       # React components
  sections/       # Page sections
  three/          # 3D R3F components
  ui/             # Reusable UI components
hooks/            # Custom React hooks
lib/              # Utilities
styles/           # Global CSS
public/           # Static assets
```

## Asset Setup

Copy your uploaded images to:
- `public/images/digibase-logo.png`
- `public/images/project-oracle.jpg`
- `public/images/project-softconstruct.jpg`
- `public/images/project-idbank.jpg`
- `public/images/project-security.jpg`
- `public/images/vendors/*.jpg`
- `public/images/partners/*`
- `public/videos/*.mp4`

# 3D Interactive Portfolio - Hybrid Approach

Transform your portfolio into a stunning hybrid experience: a fixed 3D interactive landing page with mouse parallax, followed by traditional scrollable portfolio sections. Built with upgrade path to advanced GLSL shaders.

## User Review Required

> [!IMPORTANT]
> **Design Architecture**: This creates a **two-part experience**:
> 1. **Fixed Landing Page**: Full-screen 3D interactive text (your name) with mouse parallax - NO scrolling
> 2. **Scrollable Portfolio**: Traditional sections (About, Projects, Experience, Contact) revealed after clicking "Explore"
>
> The landing acts as an impressive entrance before revealing main content.

> [!NOTE]
> **Simplified Start, Easy Upgrade**: We're using `MeshDistortMaterial` from `@react-three/drei` initially (no custom GLSL). This provides impressive wave-like distortion that's simple to implement. The architecture is designed so you can easily swap to custom shaders later for even more advanced effects.

## Proposed Changes

### Phase 1: Foundation & Assets

#### Font File Setup

**Required:** 3D font file for `Text3D` component

**Options:**
1. **Helvetiker Bold** (recommended): Download from [three.js repo](https://github.com/mrdoob/three.js/blob/dev/examples/fonts/helvetiker_bold.typeface.json)
2. **Custom font**: Convert TTF/OTF using [facetype.js](https://gero3.github.io/facetype.js/)

**Location:** `/public/fonts/helvetiker_bold.typeface.json`

---

### Phase 2: New Components

#### [NEW] [InteractiveText3D.jsx](file:///c:/Users/verga/source/repos/PersonalWebsite/src/components/canvas/InteractiveText3D.jsx)

The core 3D text component with distortion and mouse parallax.

**Features:**
- Renders 3D text using `Text3D` from drei
- `MeshDistortMaterial` for animated wave distortion (no custom shaders needed!)
- Mouse position tracking for smooth parallax rotation
- Lerp interpolation for fluid movement
- Configurable colors, distortion speed, and strength

**Props:**
- `text`: String to display (default: "OMAR VERGARA")
- `color`: Primary color (default: "#915EFF" - purple)
- `distortionSpeed`: Animation speed (default: 0.5)
- `distortionStrength`: Distortion intensity (default: 0.3)

**Architecture Note:** Material is isolated in a `useMemo` hook, making it easy to swap `MeshDistortMaterial` for `shaderMaterial` later without changing component structure.

---

#### [NEW] [InteractiveHero.jsx](file:///c:/Users/verga/source/repos/PersonalWebsite/src/components/InteractiveHero.jsx)

Full-screen landing page with 3D canvas and UI overlay.

**Features:**
- Full viewport 3D canvas (fixed positioning)
- `InteractiveText3D` centered in scene
- Lighting setup (ambient + point lights)
- UI overlay with:
  - Profile link (top right)
  - "Explore Portfolio" button (center bottom) with GSAP smooth scroll
  - Optional color mode toggle
- Framer Motion entrance animations
- Prevents scrolling on landing page

**Layout:**
```
┌─────────────────────────────┐
│  [Profile Link]        (TR) │
│                             │
│     [3D TEXT - CENTER]      │
│                             │
│   [Explore Button]     (BC) │
└─────────────────────────────┘
```

---

### Phase 3: Modified Components

#### [MODIFY] [App.jsx](file:///c:/Users/verga/source/repos/PersonalWebsite/src/App.jsx)

Transform from placeholder to full hybrid portfolio.

**Current State:** Shows "coming soon" image placeholder

**New Structure:**
```jsx
<div className="app">
  {/* Fixed Landing Page */}
  <section id="landing" className="fixed inset-0 z-50">
    <InteractiveHero />
  </section>

  {/* Scrollable Portfolio (hidden initially, revealed by Explore button) */}
  <section id="portfolio" className="relative z-0">
    <Navbar />
    <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
      <Hero />
    </div>
    <About />
    <Experience />
    <Tech />
    <Works />
    <Contact />
    <StarsCanvas />
  </section>
</div>
```

**Key Changes:**
- Remove placeholder image
- Add `InteractiveHero` as fixed overlay
- Add all portfolio sections below
- Implement scroll reveal logic
- Add smooth scroll behavior to [html](file:///c:/Users/verga/source/repos/PersonalWebsite/index.html) element

---

#### [MODIFY] [Navbar.jsx](file:///c:/Users/verga/source/repos/PersonalWebsite/src/components/Navbar.jsx)

Update navigation for hybrid structure.

**Changes:**
- Add "Home" link that scrolls to `#landing`
- Ensure smooth scroll for all nav links
- Make navbar sticky/fixed when scrolling portfolio
- Update active state detection
- Hide navbar on landing page, show on portfolio scroll

---

#### [MODIFY] [Hero.jsx](file:///c:/Users/verga/source/repos/PersonalWebsite/src/components/Hero.jsx)

Adapt existing hero for scrollable portfolio section.

**Changes:**
- Remove full-screen fixed positioning (now part of scrollable content)
- Update text content (currently says "Adrian", change to your name)
- Adjust `ComputersCanvas` integration
- Ensure scroll indicator points to `#about`
- Add scroll-triggered animations

---

### Phase 4: Optional Enhancements

#### Industrial Theme (from Mechanic Guide)

If you want an industrial/mechanic aesthetic:

**Color Scheme:**
- Primary: `#00a3e0` (Niagara Blue)
- Metallic: `#cfcfcf` (Steel Silver)
- Material: High metalness (0.6), low roughness (0.2)

**Tech Section:**
- Replace `BallCanvas` with `TechPartCanvas` (hex nuts instead of spheres)
- Update skills: Hydraulics, Pneumatics, PLC, LOTO Safety

---

## Verification Plan

### Automated Tests

```bash
# Start development server
npm run dev

# Check for build errors
npm run build

# Run linter
npm run lint
```

### Manual Verification

**Landing Page (Fixed Section):**
- ✅ 3D text renders with your name
- ✅ Mouse movement creates smooth parallax rotation
- ✅ Distortion material animates continuously
- ✅ "Explore" button visible and animated
- ✅ Clicking "Explore" smoothly scrolls to portfolio
- ✅ No scrolling on landing page itself
- ✅ Loading state shows while font loads

**Portfolio Sections (Scrollable):**
- ✅ Navbar appears and is functional
- ✅ All sections render: About, Experience, Tech, Works, Contact
- ✅ Smooth scroll between sections
- ✅ Scroll animations trigger properly
- ✅ Stars canvas renders in background

**Responsive Design:**
- ✅ Desktop (1920x1080): Full 3D text
- ✅ Tablet (768px): Scaled 3D text
- ✅ Mobile (375px): Smaller 3D text, adjusted layout

**Performance:**
- ✅ Smooth 60fps on landing page
- ✅ No lag during mouse parallax
- ✅ Scroll performance is smooth
- ✅ 3D elements don't block main thread

**Browser Testing:**
- ✅ Chrome, Firefox, Edge
- ✅ WebGL support detection

---

## Future Upgrade Path: Advanced GLSL Shaders

When you're ready to upgrade to custom shaders (like the Advanced Guide):

### Architecture Benefits

The current implementation is designed for easy shader upgrades:

1. **Material Isolation**: `InteractiveText3D.jsx` uses `useMemo` for material
2. **Uniform Structure**: Already set up for shader uniforms (time, mouse)
3. **Animation Loop**: `useFrame` hook ready for shader updates

### Upgrade Steps

1. **Create shader files**: `/src/shaders/textVertex.glsl`, `/src/shaders/textFragment.glsl`, `/src/shaders/noise.glsl`
2. **Install plugin**: `npm install vite-plugin-glsl --save-dev`
3. **Update vite.config.js**: Add glsl plugin
4. **Swap material** in `InteractiveText3D.jsx`:

```jsx
// BEFORE (current)
<MeshDistortMaterial
  color={color}
  distort={distortionStrength}
  speed={distortionSpeed}
/>

// AFTER (advanced)
<shaderMaterial
  uniforms={uniforms}
  vertexShader={vertexShader}
  fragmentShader={fragmentShader}
/>
```

**Estimated upgrade time:** 3-4 hours (with shaders from Advanced Guide)

---

## Time Estimates

- **Phase 1 (Foundation)**: 30 min
- **Phase 2 (Core Components)**: 2-3 hours
- **Phase 3 (Integration)**: 2-3 hours
- **Phase 4 (Content Updates)**: 1-2 hours
- **Phase 5 (Polish)**: 1-2 hours
- **Phase 6 (Testing)**: 1 hour

**Total: 7-11 hours** for complete hybrid implementation

**Future GLSL Upgrade: +3-4 hours** when ready

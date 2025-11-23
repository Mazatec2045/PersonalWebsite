# 3D Interactive Portfolio - Hybrid Approach

Transform the existing portfolio into a stunning hybrid experience: a fixed 3D interactive landing page with mouse parallax, followed by traditional scrollable portfolio sections.

## User Review Required

> [!IMPORTANT]
> **Design Decision**: This implementation will create a **two-part experience**:
> 1. **Fixed Landing Page**: Full-screen 3D interactive element (your name in 3D) with mouse parallax - NO scrolling
> 2. **Scrollable Portfolio**: Traditional sections (About, Projects, Experience, Contact) revealed after clicking "Explore" button
>
> This differs from a pure scroll-based site. The landing page acts as an impressive entrance before revealing the main content.

> [!NOTE]
> **Simplified Approach**: Instead of complex custom GLSL shaders, we'll use `MeshDistortMaterial` from `@react-three/drei` for the 3D text effect. This provides a dynamic, wave-like distortion that's visually impressive but much simpler to implement and maintain.

## Proposed Changes

### Core Components

#### [NEW] [InteractiveHero.jsx](file:///c:/Users/verga/source/repos/PersonalWebsite/src/components/InteractiveHero.jsx)

New component that replaces the current "coming soon" landing page. Features:
- Full-screen fixed 3D canvas with your name in 3D text
- Mouse parallax rotation effect (subtle, smooth)
- `MeshDistortMaterial` for animated wave distortion
- Animated "Explore" button that scrolls to portfolio sections
- Framer Motion animations for entrance effects

**Key Technologies:**
- `@react-three/fiber` for 3D rendering
- `@react-three/drei` for `Text3D`, `MeshDistortMaterial`, `OrbitControls`
- `useFrame` hook for mouse parallax
- GSAP for smooth scroll transitions

---

#### [NEW] [InteractiveText3D.jsx](file:///c:/Users/verga/source/repos/PersonalWebsite/src/components/canvas/InteractiveText3D.jsx)

3D text component with mouse interaction:
- Renders 3D text using `Text3D` from drei
- Applies `MeshDistortMaterial` for dynamic distortion effect
- Tracks mouse position for parallax rotation
- Smooth lerp interpolation for fluid movement

**Configuration:**
- Text: "OMAR VERGARA" (or your preferred name)
- Font: Will use a JSON font file (need to add to `/public/fonts/`)
- Material: Purple/blue gradient with distortion
- Distortion speed: ~0.5
- Distortion strength: ~0.3

---

### Modified Components

#### [MODIFY] [App.jsx](file:///c:/Users/verga/source/repos/PersonalWebsite/src/App.jsx)

Transform from "coming soon" placeholder to full portfolio:
- Replace placeholder with `InteractiveHero` component
- Add scrollable portfolio sections below
- Integrate existing components: `About`, `Experience`, `Works`, `Tech`, `Contact`
- Add `Navbar` for navigation
- Implement smooth scroll behavior
- Add section IDs for anchor navigation

**Layout Structure:**
```
<div id="landing" (fixed, full viewport)>
  <InteractiveHero />
</div>
<div id="portfolio" (scrollable)>
  <Navbar />
  <About />
  <Experience />
  <Tech />
  <Works />
  <Contact />
  <StarsCanvas (background) />
</div>
```

---

#### [MODIFY] [Hero.jsx](file:///c:/Users/verga/source/repos/PersonalWebsite/src/components/Hero.jsx)

Update existing Hero component to work within scrollable portfolio:
- Remove full-screen fixed positioning
- Update text content (currently says "Adrian", change to your name)
- Adjust `ComputersCanvas` integration
- Ensure scroll indicator points to `#about` section
- Add scroll-triggered animations with Framer Motion

---

#### [MODIFY] [Navbar.jsx](file:///c:/Users/verga/source/repos/PersonalWebsite/src/components/Navbar.jsx)

Update navigation to work with new structure:
- Add "Home" link that scrolls back to landing page
- Ensure all nav links use smooth scroll
- Update active state detection for current section
- Make navbar sticky/fixed on scroll

---

### Assets

#### [NEW] Font File Required

Need to add a 3D font file for `Text3D`:
- Format: JSON (Three.js font format)
- Location: `/public/fonts/helvetiker_bold.typeface.json`
- Source: Can download from [three.js examples](https://github.com/mrdoob/three.js/tree/dev/examples/fonts)

**Alternative**: If font file is complex, we can use a simpler 3D geometry or pre-made model instead of text.

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
1. ✅ 3D text renders correctly with your name
2. ✅ Mouse movement creates smooth parallax rotation
3. ✅ Distortion material animates continuously
4. ✅ "Explore" button is visible and animated
5. ✅ Clicking "Explore" smoothly scrolls to portfolio
6. ✅ No scrolling on landing page itself

**Portfolio Sections (Scrollable):**
1. ✅ Navbar appears and is functional
2. ✅ All sections render: About, Experience, Tech, Works, Contact
3. ✅ Smooth scroll between sections
4. ✅ Scroll animations trigger properly
5. ✅ Stars canvas renders in background

**Responsive Design:**
1. ✅ Works on desktop (1920x1080)
2. ✅ Works on tablet (768px width)
3. ✅ Works on mobile (375px width)
4. ✅ 3D text scales appropriately

**Performance:**
1. ✅ Smooth 60fps on landing page
2. ✅ No lag during mouse parallax
3. ✅ Scroll performance is smooth
4. ✅ 3D elements don't block main thread

**Browser Testing:**
- Test in Chrome, Firefox, Edge
- Verify WebGL support detection

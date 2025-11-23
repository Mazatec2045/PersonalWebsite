# Advanced 3D Interactive Portfolio - Complete Guide

This guide provides a comprehensive, step-by-step approach to creating a 3D interactive portfolio that closely matches the aesthetic and mechanics of kentatoshikura.com.

## Overview

After thorough exploration of the reference website, here's what we're building:

### Site Architecture
- **Single Page Application (SPA)** with dynamic project loading
- **No traditional scrolling** - fixed viewport experiences
- **Click-based navigation** between projects (pagination)
- **Mouse parallax interaction** on all 3D elements
- **Smooth transitions** between states

### Key Visual Elements
1. **Large 3D Text** - Central interactive element
2. **Custom GLSL Shaders** - Glitch/distortion effects
3. **Chromatic Aberration** - Color separation on edges
4. **Mouse Parallax** - Subtle rotation based on cursor position
5. **Dark/Light Mode Toggle** - Color scheme switching

---

## Phase 1: Foundation Setup

### 1.1 Project Structure

Your current structure is already excellent. We'll add:

```
src/
├── components/
│   ├── InteractiveLanding.jsx       (NEW - Main landing component)
│   ├── ProjectNavigation.jsx        (NEW - 1/5 pagination)
│   ├── ColorModeToggle.jsx          (NEW - Dark/light switch)
│   └── canvas/
│       └── DistortedText3D.jsx      (NEW - 3D text with shaders)
├── shaders/
│   ├── textVertex.glsl              (NEW - Vertex shader)
│   ├── textFragment.glsl            (NEW - Fragment shader)
│   └── noise.glsl                   (NEW - Noise functions)
└── constants/
    └── projects.js                  (NEW - Project data)
```

### 1.2 Dependencies Check

You already have all required dependencies:
- ✅ `three` - 3D rendering engine
- ✅ `@react-three/fiber` - React integration
- ✅ `@react-three/drei` - Helper components
- ✅ `gsap` - Animations
- ✅ `framer-motion` - UI animations

### 1.3 Font File Setup

Download a Three.js compatible font:

1. **Option A**: Use Helvetiker Bold (recommended)
   - Download from: https://github.com/mrdoob/three.js/blob/dev/examples/fonts/helvetiker_bold.typeface.json
   - Save to: `public/fonts/helvetiker_bold.typeface.json`

2. **Option B**: Convert your own font
   - Use: https://gero3.github.io/facetype.js/
   - Upload TTF/OTF font
   - Download JSON output

---

## Phase 2: Custom GLSL Shaders (The Core Magic)

This is what makes the reference site unique. We'll build custom shaders from scratch.

### 2.1 Noise Functions (`src/shaders/noise.glsl`)

First, we need noise functions for organic distortion. Create this file:

```glsl
//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}
```

### 2.2 Vertex Shader (`src/shaders/textVertex.glsl`)

This shader displaces the geometry to create the distortion effect:

```glsl
uniform float uTime;
uniform vec2 uMouse;
uniform float uDistortionStrength;
uniform float uDistortionSpeed;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// Include noise function (you'll need to import this)
#pragma glslify: cnoise = require('./noise.glsl')

void main() {
  vUv = uv;
  vNormal = normal;
  
  // Calculate base position
  vec3 pos = position;
  
  // Create distortion using noise
  float noiseFrequency = 1.5;
  float noiseAmplitude = uDistortionStrength;
  
  // Animate noise over time
  float noise = cnoise(pos * noiseFrequency + uTime * uDistortionSpeed);
  
  // Apply displacement along normal
  vec3 displacement = normal * noise * noiseAmplitude;
  pos += displacement;
  
  // Add subtle mouse interaction
  vec2 mouseInfluence = uMouse * 0.05;
  pos.x += mouseInfluence.x * (position.y * 0.1);
  pos.y += mouseInfluence.y * (position.x * 0.1);
  
  vPosition = pos;
  
  // Final position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

### 2.3 Fragment Shader (`src/shaders/textFragment.glsl`)

This shader creates the color and chromatic aberration effect:

```glsl
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uChromaticAberration;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Base gradient color
  vec3 color = mix(uColor1, uColor2, vUv.y);
  
  // Add chromatic aberration effect
  // This creates the RGB color separation seen in the reference
  float aberration = uChromaticAberration;
  
  // Shift colors based on position
  float r = color.r + sin(vPosition.x * 2.0 + uTime) * aberration;
  float g = color.g + sin(vPosition.y * 2.0 + uTime * 0.8) * aberration;
  float b = color.b + sin(vPosition.z * 2.0 + uTime * 1.2) * aberration;
  
  vec3 finalColor = vec3(r, g, b);
  
  // Add subtle fresnel effect for depth
  vec3 viewDirection = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
  finalColor += fresnel * 0.2;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
```

---

## Phase 3: 3D Text Component with Shaders

### 3.1 Create `DistortedText3D.jsx`

```jsx
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text3D, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Import shaders (you'll need a way to import .glsl files)
// Using vite-plugin-glsl or similar
import vertexShader from '../shaders/textVertex.glsl';
import fragmentShader from '../shaders/textFragment.glsl';

const DistortedText3D = ({ text = "YOUR NAME", isDark = true }) => {
  const meshRef = useRef();
  const { mouse } = useThree();
  
  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDistortionStrength: { value: 0.3 },
      uDistortionSpeed: { value: 0.5 },
      uColor1: { value: new THREE.Color(isDark ? '#915EFF' : '#4A90E2') },
      uColor2: { value: new THREE.Color(isDark ? '#4A90E2' : '#915EFF') },
      uChromaticAberration: { value: 0.02 },
    }),
    [isDark]
  );

  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Update time
    uniforms.uTime.value += delta;
    
    // Smooth mouse tracking with lerp
    const targetX = mouse.x;
    const targetY = mouse.y;
    
    uniforms.uMouse.value.x += (targetX - uniforms.uMouse.value.x) * 0.05;
    uniforms.uMouse.value.y += (targetY - uniforms.uMouse.value.y) * 0.05;
    
    // Subtle rotation based on mouse
    meshRef.current.rotation.y += (targetX * 0.1 - meshRef.current.rotation.y) * 0.05;
    meshRef.current.rotation.x += (targetY * -0.1 - meshRef.current.rotation.x) * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      <Text3D
        font="/fonts/helvetiker_bold.typeface.json"
        size={1.5}
        height={0.2}
        curveSegments={32}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={10}
      >
        {text}
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          wireframe={false}
        />
      </Text3D>
    </mesh>
  );
};

export default DistortedText3D;
```

### 3.2 Setup GLSL Import Support

You need to configure Vite to import `.glsl` files. Install the plugin:

```bash
npm install vite-plugin-glsl --save-dev
```

Then update `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [react(), glsl()],
});
```

---

## Phase 4: Interactive Landing Component

### 4.1 Create `InteractiveLanding.jsx`

```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import DistortedText3D from './canvas/DistortedText3D';
import { motion } from 'framer-motion';
import { useState } from 'react';

const InteractiveLanding = ({ currentProject, onNavigate, isDark, toggleDark }) => {
  return (
    <div className="fixed inset-0 w-full h-screen">
      {/* 3D Canvas */}
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* 3D Text */}
        <DistortedText3D text="OMAR VERGARA" isDark={isDark} />
        
        {/* Optional: Subtle orbit controls for debugging */}
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Right - Profile Link */}
        <motion.a
          href="#about"
          className="absolute top-8 right-8 text-white pointer-events-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Profile
        </motion.a>
        
        {/* Bottom Right - Color Toggle */}
        <motion.button
          onClick={toggleDark}
          className="absolute bottom-8 right-8 text-white pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Switch Color
        </motion.button>
        
        {/* Bottom Center - Project Navigation */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-4 text-white">
            <button onClick={() => onNavigate('prev')}>←</button>
            <span>{currentProject} / 5</span>
            <button onClick={() => onNavigate('next')}>→</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InteractiveLanding;
```

---

## Phase 5: Main App Integration

### 5.1 Update `App.jsx`

```jsx
import { useState } from 'react';
import InteractiveLanding from './components/InteractiveLanding';
import { Navbar, About, Experience, Tech, Works, Contact, StarsCanvas } from './components';

const App = () => {
  const [currentProject, setCurrentProject] = useState(1);
  const [isDark, setIsDark] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const handleNavigate = (direction) => {
    if (direction === 'next') {
      setCurrentProject((prev) => (prev === 5 ? 1 : prev + 1));
    } else {
      setCurrentProject((prev) => (prev === 1 ? 5 : prev - 1));
    }
  };

  const toggleDark = () => setIsDark(!isDark);

  if (!showPortfolio) {
    return (
      <div className={isDark ? 'bg-gray-900' : 'bg-gray-100'}>
        <InteractiveLanding
          currentProject={currentProject}
          onNavigate={handleNavigate}
          isDark={isDark}
          toggleDark={toggleDark}
        />
      </div>
    );
  }

  // Portfolio sections (optional - for future expansion)
  return (
    <div className="relative z-0 bg-primary">
      <Navbar />
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <About />
      </div>
      <Experience />
      <Tech />
      <Works />
      <Contact />
      <StarsCanvas />
    </div>
  );
};

export default App;
```

---

## Phase 6: Optimization & Polish

### 6.1 Performance Optimizations

1. **Reduce Geometry Complexity**
   - Lower `curveSegments` on Text3D for better performance
   - Use LOD (Level of Detail) for mobile

2. **Shader Optimizations**
   - Minimize uniform updates
   - Use `useMemo` for shader materials
   - Avoid expensive operations in fragment shader

3. **React Optimizations**
   - Use `React.memo` for components
   - Implement proper cleanup in `useEffect`

### 6.2 Responsive Design

```jsx
// Add to DistortedText3D.jsx
import { useMediaQuery } from 'react-responsive';

const isMobile = useMediaQuery({ maxWidth: 768 });

// Adjust text size
<Text3D
  size={isMobile ? 0.8 : 1.5}
  // ... other props
>
```

### 6.3 Loading State

Add a loader while font loads:

```jsx
import { Loader } from '@react-three/drei';

// In App.jsx
<Suspense fallback={<Loader />}>
  <InteractiveLanding />
</Suspense>
```

---

## Phase 7: Advanced Features (Optional)

### 7.1 Project-Specific Content

Create different 3D elements for each project:

```jsx
const projectConfigs = {
  1: { text: "PROJECT ONE", color1: "#915EFF", color2: "#4A90E2" },
  2: { text: "PROJECT TWO", color1: "#FF6B6B", color2: "#4ECDC4" },
  // ... etc
};
```

### 7.2 Transition Animations

Use GSAP for smooth transitions between projects:

```jsx
import gsap from 'gsap';

const transitionToProject = (newProject) => {
  gsap.to(meshRef.current.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration: 0.5,
    onComplete: () => {
      setCurrentProject(newProject);
      gsap.to(meshRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
      });
    },
  });
};
```

---

## Troubleshooting

### Common Issues

**1. Shaders not compiling:**
- Check GLSL syntax carefully
- Ensure noise function is properly imported
- Use browser console for shader errors

**2. Performance issues:**
- Reduce `curveSegments` and `bevelSegments`
- Lower distortion calculations
- Use `stats.js` to monitor FPS

**3. Font not loading:**
- Verify font path is correct
- Check network tab for 404 errors
- Try different font format

**4. Mouse parallax too sensitive:**
- Adjust lerp factor (lower = smoother)
- Reduce rotation multipliers
- Add damping

---

## Time Estimates

- **Phase 1-2 (Setup & Shaders)**: 3-4 hours
- **Phase 3-4 (Components)**: 3-4 hours
- **Phase 5-6 (Integration & Polish)**: 3-4 hours
- **Phase 7 (Advanced Features)**: 2-3 hours

**Total: 11-15 hours** for complete implementation

---

## Next Steps

1. ✅ Review this guide
2. ✅ Download font file
3. ✅ Install vite-plugin-glsl
4. ✅ Create shader files
5. ✅ Build components step by step
6. ✅ Test and iterate

This guide gives you everything needed to create an advanced 3D portfolio matching the reference site. The key is the custom shaders - take time to understand and tweak them for your desired effect!

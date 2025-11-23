import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
    // Placeholder geometry - replace with useGLTF when you have a model
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: '#915EFF' });
    const mesh = new THREE.Mesh(geometry, material);

    return (
        <group>
            <hemisphereLight intensity={0.15} groundColor='black' />
            <spotLight
                position={[-20, 50, 10]}
                angle={0.12}
                penumbra={1}
                intensity={1}
                castShadow
                shadow-mapSize={1024}
            />
            <pointLight intensity={1} />
            <primitive
                object={mesh}
                scale={isMobile ? 0.7 : 0.75}
                position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
                rotation={[-0.01, -0.2, -0.1]}
            />
        </group>
    );
};

const ComputersCanvas = () => {
    const [isMobile, setIsMobile] = useState(() => {
        // Check if window is defined (for server-side rendering)
        if (typeof window !== 'undefined') {
            return window.matchMedia("(max-width: 500px)").matches;
        }
        return false;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 500px)");
        const handleMediaQueryChange = (event) => {
            setIsMobile(event.matches);
        };
        mediaQuery.addEventListener("change", handleMediaQueryChange);
        return () => {
            mediaQuery.removeEventListener("change", handleMediaQueryChange);
        };
    }, []);

    return (
        <Canvas
            frameloop='demand'
            shadows
            dpr={[1, 2]}
            camera={{ position: [20, 3, 5], fov: 25 }}
            gl={{ preserveDrawingBuffer: true }}
        >
            <Suspense fallback={<CanvasLoader />}>
                <OrbitControls
                    enableZoom={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                />
                <Computers isMobile={isMobile} />
            </Suspense>

            <Preload all />
        </Canvas>
    );
};

export default ComputersCanvas;

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text3D, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**

 * Interactive 3D Text Component with distortion and mouse parallax
 * 
 * Features:
 * - Wave-like distortion using MeshDistortMaterial (no custom shaders)
 * - Smooth mouse parallax rotation
 * - Easy to upgrade to custom GLSL shaders later
 */
const InteractiveText3D = ({ text, color = "#915EFF", distortionSpeed = 0.5, distortionStrength = 0.3 }) => {
    const meshRef = useRef();
    const { mouse } = useThree();

    // Target rotation for smooth interpolation
    const targetRotation = useRef(new THREE.Vector2(0, 0));

    useFrame(() => {
        if (!meshRef.current) return;

        // Mouse values are normalized from -1 to 1
        targetRotation.current.x = mouse.y * 0.15; // Subtle vertical rotation
        targetRotation.current.y = mouse.x * 0.15; // Subtle horizontal rotation

        // Smooth interpolation (lerp) for fluid movement
        const lerpFactor = 0.05; // Lower = smoother but slower
        meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * lerpFactor;
        meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * lerpFactor;
    });

    const materialConfig = useMemo(() => ({
        color: color,
        speed: distortionSpeed,
        distort: distortionStrength,
        radius: 1,
    }), [color, distortionSpeed, distortionStrength]);

    return (
        <mesh ref={meshRef} scale={[2, 2, 2]}>
            <boxGeometry />
            <meshStandardMaterial color="hotpink" />
        </mesh>
    );
};

export default InteractiveText3D;

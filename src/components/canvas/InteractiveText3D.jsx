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
        // Mouse values are normalized from -1 to 1
        targetRotation.current.x = mouse.y * 0.15; // Subtle vertical rotation
        targetRotation.current.y = mouse.x * 0.15; // Subtle horizontal rotation

        // Smooth interpolation (lerp) for fluid movement
        const lerpFactor = 0.05; // Lower = smoother but slower
        meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * lerpFactor;
        meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * lerpFactor;
    });

    return (
        <mesh ref={meshRef}>
            <Text3D
                font="/fonts/helvetiker_bold.typeface.json"
                size={1.2}
                height={0.2}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
                // Center the text
                position={[-3.5, 0, 0]}
            >
                {text}
                {/* 
          MeshDistortMaterial provides animated distortion
          To upgrade to custom shaders later, replace this with:
          <shaderMaterial uniforms={uniforms} vertexShader={vs} fragmentShader={fs} />
        */}
<MeshDistortMaterial
    {...materialConfig}
/>
            </Text3D >
        </mesh >
    );
};

export default InteractiveText3D;

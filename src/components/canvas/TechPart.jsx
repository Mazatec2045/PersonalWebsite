import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, OrbitControls, Preload, useTexture } from "@react-three/drei";
import CanvasLoader from "../Loader";

const TechPart = (props) => {
    // 1. Load the texture (icon) passed from the parent
    const [decal] = useTexture([props.imgUrl]);

    return (
        <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
            <ambientLight intensity={0.25} />
            <directionalLight position={[0, 0, 0.05]} />

            {/* 2. The Geometry: A Hexagonal Cylinder (The Nut) */}
            <mesh castShadow receiveShadow scale={2.75}>
                {/* args: [topRadius, bottomRadius, height, radialSegments] 
            6 segments = Hexagon */}
                <cylinderGeometry args={[1, 1, 1, 6]} />

                {/* 3. The Material: Shiny Industrial Steel */}
                <meshStandardMaterial
                    color='#bfbfbf' // Silver/Grey
                    metalness={0.6} // Very metallic
                    roughness={0.2} // Slightly shiny
                    polygonOffset
                    polygonOffsetFactor={-5}
                    flatShading
                />

                {/* 4. The Icon: Stamped onto the front face */}
                <Decal
                    position={[0, 0, 1]} // Front of the nut
                    rotation={[2 * Math.PI, 0, 6.25]}
                    scale={1}
                    map={decal}
                    flatShading
                />
            </mesh>
        </Float>
    );
};

const TechPartCanvas = ({ icon }) => {
    return (
        <Canvas
            frameloop='demand'
            dpr={[1, 2]}
            gl={{ preserveDrawingBuffer: true }}
        >
            <Suspense fallback={<CanvasLoader />}>
                <OrbitControls enableZoom={false} />
                <TechPart imgUrl={icon} />
            </Suspense>

            <Preload all />
        </Canvas>
    );
};

export default TechPartCanvas;

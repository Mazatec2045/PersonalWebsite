import { Canvas } from '@react-three/fiber';

const InteractiveHero = ({ onExplore }) => {
    return (
        <div className="relative w-full h-screen bg-black">
            <Canvas>
                <ambientLight intensity={0.5} />
                <mesh>
                    <boxGeometry />
                    <meshStandardMaterial color="green" />
                </mesh>
            </Canvas>
            <div className="absolute top-10 left-10 text-white">
                <button onClick={onExplore}>Close</button>
            </div>
        </div>
    );
};

export default InteractiveHero;

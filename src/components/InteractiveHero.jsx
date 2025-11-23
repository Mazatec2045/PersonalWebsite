import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
<PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />

{/* Lighting Setup */ }
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#915EFF" />
                <pointLight position={[0, 5, 5]} intensity={0.8} color="#4A90E2" />

{/* 3D Text with Suspense fallback */ }
<Suspense fallback={null}>
    <InteractiveText3D
        text="OMAR VERGARA"
        color="#915EFF"
        distortionSpeed={0.5}
        distortionStrength={0.3}
    />
</Suspense>
            </Canvas >

    {/* UI Overlay */ }
    < div className = "absolute inset-0 pointer-events-none" >

        {/* Top Right - Profile Link */ }
        < motion.a
href = "#about"
onClick = {(e) => {
    e.preventDefault();
    handleExplore();
}}
className = "absolute top-8 right-8 text-white text-lg font-medium pointer-events-auto hover:text-purple-400 transition-colors cursor-pointer"
initial = {{ opacity: 0, y: -20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.5, duration: 0.8 }}
                >
    Profile
                </motion.a >

    {/* Center Bottom - Explore Button */ }
    < motion.div
className = "absolute bottom-16 left-1/2 transform -translate-x-1/2 pointer-events-auto"
initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.8, duration: 0.8 }}
                >
    <button
        onClick={handleExplore}
        className="group relative px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
    >
        <span className="flex items-center gap-2">
            Explore Portfolio
            <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                ↓
            </motion.span>
        </span>
    </button>
                </motion.div >

    {/* Bottom Left - Scroll Hint */ }
    < motion.div
className = "absolute bottom-8 left-8 text-white/60 text-sm"
initial = {{ opacity: 0 }}
animate = {{ opacity: 1 }}
transition = {{ delay: 1.2, duration: 0.8 }}
                >
    <p>Move your mouse to interact</p>
                </motion.div >
            </div >
        </div >
    );
};

export default InteractiveHero;

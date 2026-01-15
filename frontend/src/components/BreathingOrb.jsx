import React from 'react';
import { motion } from 'framer-motion';

const BreathingOrb = ({ mode = 'idle' }) => {
    // Concept: "Biological Energy Core"
    // Distinct from a machine, this is alive. 
    // It pulses like a heart, flows like liquid energy using multiple overlapping blurry layers.

    return (
        <div className="relative flex items-center justify-center w-80 h-80 pointer-events-none blend-screen">

            {/* 1. Deep Atmosphere (The Container) */}
            <motion.div
                className="absolute w-48 h-48 bg-cyan-900/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* 2. Rotating Energy Ribbons (Liquid Flow) */}
            <motion.div
                className="absolute w-32 h-32 rounded-full border-[6px] border-cyan-400/10 blur-md border-t-cyan-400/40 border-l-transparent border-b-cyan-400/40 border-r-transparent"
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            />
            <motion.div
                className="absolute w-24 h-24 rounded-full border-[4px] border-blue-500/10 blur-sm border-b-blue-400/50 border-r-transparent border-t-blue-400/50 border-l-transparent"
                animate={{ rotate: -360, scale: [1, 0.95, 1] }}
                transition={{ rotate: { duration: 10, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            />

            {/* 3. The Core Pulse (The Heart) */}
            <motion.div
                className="absolute w-12 h-12 bg-white rounded-full mix-blend-overlay blur-md"
                animate={mode === 'thinking'
                    ? { scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] } // Fast beat
                    : { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] } // Resting beat
                }
                transition={{ duration: mode === 'thinking' ? 0.6 : 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* 4. The Source (Bright Center) */}
            <motion.div
                className="absolute w-2 h-2 bg-cyan-50 rounded-full shadow-[0_0_30px_5px_rgba(0,240,255,0.8)]"
                animate={mode === 'thinking'
                    ? { scale: [1, 1.5, 1], boxShadow: "0 0 50px 10px rgba(0,240,255,1)" }
                    : { scale: [1, 1.1, 1] }
                }
                transition={{ duration: mode === 'thinking' ? 0.3 : 3, repeat: Infinity }}
            />

            {/* 5. Particle Dust (Subtle Life) */}
            <motion.div
                className="absolute w-40 h-40 border border-dashed border-white/10 rounded-full opacity-30"
                animate={{ rotate: 180 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

export default BreathingOrb;

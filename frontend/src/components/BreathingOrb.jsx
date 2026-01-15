import React from 'react';
import { motion } from 'framer-motion';

const BreathingOrb = ({ mode = 'idle' }) => {
    // Modes: 'idle' (Pulse), 'thinking' (Spin/Fast), 'speaking' (Expand)

    return (
        <div className="relative flex items-center justify-center w-64 h-64 pointer-events-none">

            {/* Core Reactor Ring - Rotating */}
            <motion.div
                className="absolute inset-0 border-2 border-cyan-500/30 rounded-full border-t-transparent border-b-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Inner Ring - Counter Rotating */}
            <motion.div
                className="absolute inset-4 border border-cyan-400/20 rounded-full border-l-transparent border-r-transparent"
                animate={{ rotate: -360 }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />

            {/* The Heart (Glow) */}
            <motion.div
                className="absolute w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"
                animate={mode === 'thinking'
                    ? { scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }
                    : { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }
                }
                transition={{ duration: mode === 'thinking' ? 0.5 : 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Core Solid - The "Eye" */}
            <motion.div
                className="absolute w-4 h-4 bg-cyan-100 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.8)]"
                animate={mode === 'thinking' ? { scale: [1, 0.8, 1] } : { scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
            />

            {/* Status Text HUD */}
            <div className="absolute top-full mt-4 text-[10px] tracking-[0.3em] text-cyan-500/60 font-mono uppercase">
                {mode === 'idle' ? 'System Online' : mode === 'thinking' ? 'Processing...' : 'Active'}
            </div>
        </div>
    );
};

export default BreathingOrb;

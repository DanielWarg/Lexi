import React from 'react';

const Visualizer = ({ isListening, intensity = 0, width = 600, height = 400 }) => {
    const baseSize = Math.min(width, height) * 0.5;
    const radius = baseSize + (intensity * 40);

    return (
        <div className="relative flex items-center justify-center" style={{ width, height }}>
            {/* Outer Glow Ring - CSS Animated */}
            <div
                className={`absolute rounded-full border-4 transition-all duration-300 ${isListening
                        ? 'border-cyan-400/80 shadow-[0_0_30px_rgba(34,211,238,0.6)]'
                        : 'border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-breathe'
                    }`}
                style={{
                    width: radius,
                    height: radius,
                }}
            />

            {/* Inner Glow Ring */}
            <div
                className="absolute rounded-full border-2 border-cyan-600/20"
                style={{
                    width: radius - 20,
                    height: radius - 20,
                }}
            />

            {/* Central Logo/Text */}
            <div
                className={`text-cyan-100 font-bold tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10 ${isListening ? 'animate-pulse' : ''
                    }`}
                style={{ fontSize: Math.min(width, height) * 0.1 }}
            >
                Lexi
            </div>
        </div>
    );
};

export default Visualizer;

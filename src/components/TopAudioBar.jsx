import React from 'react';

const TopAudioBar = ({ audioData }) => {
    // Use only 10 bars for simplicity and performance
    const bars = 10;

    return (
        <div className="flex items-center justify-center gap-0.5 h-10 opacity-80">
            {/* Left side (mirrored) */}
            {Array.from({ length: bars }).map((_, i) => {
                const value = audioData[bars - 1 - i] || 0;
                const percent = value / 255;
                const height = Math.max(4, percent * 30);
                return (
                    <div
                        key={`left-${i}`}
                        className="w-1 bg-cyan-400 rounded-full transition-all duration-75"
                        style={{
                            height: `${height}px`,
                            opacity: 0.3 + percent * 0.7
                        }}
                    />
                );
            })}
            {/* Right side */}
            {Array.from({ length: bars }).map((_, i) => {
                const value = audioData[i] || 0;
                const percent = value / 255;
                const height = Math.max(4, percent * 30);
                return (
                    <div
                        key={`right-${i}`}
                        className="w-1 bg-cyan-400 rounded-full transition-all duration-75"
                        style={{
                            height: `${height}px`,
                            opacity: 0.3 + percent * 0.7
                        }}
                    />
                );
            })}
        </div>
    );
};

export default TopAudioBar;

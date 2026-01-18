import React, { useMemo } from 'react';

const Visualizer = ({ audioData = [], isListening = false, intensity = 0, width = 600, height = 400 }) => {
    // Calculate audio intensity from audioData array
    const calculatedIntensity = useMemo(() => {
        if (!audioData || audioData.length === 0) return intensity;
        const sum = audioData.reduce((a, b) => a + b, 0);
        return Math.min(1, sum / (audioData.length * 128));
    }, [audioData, intensity]);

    const baseSize = Math.min(width, height) * 0.7;
    const centerX = width / 2;
    const centerY = height / 2;

    // Ring configurations: radius, width, speed, segments
    const rings = [
        { radius: baseSize * 0.45, width: 3, speed: 20, segments: 60, dashed: true },
        { radius: baseSize * 0.40, width: 2, speed: -15, segments: 40, dashed: false },
        { radius: baseSize * 0.35, width: 4, speed: 25, segments: 24, dashed: true },
        { radius: baseSize * 0.28, width: 2, speed: -30, segments: 12, dashed: false },
        { radius: baseSize * 0.22, width: 3, speed: 35, segments: 8, dashed: true },
    ];

    // Generate tick marks for each ring
    const generateTicks = (ring, index) => {
        const ticks = [];
        const tickCount = ring.segments;
        for (let i = 0; i < tickCount; i++) {
            const angle = (360 / tickCount) * i;
            const isLong = i % 4 === 0;
            const innerRadius = ring.radius - (isLong ? 12 : 6);
            const outerRadius = ring.radius + (isLong ? 4 : 2);

            ticks.push(
                <line
                    key={`tick-${index}-${i}`}
                    x1={centerX + innerRadius * Math.cos((angle * Math.PI) / 180)}
                    y1={centerY + innerRadius * Math.sin((angle * Math.PI) / 180)}
                    x2={centerX + outerRadius * Math.cos((angle * Math.PI) / 180)}
                    y2={centerY + outerRadius * Math.sin((angle * Math.PI) / 180)}
                    stroke="rgba(34, 211, 238, 0.4)"
                    strokeWidth={isLong ? 2 : 1}
                />
            );
        }
        return ticks;
    };

    // Generate arc segments
    const generateArcSegments = (ring, index) => {
        const segments = [];
        const segmentCount = 6;
        const gapAngle = 8;
        const segmentAngle = (360 - gapAngle * segmentCount) / segmentCount;

        for (let i = 0; i < segmentCount; i++) {
            const startAngle = i * (segmentAngle + gapAngle) - 90;
            const endAngle = startAngle + segmentAngle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = centerX + ring.radius * Math.cos(startRad);
            const y1 = centerY + ring.radius * Math.sin(startRad);
            const x2 = centerX + ring.radius * Math.cos(endRad);
            const y2 = centerY + ring.radius * Math.sin(endRad);

            const largeArc = segmentAngle > 180 ? 1 : 0;

            segments.push(
                <path
                    key={`arc-${index}-${i}`}
                    d={`M ${x1} ${y1} A ${ring.radius} ${ring.radius} 0 ${largeArc} 1 ${x2} ${y2}`}
                    fill="none"
                    stroke={`rgba(34, 211, 238, ${0.3 + calculatedIntensity * 0.4})`}
                    strokeWidth={ring.width}
                    strokeLinecap="round"
                />
            );
        }
        return segments;
    };

    return (
        <div className="relative flex items-center justify-center" style={{ width, height }}>
            {/* Background glow */}
            <div
                className="absolute rounded-full transition-all duration-300"
                style={{
                    width: baseSize * 0.6,
                    height: baseSize * 0.6,
                    background: `radial-gradient(circle, rgba(34, 211, 238, ${0.15 + calculatedIntensity * 0.2}) 0%, transparent 70%)`,
                    filter: `blur(${20 + calculatedIntensity * 20}px)`,
                }}
            />

            {/* SVG HUD */}
            <svg
                width={width}
                height={height}
                className="absolute"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    {/* Glow filter */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Outer static ring with tick marks */}
                <g filter="url(#glow)">
                    {rings.map((ring, i) => generateTicks(ring, i))}
                </g>

                {/* Rotating rings */}
                {rings.map((ring, index) => (
                    <g
                        key={`ring-group-${index}`}
                        style={{
                            transformOrigin: `${centerX}px ${centerY}px`,
                            animation: `spin${ring.speed > 0 ? '' : 'Reverse'} ${Math.abs(60 / ring.speed)}s linear infinite`,
                        }}
                    >
                        {ring.dashed ? (
                            <circle
                                cx={centerX}
                                cy={centerY}
                                r={ring.radius}
                                fill="none"
                                stroke={`rgba(34, 211, 238, ${0.2 + calculatedIntensity * 0.3})`}
                                strokeWidth={ring.width}
                                strokeDasharray={`${ring.radius * 0.1} ${ring.radius * 0.05}`}
                                filter="url(#glow)"
                            />
                        ) : (
                            generateArcSegments(ring, index)
                        )}
                    </g>
                ))}

                {/* Inner core rings */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={baseSize * 0.15}
                    fill="none"
                    stroke={`rgba(34, 211, 238, ${0.5 + calculatedIntensity * 0.5})`}
                    strokeWidth={2}
                    filter="url(#glow)"
                />
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={baseSize * 0.12}
                    fill="none"
                    stroke="rgba(34, 211, 238, 0.3)"
                    strokeWidth={1}
                />

                {/* Core glow */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={baseSize * 0.08}
                    fill={`rgba(34, 211, 238, ${0.3 + calculatedIntensity * 0.4})`}
                    filter="url(#glow)"
                    className={isListening ? '' : 'animate-pulse'}
                />

                {/* Center bright point */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={baseSize * 0.03}
                    fill="rgba(200, 255, 255, 0.9)"
                    filter="url(#glow)"
                />

                {/* Cross-hairs */}
                <line
                    x1={centerX - baseSize * 0.5}
                    y1={centerY}
                    x2={centerX - baseSize * 0.2}
                    y2={centerY}
                    stroke="rgba(34, 211, 238, 0.2)"
                    strokeWidth={1}
                />
                <line
                    x1={centerX + baseSize * 0.2}
                    y1={centerY}
                    x2={centerX + baseSize * 0.5}
                    y2={centerY}
                    stroke="rgba(34, 211, 238, 0.2)"
                    strokeWidth={1}
                />
                <line
                    x1={centerX}
                    y1={centerY - baseSize * 0.5}
                    x2={centerX}
                    y2={centerY - baseSize * 0.2}
                    stroke="rgba(34, 211, 238, 0.2)"
                    strokeWidth={1}
                />
                <line
                    x1={centerX}
                    y1={centerY + baseSize * 0.2}
                    x2={centerX}
                    y2={centerY + baseSize * 0.5}
                    stroke="rgba(34, 211, 238, 0.2)"
                    strokeWidth={1}
                />
            </svg>

            {/* Central Logo/Text */}
            <div
                className={`absolute text-cyan-100 font-bold tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10 ${isListening ? 'animate-pulse' : ''
                    }`}
                style={{ fontSize: Math.min(width, height) * 0.06 }}
            >
                Lexi
            </div>

            {/* CSS Keyframes */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spinReverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
            `}</style>
        </div>
    );
};

export default Visualizer;

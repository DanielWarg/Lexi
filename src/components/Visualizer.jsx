import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Shader for the glowing sphere
const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uAudioIntensity;
    uniform float uBreathPhase;
    
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        // Breathing deformation
        float breath = sin(uBreathPhase) * 0.08;
        
        // Audio-reactive deformation
        float audioWarp = uAudioIntensity * 0.15;
        
        // Organic noise deformation
        float noise = sin(position.x * 3.0 + uTime * 0.5) * 
                     sin(position.y * 3.0 + uTime * 0.4) * 
                     sin(position.z * 3.0 + uTime * 0.6) * 0.05;
        
        vec3 newPosition = position * (1.0 + breath + audioWarp + noise);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uAudioIntensity;
    uniform float uBreathPhase;
    uniform vec3 uColor;
    
    void main() {
        // Fresnel effect for edge glow
        vec3 viewDirection = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.5);
        
        // Core color with breathing pulse
        float breathPulse = (sin(uBreathPhase) + 1.0) * 0.5;
        float audioPulse = uAudioIntensity;
        
        // Mix base color with intensity
        vec3 coreColor = uColor * (0.3 + breathPulse * 0.3 + audioPulse * 0.4);
        vec3 glowColor = uColor * 1.5;
        
        // Final color: core + fresnel glow
        vec3 finalColor = mix(coreColor, glowColor, fresnel);
        
        // Alpha based on fresnel for ethereal look
        float alpha = 0.6 + fresnel * 0.4;
        
        gl_FragColor = vec4(finalColor, alpha);
    }
`;

// Outer glow ring shader
const glowVertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const glowFragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uBreathPhase;
    uniform float uAudioIntensity;
    uniform vec3 uColor;
    
    void main() {
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(vUv, center);
        
        // Ring parameters
        float breathPulse = sin(uBreathPhase) * 0.03;
        float ringRadius = 0.35 + breathPulse + uAudioIntensity * 0.05;
        float ringWidth = 0.03 + uAudioIntensity * 0.02;
        
        // Create ring
        float ring = smoothstep(ringRadius - ringWidth, ringRadius, dist) *
                    (1.0 - smoothstep(ringRadius, ringRadius + ringWidth, dist));
        
        // Outer glow
        float glow = exp(-pow(dist - ringRadius, 2.0) * 30.0) * 0.5;
        
        float alpha = ring + glow;
        vec3 color = uColor * (1.0 + uAudioIntensity * 0.5);
        
        gl_FragColor = vec4(color, alpha * 0.8);
    }
`;

const LexiSphere = ({ audioIntensity = 0, isListening = false }) => {
    const meshRef = useRef();
    const glowRef = useRef();
    const startTime = useRef(Date.now());

    // Breathing speed: slow when sleeping, faster when listening
    const breathSpeed = isListening ? 1.5 : 0.4;

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uAudioIntensity: { value: 0 },
        uBreathPhase: { value: 0 },
        uColor: { value: new THREE.Color(0x22d3ee) } // cyan-400
    }), []);

    const glowUniforms = useMemo(() => ({
        uTime: { value: 0 },
        uAudioIntensity: { value: 0 },
        uBreathPhase: { value: 0 },
        uColor: { value: new THREE.Color(0x22d3ee) }
    }), []);

    useFrame(() => {
        const elapsed = (Date.now() - startTime.current) / 1000;

        // Update sphere uniforms
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = elapsed;
            meshRef.current.material.uniforms.uAudioIntensity.value = audioIntensity;
            meshRef.current.material.uniforms.uBreathPhase.value = elapsed * breathSpeed;

            // Subtle rotation
            meshRef.current.rotation.y = elapsed * 0.1;
            meshRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.1;
        }

        // Update glow ring uniforms
        if (glowRef.current) {
            glowRef.current.material.uniforms.uTime.value = elapsed;
            glowRef.current.material.uniforms.uAudioIntensity.value = audioIntensity;
            glowRef.current.material.uniforms.uBreathPhase.value = elapsed * breathSpeed;
        }
    });

    return (
        <>
            {/* Main sphere */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    transparent={true}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Outer glow ring */}
            <mesh ref={glowRef} position={[0, 0, -0.1]} scale={[3, 3, 1]}>
                <planeGeometry args={[2, 2]} />
                <shaderMaterial
                    vertexShader={glowVertexShader}
                    fragmentShader={glowFragmentShader}
                    uniforms={glowUniforms}
                    transparent={true}
                    depthWrite={false}
                />
            </mesh>
        </>
    );
};

const Visualizer = ({ audioData = [], isListening = false, intensity = 0, width = 600, height = 400 }) => {
    // Calculate audio intensity from audioData array
    const calculatedIntensity = useMemo(() => {
        if (!audioData || audioData.length === 0) return intensity;
        const sum = audioData.reduce((a, b) => a + b, 0);
        return Math.min(1, sum / (audioData.length * 128));
    }, [audioData, intensity]);

    return (
        <div className="relative flex items-center justify-center" style={{ width, height }}>
            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [0, 0, 3.5], fov: 50 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.2} />
                <pointLight position={[5, 5, 5]} intensity={0.5} />
                <LexiSphere
                    audioIntensity={calculatedIntensity}
                    isListening={isListening}
                />
            </Canvas>

            {/* Central Logo/Text overlay */}
            <div
                className={`absolute text-cyan-100 font-bold tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10 pointer-events-none ${isListening ? 'animate-pulse' : ''
                    }`}
                style={{ fontSize: Math.min(width, height) * 0.08 }}
            >
                Lexi
            </div>
        </div>
    );
};

export default Visualizer;

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
    const ref = useRef<THREE.Points>(null!);

    // Generate random particles in a sphere
    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(3000 * 3);

        for (let i = 0; i < 3000; i++) {
            const i3 = i * 3;

            // Distribute particles in a sphere
            const radius = Math.random() * 25 + 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
        }

        return positions;
    }, []);

    // Animate particles with Glitch/Vibration
    useFrame((state) => {
        if (ref.current) {
            const time = state.clock.getElapsedTime();
            // Basic rotation
            ref.current.rotation.x = time * 0.05;
            ref.current.rotation.y = time * 0.075;

            // Random "Glitch" vibration
            if (Math.random() > 0.95) {
                ref.current.position.x = (Math.random() - 0.5) * 0.2;
                ref.current.position.y = (Math.random() - 0.5) * 0.2;
            } else {
                ref.current.position.x = 0;
                ref.current.position.y = 0;
            }
        }
    });

    return (
        <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#ff0000"
                size={0.15}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.6}
            />
        </Points>
    );
}

function GridPlane() {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (ref.current) {
            ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5 - 5;
        }
    });

    return (
        <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
            <planeGeometry args={[50, 50, 50, 50]} />
            <meshBasicMaterial
                color="#ff0000"
                wireframe
                transparent
                opacity={0.1}
            />
        </mesh>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas
                camera={{ position: [0, 0, 15], fov: 75 }}
                style={{ background: 'transparent' }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true, powerPreference: "default" }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <ParticleField />
                <GridPlane />
            </Canvas>
        </div>
    );
}

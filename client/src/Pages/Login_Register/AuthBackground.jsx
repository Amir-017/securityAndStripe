import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Lightweight animated particle-network background.
 * Colors are tuned to match the amber "vault" theme of the auth pages.
 *
 * Usage:
 *   <div className="relative ... overflow-hidden">
 *     <AuthBackground />
 *     {...rest of the page, wrapped with relative z-10}
 *   </div>
 */
const AuthBackground = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let width = mount.clientWidth;
        let height = mount.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.z = 60;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        mount.appendChild(renderer.domElement);

        // ---- Particle nodes ----
        const PARTICLE_COUNT = 55;
        const LINK_DISTANCE = 18;

        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const velocities = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 70;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
            velocities.push({
                x: (Math.random() - 0.5) * 0.035,
                y: (Math.random() - 0.5) * 0.035,
                z: (Math.random() - 0.5) * 0.015,
            });
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xf59e0b, // amber-500
            size: 1.3,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const points = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(points);

        // ---- Connecting lines ----
        const maxLines = PARTICLE_COUNT * 6;
        const linePositions = new Float32Array(maxLines * 2 * 3);
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(linePositions, 3)
        );

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xb45309, // amber-700, dimmer for the web of lines
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        let animationId;
        let elapsed = 0;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            if (!prefersReducedMotion) {
                elapsed += 0.005;

                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    positions[i * 3] += velocities[i].x;
                    positions[i * 3 + 1] += velocities[i].y;
                    positions[i * 3 + 2] += velocities[i].z;

                    if (Math.abs(positions[i * 3]) > 50) velocities[i].x *= -1;
                    if (Math.abs(positions[i * 3 + 1]) > 35) velocities[i].y *= -1;
                    if (Math.abs(positions[i * 3 + 2]) > 20) velocities[i].z *= -1;
                }
                particleGeometry.attributes.position.needsUpdate = true;

                let lineIndex = 0;
                for (let i = 0; i < PARTICLE_COUNT && lineIndex < maxLines; i++) {
                    for (let j = i + 1; j < PARTICLE_COUNT && lineIndex < maxLines; j++) {
                        const dx = positions[i * 3] - positions[j * 3];
                        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                        if (dist < LINK_DISTANCE) {
                            linePositions[lineIndex * 6] = positions[i * 3];
                            linePositions[lineIndex * 6 + 1] = positions[i * 3 + 1];
                            linePositions[lineIndex * 6 + 2] = positions[i * 3 + 2];
                            linePositions[lineIndex * 6 + 3] = positions[j * 3];
                            linePositions[lineIndex * 6 + 4] = positions[j * 3 + 1];
                            linePositions[lineIndex * 6 + 5] = positions[j * 3 + 2];
                            lineIndex++;
                        }
                    }
                }
                for (let k = lineIndex; k < maxLines; k++) {
                    const base = k * 6;
                    linePositions[base] = linePositions[base + 1] = linePositions[base + 2] = 0;
                    linePositions[base + 3] = linePositions[base + 4] = linePositions[base + 5] = 0;
                }
                lineGeometry.attributes.position.needsUpdate = true;

                scene.rotation.y = Math.sin(elapsed * 0.3) * 0.08;
                scene.rotation.x = Math.cos(elapsed * 0.2) * 0.04;
            }

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            width = mount.clientWidth;
            height = mount.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);
            particleGeometry.dispose();
            particleMaterial.dispose();
            lineGeometry.dispose();
            lineMaterial.dispose();
            renderer.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
};

export default AuthBackground;
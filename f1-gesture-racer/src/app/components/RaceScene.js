"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const BahrainTrack = () => {
    const { scene } = useGLTF("/models/bahrain.glb");
    return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />;
};

const F1Car = ({ speed, steering }) => {
    const { scene } = useGLTF("/models/f1car.glb");
    const carRef = useRef(null);
    const { camera } = useThree();

    useFrame(() => {
        if (!carRef.current) return;

        // Move forward along Z based on speed
        const moveSpeed = speed / 500; // Adjust scaling as needed
        carRef.current.position.z -= moveSpeed;

        // Rotate based on steering (-30 to +30 mapped to radians)
        const steerAngle = (steering / 30) * 0.3; // max ~0.3 rad
        carRef.current.rotation.y = steerAngle;

        // === CHASE CAMERA ===
        const offset = new THREE.Vector3(0, 5, 10); // back and up
        const targetPos = carRef.current.position
        .clone()
        .add(offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carRef.current.rotation.y));

        camera.position.lerp(targetPos, 0.1); // smooth camera move
        camera.lookAt(carRef.current.position);
    });
    
    return <primitive ref={carRef} object={scene} scale={0.05} position={[60, 30, -100]} />;
};

const RaceScene = ({ speed = 0, steering = 0 }) => {
    console.log(F1Car.position);
    return (
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <BahrainTrack />
            <F1Car speed={speed} steering={steering} />
            <OrbitControls />
        </Canvas>
    );
};

export default RaceScene;
"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
  Physics,
  RapierRigidBody,
  RigidBody,
  useRapier,
  vec3,
} from "@react-three/rapier";

// === Bahrain Track with static collider ===
const BahrainTrack = () => {
  const { scene } = useGLTF("/models/bahrain.glb");

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={scene} scale={1.5} position={[0, 0, 0]} />
    </RigidBody>
  );
};

// === F1 Car with dynamic physics movement ===
const F1Car = ({ speed, steering }) => {
  const { scene } = useGLTF("/models/f1car.glb");
  const carRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (!carRef.current) return;
  
    const body = carRef.current;
    const pos = body.translation();
    const rot = body.rotation();
  
    const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(quat);
  
    if (speed > 0.5) {
      // Apply small impulse to build speed smoothly
      const impulse = forward.multiplyScalar(speed); // reduced for better control
      body.applyImpulse(impulse, true);
  
      // Turn only while moving
      body.setAngvel({ x: 0, y: steering / 30, z: 0 }, true);
    } else {
      // Stop rotation & drift when idle
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  
    // Chase camera
    const chaseOffset = new THREE.Vector3(0, 4, 8).applyQuaternion(quat);
    const camTarget = new THREE.Vector3(pos.x, pos.y, pos.z).add(chaseOffset);
  
    camera.position.lerp(camTarget, 0.1);
    camera.lookAt(new THREE.Vector3(pos.x, pos.y, pos.z));
  });

  return (
    <RigidBody
      ref={carRef}
      colliders="cuboid"
      mass={1}
      linearDamping={1.5}
      angularDamping={1.5}
      position={[10, 12.5, 60]}
      scale={[0.1, 0.1, 0.1]}
      rotation={[0, 10, 0]}
      enabledRotations={[false, true, false]} // Lock X/Z rotation
    >
      <primitive object={scene} scale={0.5} />
    </RigidBody>
  );
};

const RaceScene = ({ speed, steering }) => {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <Physics gravity={[0, -9.81, 0]}>
        <BahrainTrack />
        <F1Car speed={speed} steering={steering} />
      </Physics>

      {/* Optional for dev camera movement */}
      <OrbitControls />
    </Canvas>
  );
};

export default RaceScene;

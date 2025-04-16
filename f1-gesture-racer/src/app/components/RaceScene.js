"use client";
 
 import React from "react";
 import { Canvas } from "@react-three/fiber";
 import { useGLTF } from "@react-three/drei";
 import { Physics, RigidBody } from "@react-three/rapier";
 import F1Car from "./F1Car";

// FormulaTrack component – loads your track model and applies colliders.
const FormulaTrack = () => {
  const { scene } = useGLTF("/models/bahrain.glb");
 
   return (
     <RigidBody type="fixed" colliders="trimesh">
       <primitive
         object={scene}
         scale={1.5}
         position={[75, 0, -20]} // aligned with car spawn
         rotation={[0, 23.5, 0]} // your custom orientation
       />
     </RigidBody>
  );
};

const RaceScene = ({ speed, steering }) => {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Physics gravity={[0, -9.81, 0]}>
        <FormulaTrack />
        <F1Car speed={speed} steering={steering} />
      </Physics>
    </Canvas>
  );
};

export default RaceScene;

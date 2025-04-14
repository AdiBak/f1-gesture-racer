import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import F1Car from "./F1Car";

const BahrainTrack = () => {
    const { scene } = useGLTF("/models/Formula_Track.glb");

    return <primitive object={scene} 
                    scale={40}
    position={[-430, 0, -1000]} // aligned with car spawn
    rotation={[0, 23.5, 0]} />;
};


const RaceScene = ({ speed, steering }) => {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <BahrainTrack />
      <F1Car speed={speed} steering={steering} />
      {/* <OrbitControls /> optional for debugging */}
    </Canvas>
  );
};

export default RaceScene;

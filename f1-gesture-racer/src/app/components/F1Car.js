"use client";
import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const F1Car = ({ speed, steering }) => {
  const { scene } = useGLTF("/models/f1car.glb");
  const groupRef = useRef();
  const { camera } = useThree();

  // Use persistent refs to hold the current position and heading (angle in radians)
  const position = useRef(new THREE.Vector3(0, 0.3, 0));
  const heading = useRef(0); // initial heading, in radians
  const quaternion = useRef(new THREE.Quaternion());

  useFrame((state, delta) => {
    // Accumulate heading change from steering input.
    // Here steering is in degrees; we convert the steering value to a rate.
    // Adjust the factor (0.5 here) as needed to change turning sensitivity.
    // Delta is the elapsed time since the last frame.
    const steeringRate = THREE.MathUtils.degToRad(steering * 0.5);
    heading.current += steeringRate * delta;

    // Update quaternion from heading.
    quaternion.current.setFromAxisAngle(new THREE.Vector3(0, 1, 0), heading.current);

    // Determine the forward direction from the car's heading.
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion.current);

    // Move the car based on speed; adjust the divisor to tune acceleration.
    const distanceTraveled = speed / 80; // adjust as needed
    position.current.add(forward.multiplyScalar(distanceTraveled));

    // Update the car's visual transform.
    if (groupRef.current) {
      groupRef.current.position.copy(position.current);
      groupRef.current.quaternion.copy(quaternion.current);
    }

    // Camera follow logic:
    // Offset the camera behind and above the car.
    // (Try tweaking these numbers for your ideal view.)
    const chaseOffset = new THREE.Vector3(0, 5, 10).applyQuaternion(quaternion.current);
    const camPos = new THREE.Vector3().copy(position.current).add(chaseOffset);
    camera.position.lerp(camPos, 0.1);
    camera.lookAt(position.current);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={0.05} />
    </group>
  );
};

export default F1Car;

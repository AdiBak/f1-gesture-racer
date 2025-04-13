"use client";

import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef, useEffect } from "react";

const F1Car = ({ speed, steering }) => {
  const { scene } = useGLTF("/models/f1car.glb");
  const rigidRef = useRef();
  const carPositionRef = useRef(new THREE.Vector3(10, 12.5, 60));
  const carRotationRef = useRef(new THREE.Quaternion());
  const velocityRef = useRef(new THREE.Vector3());
  const { camera } = useThree();
  
  // Camera state
  const cameraPositionRef = useRef(new THREE.Vector3(10, 15, 70)); // Start behind car
  const cameraTargetRef = useRef(new THREE.Vector3(10, 12.5, 60)); // Look at car
  
  // Initialize camera on mount
  useEffect(() => {
    camera.position.copy(cameraPositionRef.current);
    camera.lookAt(cameraTargetRef.current);
  }, [camera]);

  useFrame((state, delta) => {
    const body = rigidRef.current;
    if (!body) return;

    // Get current car state
    const pos = body.translation();
    const rot = body.rotation();
    
    // Update our refs with current position/rotation
    carPositionRef.current.set(pos.x, pos.y, pos.z);
    carRotationRef.current.set(rot.x, rot.y, rot.z, rot.w);
    
    // Calculate forward direction based on current rotation
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(carRotationRef.current);
    
    // Gradually change velocity instead of setting it directly
    // This prevents the jerky motion
    const targetVelocity = forward.clone().multiplyScalar(speed / 20);
    const currentVel = body.linvel();
    const currentVelocity = new THREE.Vector3(currentVel.x, currentVel.y, currentVel.z);
    
    // Smoothly interpolate to target velocity
    velocityRef.current.lerp(targetVelocity, delta * 2.5);
    
    // Apply the smoothed velocity
    body.setLinvel({ 
      x: velocityRef.current.x, 
      y: currentVel.y, // Keep vertical velocity (for gravity)
      z: velocityRef.current.z 
    }, true);
    
    // Apply turning with dampening to reduce jitter
    const turnAmount = steering / 40; // Reduced steering intensity
    body.setAngvel({ x: 0, y: turnAmount, z: 0 }, true);
    
    // === INDEPENDENT CAMERA SYSTEM ===
    // 1. Calculate ideal camera position based on car
    const idealOffset = new THREE.Vector3(0, 3.5, 12); // Camera offset from car
    idealOffset.applyQuaternion(carRotationRef.current); // Rotate offset with car
    
    const idealPosition = new THREE.Vector3().copy(carPositionRef.current).add(idealOffset);
    
    // 2. Smoothly move camera toward ideal position (independent of car physics)
    cameraPositionRef.current.lerp(idealPosition, delta * 3.0); // Adjust smoothing factor
    
    // 3. Update camera target with some lag (creates natural follow feeling)
    cameraTargetRef.current.lerp(carPositionRef.current, delta * 5.0);
    
    // 4. Apply camera position and look
    camera.position.copy(cameraPositionRef.current);
    
    // Rather than using lookAt (which can cause jitter), use slerp for rotation
    const lookMatrix = new THREE.Matrix4().lookAt(
      camera.position,
      cameraTargetRef.current,
      new THREE.Vector3(0, 1, 0)
    );
    const targetQuat = new THREE.Quaternion().setFromRotationMatrix(lookMatrix);
    camera.quaternion.slerp(targetQuat, delta * 4.0);
  });

  return (
    <RigidBody
      ref={rigidRef}
      colliders="cuboid"
      mass={1}
      position={[10, 12.5, 60]} // starting on the track
      linearDamping={2.5} // Increased damping to reduce bouncing
      angularDamping={2.0} // Increased damping for smoother turns
      enabledRotations={[false, true, false]}
      friction={0.7} // Added friction to reduce sliding
    >
      <primitive object={scene} scale={0.05} />
    </RigidBody>
  );
};

export default F1Car;
import { useRef } from "react";
import { useCompoundBody } from "@react-three/cannon";
import { exp } from "@tensorflow/tfjs";

export const useWheels = (width, height, frontOffset, radius) => {
  const wheels = [useRef(), useRef(), useRef(), useRef()];

  const wheelInfo = {
    radius,
    directionLocal: [0, -1, 0],
    axleLocal: [1, 0, 0],
    suspensionStiffness: 60,
    suspensionRestLength: 0.1,
    frictionSlip: 5,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    maxSuspensionTravel: 0.1,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
  };

  const wheelInfos = [
    { ...wheelInfo, chassisConnectionPointLocal: [-width, height,  frontOffset], isFrontWheel: true },
    { ...wheelInfo, chassisConnectionPointLocal: [ width, height,  frontOffset], isFrontWheel: true },
    { ...wheelInfo, chassisConnectionPointLocal: [-width, height, -frontOffset], isFrontWheel: false },
    { ...wheelInfo, chassisConnectionPointLocal: [ width, height, -frontOffset], isFrontWheel: false },
  ];

  const wheelShape = {
    args: [radius, radius, 0.015, 16],
    rotation: [0, 0, -Math.PI / 2],
    type: "Cylinder",
  };

  const props = () => ({
    collisionFilterGroup: 0,
    mass: 1,
    shapes: [wheelShape],
    type: "Kinematic",
  });

  wheels.forEach((ref) => useCompoundBody(props, ref));

  return [wheels, wheelInfos];
};

export default useWheels;
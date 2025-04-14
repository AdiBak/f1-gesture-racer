// useWheels.js
import { useCompoundBody } from "@react-three/cannon";
import { useRef } from "react";

export const useWheels = (width, height, front, radius) => {
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
    { ...wheelInfo, chassisConnectionPointLocal: [-width, height, front], isFrontWheel: true },
    { ...wheelInfo, chassisConnectionPointLocal: [ width, height, front], isFrontWheel: true },
    { ...wheelInfo, chassisConnectionPointLocal: [-width, height, -front], isFrontWheel: false },
    { ...wheelInfo, chassisConnectionPointLocal: [ width, height, -front], isFrontWheel: false },
  ];

  const propsFunc = () => ({
    collisionFilterGroup: 0,
    mass: 1,
    shapes: [
      {
        args: [radius, radius, 0.015, 16],
        rotation: [0, 0, -Math.PI / 2],
        type: "Cylinder",
      },
    ],
    type: "Kinematic",
  });

  wheels.forEach((ref) => useCompoundBody(propsFunc, ref));
  return [wheels, wheelInfos];
};

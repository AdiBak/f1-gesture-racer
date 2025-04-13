"use client";

import { useState, useRef, useEffect } from "react";
import HandTracker from "./components/HandTracker";
import RaceScene from "./components/RaceScene";
import RaceHUD from "./components/RaceHUD";

export default function Home() {
  const [speed, setSpeed] = useState(0);
  const [steeringAngle, setSteeringAngle] = useState(0);
  const [gear, setGear] = useState("Idle");
  const [direction, setDirection] = useState("Straight");

  const handTrackerRef = useRef();
  const miniCamRef = useRef();

  useEffect(() => {
    const webcamVideo = handTrackerRef.current?.getVideoElement?.();
    const miniCam = miniCamRef.current;

    if (webcamVideo && miniCam && webcamVideo.srcObject) {
      miniCam.srcObject = webcamVideo.srcObject;
    }
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      {/* === 3D Track + Car Scene === */}
      <RaceScene speed={speed} steering={steeringAngle} />

      {/* === Central HUD Bar === */}
      <RaceHUD speed={speed} gear={gear} direction={direction} />

      {/* === Stable Mini Handcam View === */}
      <div className="absolute top-4 left-4 w-48 h-36 border-2 border-white rounded overflow-hidden z-50 shadow-lg">
        <video
          ref={miniCamRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
          style={{ transform: "scaleX(-1)" }}
        />
      </div>

      {/* === Invisible Gesture Detection Engine === */}
      <div className="absolute bottom-4 left-4 w-[320px] h-[240px] z-0 opacity-0 pointer-events-none">
        <HandTracker
          ref={handTrackerRef}
          onSpeedChange={setSpeed}
          onSteeringChange={setSteeringAngle}
          onGearChange={setGear}
          onDirectionChange={setDirection}
        />
      </div>
    </main>
  );
}

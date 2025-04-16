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
    const interval = setInterval(() => {
      const webcamVideo = handTrackerRef.current?.getVideoElement?.();
      const miniCam = miniCamRef.current;
  
      if (webcamVideo && miniCam && webcamVideo.srcObject) {
        miniCam.srcObject = webcamVideo.srcObject;
        clearInterval(interval); // ✅ once it's set, stop checking
      }
    }, 300); // retry every 300ms
  
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      {/* === 3D Track + Car Scene === */}
      <RaceScene speed={speed} steering={steeringAngle} />

      {/* === Central HUD Bar === */}
      <RaceHUD speed={speed} gear={gear} direction={direction} />

      {/* === Stable Mini Handcam View === */}
      <div className="absolute top-4 left-4 w-[180px] h-[120px] border-2 border-white rounded z-50 shadow-lg">
      <HandTracker
          ref={handTrackerRef}
          onSpeedChange={setSpeed}
          onSteeringChange={setSteeringAngle}
          onGearChange={setGear}
          onDirectionChange={setDirection}
        /> 
        <video
          ref={miniCamRef}
          className="w-full h-full"
          autoPlay
          playsInline
          muted
          style={{ transform: "scaleX(-1)" }}
        />
      </div>

    </main>
  );
}

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

  const [videoEl, setVideoEl] = useState(null);

  useEffect(() => {
    const el = handTrackerRef.current?.getVideoElement?.();
    if (el) setVideoEl(el);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 3D Scene */}
      <RaceScene speed={speed} steering={steeringAngle} />

      {/* HUD Overlay */}
      <RaceHUD speed={speed} gear={gear} direction={direction} />

      {/* Mini Webcam Feed */}
      {videoEl && (
        <div className="absolute top-4 left-4 w-48 h-36 rounded overflow-hidden border-2 border-white z-50 shadow-md">
          <video
            ref={(node) => {
              if (node && videoEl) node.srcObject = videoEl.srcObject;
            }}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            style={{ transform: "scaleX(-1)" }}
          />
        </div>
      )}

      {/* Hand Gesture Engine (hidden behind the scenes) */}
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

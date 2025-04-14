"use client";

import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import SteeringWheelHUD from "./SteeringWheelHUD";

const HandTracker = forwardRef(
  ({ onSpeedChange, onSteeringChange, onGearChange, onDirectionChange }, ref) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [debugInfo, setDebugInfo] = useState({});
    const [actualSpeed, setActualSpeed] = useState(0);

    useImperativeHandle(ref, () => ({
      getVideoElement: () => webcamRef.current,
    }));

    const distance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
    const isFingerPointingUp = (tip, base) => tip.y < base.y - 0.05;

    const normalizeAngle = (rawAngle) => {
      let angle = rawAngle;
      if (angle > 90) angle -= 180;
      if (angle < -90) angle += 180;
      return angle;
    };

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

    useEffect(() => {
      const setup = async () => {
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

        const hands = new window.Hands({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.8,
          minTrackingConfidence: 0.8,
        });

        hands.onResults((results) => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          let debug = {};
          const handsDetected = results.multiHandLandmarks.length;
          debug.handsDetected = handsDetected;

          if (handsDetected === 2) {
            const [hand1, hand2] = results.multiHandLandmarks;
            const [info1, info2] = results.multiHandedness;

            const isHand1Left = info1.label === "Left";
            const leftHand = isHand1Left ? hand1 : hand2;
            const rightHand = isHand1Left ? hand2 : hand1;

            const rightIndexUp = isFingerPointingUp(rightHand[8], rightHand[5]);
            const leftIndexUp = isFingerPointingUp(leftHand[8], leftHand[5]);

            const gear = rightIndexUp
              ? "BRAKE"
              : leftIndexUp
              ? "ACCELERATE"
              : "Idle";
            debug.gear = gear;
            onGearChange(gear);

            const leftMid = {
              x: (leftHand[4].x + leftHand[8].x) / 2,
              y: (leftHand[4].y + leftHand[8].y) / 2,
            };
            const rightMid = {
              x: (rightHand[4].x + rightHand[8].x) / 2,
              y: (rightHand[4].y + rightHand[8].y) / 2,
            };

            const rawAngle =
              (Math.atan2(rightMid.y - leftMid.y, rightMid.x - leftMid.x) *
                180) /
              Math.PI;

            const normalizedAngle = normalizeAngle(rawAngle);
            const clampedAngle = Math.max(-180, Math.min(180, normalizedAngle));

            const direction =
              clampedAngle > 10
                ? "LEFT"
                : clampedAngle < -10
                ? "RIGHT"
                : "Straight";

            onDirectionChange(direction);
            onSteeringChange(clampedAngle);
            debug.clampedAngle = clampedAngle;

            ctx.beginPath();
            ctx.moveTo(leftMid.x * canvas.width, leftMid.y * canvas.height);
            ctx.lineTo(rightMid.x * canvas.width, rightMid.y * canvas.height);
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 5;
            ctx.stroke();
          }

          setDebugInfo(debug);
        });

        const videoEl = webcamRef.current;
        if (videoEl && videoEl instanceof HTMLVideoElement) {
          const camera = new window.Camera(videoEl, {
            onFrame: async () => {
              await hands.send({ image: videoEl });
            },
            width: 640,
            height: 480,
          });
          camera.start();
        }
      };

      setup();
    }, [onGearChange, onDirectionChange, onSteeringChange]);

    useEffect(() => {
      const interval = setInterval(() => {
        setActualSpeed((prev) => {
          const gear = debugInfo.gear;
          let next = prev;

          if (gear === "ACCELERATE") next = Math.min(prev + 2, 200);
          else if (gear === "BRAKE") next = Math.max(prev - 5, 0);
          else next = Math.max(prev - 1, 0);

          return next;
        });
      }, 50);

      return () => clearInterval(interval);
    }, [debugInfo.gear]);

    useEffect(() => {
      onSpeedChange(actualSpeed);
    }, [actualSpeed]);

    return (
      <div className="relative w-full h-full">
        <video
          ref={webcamRef}
          className="absolute w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 z-10"
        />
        <SteeringWheelHUD
          angle={Number(debugInfo?.clampedAngle || 0)}
          accelerating={debugInfo?.gear === "ACCELERATE"}
          braking={debugInfo?.gear === "BRAKE"}
        />
      </div>
    );
  }
);

export default HandTracker;

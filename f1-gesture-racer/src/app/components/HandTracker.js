"use client";

import SteeringWheelHUD from "./SteeringWheelHUD";
import RaceHUD from "./RaceHUD";
import React, { useRef, useEffect, useState } from "react";

const normalizeAngle = (rawAngle) => {
    let angle = rawAngle;
    if (angle > 90) angle -= 180;
    if (angle < -90) angle += 180;
    return angle;
};

const HandTracker = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [debugInfo, setDebugInfo] = useState({});
    const [hudData, setHudData] = useState({
        speed: 0,
        gear: "Idle",
        direction: "Straight",
    });
    const [actualSpeed, setActualSpeed] = useState(0); // Real physics-like speed


    const distance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
    const isFingerPointingUp = (tip, base) => tip.y < base.y - 0.1;

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve(); // already loaded
                return;
            }

            const script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        const setup = async () => {
            try {
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
                        const leftHand = isHand1Left ? hand2 : hand1;
                        const rightHand = isHand1Left ? hand1 : hand2;

                        // === Finger Up Detection ===
                        const rightIndexUp = isFingerPointingUp(rightHand[8], rightHand[5]);
                        const leftIndexUp = isFingerPointingUp(leftHand[8], leftHand[5]);

                        if (rightIndexUp) {
                            console.log("🟢 ACCELERATE");
                            debug.acceleration = "ACCELERATE";
                        }

                        if (leftIndexUp) {
                            console.log("🛑 BRAKE");
                            debug.brake = "BRAKE";
                        }

                        debug.rightIndexUp = rightIndexUp;
                        debug.leftIndexUp = leftIndexUp;

                        // === Steering: Allow steering if both hands are present ===
                        const leftMid = {
                            x: (leftHand[4].x + leftHand[8].x) / 2,
                            y: (leftHand[4].y + leftHand[8].y) / 2,
                        };
                        const rightMid = {
                            x: (rightHand[4].x + rightHand[8].x) / 2,
                            y: (rightHand[4].y + rightHand[8].y) / 2,
                        };

                        ctx.beginPath();
                        ctx.moveTo(leftMid.x * canvas.width, leftMid.y * canvas.height);
                        ctx.lineTo(rightMid.x * canvas.width, rightMid.y * canvas.height);
                        ctx.strokeStyle = "yellow";
                        ctx.lineWidth = 5;
                        ctx.stroke();

                        const rawAngle =
                            (Math.atan2(rightMid.y - leftMid.y, rightMid.x - leftMid.x) * 180) / Math.PI;

                        const normalizedAngle = normalizeAngle(rawAngle);
                        const clampedAngle = Math.max(-30, Math.min(30, normalizedAngle));

                        debug.rawPencilAngle = rawAngle.toFixed(2);
                        debug.normalizedAngle = normalizedAngle.toFixed(2);
                        debug.clampedAngle = clampedAngle.toFixed(2);

                        // Use clampedAngle for gameplay logic
                        if (clampedAngle > 10) {
                            console.log("↪️ STEER LEFT");
                            debug.steering = "LEFT";
                        } else if (clampedAngle < -10) {
                            console.log("↩️ STEER RIGHT");
                            debug.steering = "RIGHT";
                        } else {
                            console.log("⬆️ STRAIGHT");
                            debug.steering = "STRAIGHT";
                        }


                        // Draw landmarks
                        [leftHand, rightHand].forEach((hand, i) => {
                            ctx.fillStyle = i === 0 ? "blue" : "green";
                            hand.forEach((pt) => {
                                ctx.beginPath();
                                ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 5, 0, 2 * Math.PI);
                                ctx.fill();
                            });
                        });

                        // Optionally: show whether user is "probably" holding pencil
                        const leftPinch = distance(leftHand[4], leftHand[8]) < 0.1;
                        const rightPinch = distance(rightHand[4], rightHand[8]) < 0.1;
                        debug.holdingPencil = leftPinch && rightPinch;
                    }

                    setDebugInfo(debug);

                    const accelerating = debug.acceleration === "ACCELERATE";
                    const braking = debug.brake === "BRAKE";
                    setHudData({
                        speed: accelerating ? 120 : braking ? 30 : 80, // placeholder logic
                        gear: accelerating ? "ACCELERATE" : braking ? "BRAKE" : "Idle",
                        direction: debug.steering || "Straight",
                    });
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
            } catch (err) {
                console.error("Failed to load MediaPipe scripts", err);
            }
        };

        setup();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActualSpeed((prev) => {
                if (hudData.gear === "ACCELERATE") {
                    return Math.min(prev + 2, 200); // accelerate to max 200
                } else if (hudData.gear === "BRAKE") {
                    return Math.max(prev - 5, 0); // brake hard
                } else {
                    return Math.max(prev - 1, 0); // coast slowly
                }
            });
        }, 50); // update every 50ms

        return () => clearInterval(interval);
    }, [hudData.gear]);


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
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white p-2 z-20 text-xs">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>

            <RaceHUD
                speed={Math.round(actualSpeed)}
                gear={hudData.gear}
                direction={hudData.direction}
            />

            <SteeringWheelHUD
                angle={Number(debugInfo?.clampedAngle || 0)}
                accelerating={debugInfo?.acceleration === "ACCELERATE"}
                braking={debugInfo?.brake === "BRAKE"}
            />
        </div>
    );
};

export default HandTracker;

import React from "react";

const SteeringWheelHUD = ({ angle = 0, accelerating, braking }) => {
  const wheelStyle = {
    transform: `rotate(${-angle}deg)`,
    transition: "transform 0.1s linear",
    filter: accelerating
      ? "drop-shadow(0 0 10px lime)"
      : braking
      ? "drop-shadow(0 0 10px red)"
      : "none",
  };

  return (
    <div className="absolute bottom-24 right-4 z-50 flex flex-col items-center text-white text-sm">
      <div className="w-44 h-32 relative">
        <img
          src="/steering-wheel.png"
          alt="Steering Wheel"
          style={wheelStyle}
          className="w-full h-full"
        />
      </div>
      <div className="mt-2 bg-black bg-opacity-70 px-3 py-1 rounded">
        <p>Steering: {angle.toFixed(1)}°</p>
        <p>
          {accelerating
            ? "🟢 Accelerating"
            : braking
            ? "🛑 Braking"
            : "⚪ Idle"}
        </p>
      </div>
    </div>
  );
};

export default SteeringWheelHUD;

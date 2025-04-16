import React from "react";

const RaceHUD = ({ speed = 0, gear = "Idle", direction = "Straight" }) => {
  const gearColor =
    gear === "ACCELERATE" ? "text-green-400" : gear === "BRAKE" ? "text-red-400" : "text-gray-300";

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-black bg-opacity-70 text-white px-6 py-2 rounded-xl flex gap-6 text-sm md:text-base font-mono tracking-wide shadow-lg">
        <span>Speed: {Math.round(speed)} km/h</span>
        <span className={`${gearColor}`}>{gear}</span>
        <span>Direction: {direction}</span>
      </div>
    </div>
  );
};

export default RaceHUD;

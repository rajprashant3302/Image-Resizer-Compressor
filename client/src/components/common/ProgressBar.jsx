import React from "react";

export default function ProgressBar({ progress = 0, label }) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <div className="text-sm text-gray-600 mb-1">
          {label}: {progress}%
        </div>
      )}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-4 bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

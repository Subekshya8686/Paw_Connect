import React from "react";

const LoadingScreen = () => {
  return (
    <div className="w-full h-[100%] flex items-center justify-center bg-gray-100 bg-opacity-50">
      <div className="flex flex-col items-center space-y-4">
        <span className="loading loading-spinner loading-xl"></span>
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

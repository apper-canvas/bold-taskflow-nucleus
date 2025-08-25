import React from "react";

const Loading = ({ rows = 6 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="w-5 h-5 bg-gray-200 rounded border"></div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="flex items-center space-x-2">
                <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;
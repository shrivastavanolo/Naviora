import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-b-emerald-500 border-t-indigo-500"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

"use client";

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500 ${className || "w-8 h-8"}`}></div>
  );
}

"use client";

interface ToastProps {
  show: boolean;
  message: string;
}

export default function Toast({
  show,
  message,
}: ToastProps) {
  if (!show) return null;

  return (
    <div
      className="
      fixed
      top-8
      right-8
      z-[9999]
      rounded-xl
      border
      border-emerald-500
      bg-emerald-600
      px-6
      py-4
      text-white
      shadow-2xl
      text-sm
      font-medium
    "
    >
      {message}
    </div>
  );
}
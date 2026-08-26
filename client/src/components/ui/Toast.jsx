import React from "react";

const Toast = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[99999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl transition-all transform animate-bounce text-white font-semibold text-sm ${
        type === "success"
          ? "bg-emerald-600 shadow-emerald-200"
          : type === "error"
          ? "bg-red-600 shadow-red-200"
          : "bg-blue-600 shadow-blue-200"
      }`}
    >
      <i
        className={`fas ${
          type === "success"
            ? "fa-check-circle"
            : type === "error"
            ? "fa-exclamation-circle"
            : "fa-info-circle"
        } text-lg`}
      />
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-70 text-white/80"
        >
          <i className="fas fa-times text-xs"></i>
        </button>
      )}
    </div>
  );
};

export default Toast;

import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  const typeConfig = {
    success: {
      bg: "bg-slate-900/95 text-white border-emerald-500/40 shadow-emerald-950/20",
      iconBg: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      icon: "fa-check",
      badge: "text-emerald-400",
    },
    error: {
      bg: "bg-slate-900/95 text-white border-red-500/40 shadow-red-950/20",
      iconBg: "bg-red-500/20 text-red-400 border border-red-500/30",
      icon: "fa-circle-exclamation",
      badge: "text-red-400",
    },
    info: {
      bg: "bg-slate-900/95 text-white border-sky-500/40 shadow-sky-950/20",
      iconBg: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
      icon: "fa-circle-info",
      badge: "text-sky-400",
    },
  };

  const current = typeConfig[type] || typeConfig.success;

  return (
    <div className="fixed bottom-6 right-6 z-[99999] max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl ${current.bg}`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${current.iconBg}`}
        >
          <i className={`fas ${current.icon}`}></i>
        </div>

        <div className="flex-1 pr-2">
          <p className="text-xs font-semibold text-slate-100 leading-snug">
            {message}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close notification"
          >
            <i className="fas fa-times text-[10px]"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;

"use client";

import { useEditorStore } from "@/store/editorStore";
import { useEffect } from "react";
import { X, AlertCircle, CheckCircle2, Info } from "lucide-react";

export function Toast() {
  const { notification, clearNotification } = useEditorStore();

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      clearNotification();
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification, clearNotification]);

  if (!notification) return null;

  const styles = {
    error: {
      bg: "bg-red-50 border-red-400",
      text: "text-red-800",
      icon: <AlertCircle size={18} className="text-red-600 flex-shrink-0" />,
    },
    success: {
      bg: "bg-green-50 border-green-400",
      text: "text-green-800",
      icon: <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />,
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-400",
      text: "text-yellow-800",
      icon: <AlertCircle size={18} className="text-yellow-600 flex-shrink-0" />,
    },
    info: {
      bg: "bg-blue-50 border-blue-400",
      text: "text-blue-800",
      icon: <Info size={18} className="text-blue-600 flex-shrink-0" />,
    },
  };

  const style = styles[notification.type];

  return (
    <div className="fixed top-4 right-4 z-[100] max-w-sm animate-slide-in">
      <div
        className={`${style.bg} border rounded-lg shadow-lg p-4 flex items-start gap-3`}
      >
        {style.icon}
        <div className="flex-1">
          {notification.title && (
            <p className={`font-semibold text-sm ${style.text}`}>
              {notification.title}
            </p>
          )}
          <p className={`text-sm ${style.text}`}>{notification.message}</p>
        </div>
        <button
          onClick={clearNotification}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

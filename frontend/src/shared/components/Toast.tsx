
import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";

function Toast() {
  const message = useNotificationStore(
    (state) => state.message
  );

  const isVisible = useNotificationStore(
    (state) => state.isVisible
  );

  const hideNotification = useNotificationStore(
    (state) => state.hideNotification
  );

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      hideNotification();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isVisible, message, hideNotification]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        fixed bottom-5 right-5 z-50
        max-w-sm rounded-lg
        border border-gray-200
        bg-white px-5 py-3
        text-gray-800 shadow-lg
        transition-colors duration-200
        dark:border-slate-600
        dark:bg-slate-800
        dark:text-slate-100
        dark:shadow-black/40
      "
    >
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">
          {message}
        </span>

        <button
          type="button"
          onClick={hideNotification}
          aria-label="Cerrar notificación"
          className="
            text-lg font-bold
            text-gray-500 hover:text-gray-900
            dark:text-slate-400
            dark:hover:text-white
          "
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;

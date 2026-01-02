import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeToast } from "../../store/slices/toastSlice";

const Toast = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.toast.toasts);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toasts[0].id));
      }, toasts[0].duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-success/95 text-white border-success";
      case "error":
        return "bg-error/95 text-white border-error";
      case "warning":
        return "bg-warning/95 text-white border-warning";
      case "info":
      default:
        return "bg-gray-900/95 text-white border-gray-900";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "info":
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto
            min-w-[320px] max-w-md
            flex items-start gap-3
            px-5 py-4
            rounded-2xl
            border-2
            backdrop-blur-xl
            shadow-2xl
            transform transition-all duration-500 ease-out
            ${getToastStyles(toast.type)}
            ${index === 0 ? "animate-slide-in-right" : "opacity-90"}
          `}
          style={{
            animation: index === 0 ? "slideInRight 0.5s ease-out" : "none",
          }}
        >
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="font-bold text-sm mb-1">
                {toast.title}
              </p>
            )}
            <p className="text-sm opacity-95 break-words">
              {toast.message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => dispatch(removeToast(toast.id))}
            className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;

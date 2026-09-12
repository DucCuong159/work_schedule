import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

const Toast = ({ message, onClose }: Readonly<ToastProps>) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-100 flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-2xl text-sm pointer-events-auto">
      <span>⚠️</span>
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-3 text-gray-400 hover:text-white cursor-pointer text-xs"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;

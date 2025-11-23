import React from "react";

const ToastContainer = ({ toasts, removeToast }) => {
  
  const getIcon = (type) => {
    switch (type) {
      case "success": return "✓";
      case "error": return "✕";
      case "warning": return "⚠";
      default: return "✓";
    }
  };

  return (
    <div id="toastContainer" className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type} show`}>
          <div className="toast-content">
            <span className="toast-icon">{getIcon(toast.type)}</span>
            <span className="toast-message">{toast.message}</span>
          </div>
          <button 
            className="toast-close" 
            onClick={() => removeToast(toast.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
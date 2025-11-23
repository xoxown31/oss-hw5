import React from "react";

const ConfirmModal = ({ isOpen, close, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal" style={{ display: "block" }}>
      <div className="confirm-modal-content">
        <div className="confirm-icon">⚠️</div>
        <p className="confirm-message">
          Are you sure you want to delete this student? This action cannot be undone.
        </p>
        <div className="confirm-buttons">
          <button className="modal-btn modal-btn-cancel" onClick={close}>Cancel</button>
          <button className="modal-btn" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
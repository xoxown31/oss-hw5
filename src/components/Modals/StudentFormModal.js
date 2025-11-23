import React from "react";

const StudentFormModal = ({ isOpen, close, mode, data, onChange, onSubmit }) => {
  if (!isOpen) return null;

  const title = mode === "add" ? "Add New Student" : "Edit Student Information";
  const submitText = mode === "add" ? "Add Student" : "Update Student";

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <span className="close" onClick={close}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label" htmlFor="formName">Full Name</label>
            <input 
              type="text" 
              id="formName" 
              name="name" 
              className="form-input" 
              placeholder="Enter full name" 
              value={data.name} 
              onChange={onChange} 
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="formAge">Age</label>
            <input 
              type="text" 
              id="formAge" 
              name="age" 
              className="form-input" 
              placeholder="Enter age" 
              value={data.age} 
              onChange={onChange} 
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="formEmail">Email Address</label>
            <input 
              type="text" 
              id="formEmail" 
              name="email" 
              className="form-input" 
              placeholder="Enter email" 
              value={data.email} 
              onChange={onChange} 
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="formCity">City</label>
            <input 
              type="text" 
              id="formCity" 
              name="city" 
              className="form-input" 
              placeholder="Enter city" 
              value={data.city} 
              onChange={onChange} 
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={close}>Cancel</button>
          <button className="modal-btn" onClick={onSubmit}>{submitText}</button>
        </div>
      </div>
    </div>
  );
};

export default StudentFormModal;
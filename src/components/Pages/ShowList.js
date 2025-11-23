import React, { useState, useEffect } from "react";

const ShowList = () => {
  const apiUrl = "https://6909a7b12d902d0651b49b1c.mockapi.io/students";

  // State
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal Visibility
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({ name: "", age: "", email: "", city: "" });
  const [selectedId, setSelectedId] = useState(null);
  
  // Toast
  const [toasts, setToasts] = useState([]);

  // --- API Functions ---
  const getStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error(error);
      addToast("Failed to load data", "error");
    }
    setLoading(false);
  };

  const postData = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch(`${apiUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ ...formData, age: parseInt(formData.age) }),
      });
      if (res.status === 201) {
        addToast("Student added successfully!", "success");
        closeModals();
        getStudents();
      } else {
        addToast("Failed to add student.", "error");
      }
    } catch (error) {
      addToast("Error occurred.", "error");
    }
  };

  const updateData = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch(`${apiUrl}/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ ...formData, age: parseInt(formData.age) }),
      });
      if (res.status === 200) {
        addToast("Student updated successfully!", "success");
        closeModals();
        getStudents();
      } else {
        addToast("Failed to update student.", "error");
      }
    } catch (error) {
      addToast("Error occurred.", "error");
    }
  };

  const deleteData = async () => {
    try {
      const res = await fetch(`${apiUrl}/${selectedId}`, {
        method: "DELETE",
      });
      if (res.status === 200) {
        addToast("Student deleted successfully.", "success");
        closeConfirmModalFn();
        getStudents();
      } else {
        addToast("Failed to delete student.", "error");
      }
    } catch (error) {
      addToast("Error occurred.", "error");
    }
  };

  // --- Helper Functions ---
  const validateForm = () => {
    const { name, age, email, city } = formData;
    if (!name.trim() || !String(age).trim() || !email.trim() || !city.trim()) {
      addToast("Please fill in all fields.", "warning");
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let field = "";
    if (id.includes("Name")) field = "name";
    else if (id.includes("Age")) field = "age";
    else if (id.includes("Email")) field = "email";
    else if (id.includes("City")) field = "city";
    
    setFormData({ ...formData, [field]: value });
  };

  // --- Modal Control ---
  const openAddModalFn = () => {
    setFormData({ name: "", age: "", email: "", city: "" });
    setShowAddModal(true);
  };

  const openEditModalFn = (student) => {
    setFormData({ 
      name: student.name, 
      age: student.age, 
      email: student.email, 
      city: student.city 
    });
    setSelectedId(student.id);
    setShowEditModal(true);
  };

  const openConfirmModalFn = (id) => {
    setSelectedId(id);
    setShowConfirmModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const closeConfirmModalFn = () => {
    setShowConfirmModal(false);
    setSelectedId(null);
  };

  // --- Toast Logic ---
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- JSX Rendering ---
  return (
    <>
      <div className="container">
        <h1>Student Management System</h1>

        <div className="button-group">
          <button id="btnStu" onClick={getStudents}>Load Student Data</button>
          <button id="btnAdd" onClick={openAddModalFn}>Add New Student</button>
        </div>

        <div id="contents">
            {loading ? (
                <div className="loading"><div className="spinner"></div>Loading...</div>
            ) : (
                <ul>
                    {students.map((student) => (
                    <li key={student.id}>
                        <div className="student-details">
                            <div className="student-name">
                                {student.name} ({student.age} years old)
                            </div>
                            <div className="student-info">
                                {student.email} | {student.city}
                            </div>
                        </div>
                        <div className="button-container">
                            <button 
                                className="modify-btn" 
                                onClick={() => openEditModalFn(student)}
                            >
                                Edit
                            </button>
                            <button 
                                className="delete-btn" 
                                onClick={() => openConfirmModalFn(student.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                    ))}
                </ul>
            )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div id="addModal" className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add New Student</h2>
              <span className="close" onClick={closeModals}>&times;</span>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="modalName">Full Name</label>
                <input type="text" id="modalName" className="form-input" placeholder="Enter full name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="modalAge">Age</label>
                <input type="text" id="modalAge" className="form-input" placeholder="Enter age" value={formData.age} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="modalEmail">Email Address</label>
                <input type="text" id="modalEmail" className="form-input" placeholder="Enter email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="modalCity">City</label>
                <input type="text" id="modalCity" className="form-input" placeholder="Enter city" value={formData.city} onChange={handleInputChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn modal-btn-cancel" onClick={closeModals}>Cancel</button>
              <button className="modal-btn" onClick={postData}>Add Student</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div id="editModal" className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Student Information</h2>
              <span className="close" onClick={closeModals}>&times;</span>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="editName">Full Name</label>
                <input type="text" id="editName" className="form-input" placeholder="Enter full name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="editAge">Age</label>
                <input type="text" id="editAge" className="form-input" placeholder="Enter age" value={formData.age} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="editEmail">Email Address</label>
                <input type="text" id="editEmail" className="form-input" placeholder="Enter email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="editCity">City</label>
                <input type="text" id="editCity" className="form-input" placeholder="Enter city" value={formData.city} onChange={handleInputChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn modal-btn-cancel" onClick={closeModals}>Cancel</button>
              <button className="modal-btn" onClick={updateData}>Update Student</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div id="confirmModal" className="confirm-modal" style={{ display: "block" }}>
          <div className="confirm-modal-content">
            <div className="confirm-icon">⚠️</div>
            <p id="confirmMessage" className="confirm-message">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <div className="confirm-buttons">
              <button className="modal-btn modal-btn-cancel" onClick={closeConfirmModalFn}>Cancel</button>
              <button className="modal-btn" onClick={deleteData}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <div id="toastContainer" className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type} show`}>
            <div className="toast-content">
              <span className="toast-icon">
                {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "⚠"}
              </span>
              <span className="toast-message">{toast.message}</span>
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>&times;</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ShowList;
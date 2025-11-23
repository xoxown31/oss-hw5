import React, { useState } from "react";
import StudentFormModal from "../Modals/StudentFormModal";
import ConfirmModal from "../Modals/ConfirmModal";
import ToastContainer from "../Toast/ToastContainer";

const ShowList = () => {
  const apiUrl = "https://6909a7b12d902d0651b49b1c.mockapi.io/students";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // --- Modal States ---
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", age: "", email: "", city: "" });
  const [selectedId, setSelectedId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // --- API Functions ---
  const getStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl);
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
      const res = await fetch(apiUrl, {
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- Modal Control ---
  const openAddModalFn = () => {
    setFormData({ name: "", age: "", email: "", city: "" });
    setModalMode("add"); 
    setShowFormModal(true);
  };

  const openEditModalFn = (student) => {
    setFormData({ 
      name: student.name, 
      age: student.age, 
      email: student.email, 
      city: student.city 
    });
    setSelectedId(student.id);
    setModalMode("edit");
    setShowFormModal(true);
  };

  const openConfirmModalFn = (id) => {
    setSelectedId(id);
    setShowConfirmModal(true);
  };

  const closeModals = () => {
    setShowFormModal(false);
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
                            <button className="modify-btn" onClick={() => openEditModalFn(student)}>Edit</button>
                            <button className="delete-btn" onClick={() => openConfirmModalFn(student.id)}>Delete</button>
                        </div>
                    </li>
                    ))}
                </ul>
            )}
        </div>
      </div>

      <StudentFormModal 
        isOpen={showFormModal} 
        close={closeModals} 
        mode={modalMode} 
        data={formData} 
        onChange={handleInputChange} 
        onSubmit={modalMode === "add" ? postData : updateData} 
      />

      <ConfirmModal 
        isOpen={showConfirmModal} 
        close={closeConfirmModalFn} 
        onConfirm={deleteData} 
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default ShowList;
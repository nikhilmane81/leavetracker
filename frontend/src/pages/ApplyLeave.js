import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const ApplyLeave = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const applyLeave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/leave/apply",
        { start_date: startDate, end_date: endDate, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(true);
    } catch (error) {
      alert("Error applying leave");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/dashboard");
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4">Apply for Leave</h2>
        <form onSubmit={applyLeave}>
          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Reason</label>
            <textarea
              className="form-control"
              placeholder="Enter reason for leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Apply Leave</button>
        </form>
      </div>

      {/* Success Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Leave Applied</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your leave request has been submitted successfully.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Go to Dashboard
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApplyLeave;

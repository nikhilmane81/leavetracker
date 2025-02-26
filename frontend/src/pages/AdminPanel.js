import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

const AdminPanel = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/leave/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaves(res.data);
      } catch (error) {
        console.error("Error fetching leaves", error);
      }
    };

    fetchLeaves();
  }, []);

  const updateLeaveStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/leave/update/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setLeaves((prevLeaves) =>
          prevLeaves.map((leave) =>
            leave.id === id ? { ...leave, status } : leave
          )
        );
      } else {
        console.error("Failed to update leave status");
      }
    } catch (error) {
      console.error("Error updating leave status", error);
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center vh-100"
      style={{
        background: "linear-gradient(to right, #667eea, #764ba2)",
        padding: "20px",
      }}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light shadow-sm p-3 mb-4 rounded w-100"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <h2 className="navbar-brand text-white ms-3">Admin Panel</h2>
        <div className="ms-auto me-3">
          <LogoutButton />
        </div>
      </nav>

      {/* Leave Requests Table */}
      <div
        className="card shadow-lg p-4"
        style={{
          width: "90%",
          maxWidth: "900px",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <h3 className="mb-3 text-white text-center">Leave Requests</h3>
        {leaves.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-light">
                <tr className="text-center">
                  <th>Employee</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id} className="text-center">
                    <td className="fw-bold text-black">{leave.user_name}</td>
                    <td className="text-back">{leave.start_date}</td>
                    <td className="text-black">{leave.end_date}</td>
                    <td className="text-black">{leave.reason}</td>
                    <td>
                      <span
                        className={`badge ${
                          leave.status === "approved"
                            ? "bg-success"
                            : leave.status === "pending"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.status === "pending" && (
                        <>
                          <button
                            className="btn btn-outline-success btn-sm me-2"
                            onClick={() => updateLeaveStatus(leave.id, "approved")}
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => updateLeaveStatus(leave.id, "rejected")}
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-black text-center">No leave requests found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

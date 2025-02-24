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
    <div className="container mt-5">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-3 mb-4 rounded">
        <h2 className="navbar-brand">Admin Panel</h2>
        <div className="ms-auto">
          <LogoutButton />
        </div>
      </nav>

      {/* Leave Requests Table */}
      <div className="card shadow-lg p-4">
        <h3 className="mb-3">Leave Requests</h3>
        {leaves.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
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
                  <tr key={leave.id}>
                    <td>{leave.user_name}</td>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>{leave.reason}</td>
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
                            className="btn btn-success btn-sm me-2"
                            onClick={() => updateLeaveStatus(leave.id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => updateLeaveStatus(leave.id, "rejected")}
                          >
                            Reject
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
          <p className="text-muted">No leave requests found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

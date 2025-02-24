import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const Dashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/leave/my-leaves", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaves(res.data);
      } catch (error) {
        console.error("Error fetching leaves", error);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div className="container mt-4">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-3 mb-4 rounded">
        <h2 className="navbar-brand">Employee Dashboard</h2>
        <div className="ms-auto">
          <button className="btn btn-primary me-2" onClick={() => navigate("/apply-leave")}>
            Apply Leave
          </button>
          <LogoutButton />
        </div>
      </nav>

      {/* Leave Records */}
      <h3 className="mb-3">My Leaves</h3>
      {leaves.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted">No leave records found.</p>
      )}
    </div>
  );
};

export default Dashboard;

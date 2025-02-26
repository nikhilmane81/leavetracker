import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { Table, Button, Form } from "react-bootstrap";

const AdminPanel = () => {
  const [leaves, setLeaves] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const leavesPerPage = 5; // Number of leaves per page

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

  // **Search & Filter Logic**
  const filteredLeaves = leaves.filter(
    (leave) =>
      leave.user_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "All" || leave.status === statusFilter.toLowerCase())
  );

  // **Pagination Logic**
  const indexOfLastLeave = currentPage * leavesPerPage;
  const indexOfFirstLeave = indexOfLastLeave - leavesPerPage;
  const currentLeaves = filteredLeaves.slice(indexOfFirstLeave, indexOfLastLeave);

  const totalPages = Math.ceil(filteredLeaves.length / leavesPerPage);

  return (
    <div className="container mt-5">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-3 mb-4 rounded">
        <h2 className="navbar-brand">Admin Panel</h2>
        <div className="ms-auto">
          <LogoutButton />
        </div>
      </nav>

      {/* Search & Filter */}
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Search Employee..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "45%" }}
        />

        <Form.Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: "45%" }}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </Form.Select>
      </div>

      {/* Leave Requests Table */}
      <div className="card shadow-lg p-4">
        <h3 className="mb-3">Leave Requests</h3>
        {currentLeaves.length > 0 ? (
          <div className="table-responsive">
            <Table bordered hover>
              <thead className="table-dark text-center">
                <tr>
                  <th>Employee</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {currentLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td className="fw-bold">{leave.user_name}</td>
                    <td>{leave.start_date.split("T")[0]}</td> {/* Truncated Date */}
                    <td>{leave.end_date.split("T")[0]}</td> {/* Truncated Date */}
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
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => updateLeaveStatus(leave.id, "approved")}
                          >
                            ✅ Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => updateLeaveStatus(leave.id, "rejected")}
                          >
                            ❌ Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <p className="text-muted text-center">No leave requests found.</p>
        )}

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center mt-3">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "primary" : "outline-secondary"}
              className="me-2"
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

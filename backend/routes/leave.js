const express = require("express");
const mysql = require("mysql2");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "leavedb",
});

// Apply for Leave (Employee)
router.post("/apply", authMiddleware, (req, res) => {
  const { start_date, end_date, reason } = req.body;
  const userId = req.user.userId;

  if (!start_date || !end_date || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "INSERT INTO leaves (user_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)",
    [userId, start_date, end_date, reason],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error applying for leave" });
      }
      res.json({ message: "Leave applied successfully" });
    }
  );
});

// View Own Leaves (Employee)
router.get("/my-leaves", authMiddleware, (req, res) => {
  const userId = req.user.userId;

  db.query("SELECT * FROM leaves WHERE user_id = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching leaves" });
    }
    res.json(results);
  });
});

// View All Leaves (Admin)
router.get("/all", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied." });
  }

  db.query("SELECT leaves.*, users.name FROM leaves JOIN users ON leaves.user_id = users.id", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching all leaves" });
    }
    res.json(results);
  });
});

// Approve/Reject Leave (Admin)
router.put("/update", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied." });
  }

  const { leave_id, status } = req.body;
  if (!leave_id || !["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  db.query("UPDATE leaves SET status = ? WHERE id = ?", [status, leave_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error updating leave status" });
    }
    res.json({ message: `Leave ${status}` });
  });
});

module.exports = router;

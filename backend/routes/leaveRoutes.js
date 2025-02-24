const express = require("express");
const router = express.Router();
const db = require("../db"); // Import your database connection
const authenticateToken = require("../middleware/authMiddleware"); // Middleware for auth

// Get all leave requests (Admin only)
router.get("/all", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    const [leaves] = await db.query(
      "SELECT l.id, u.name as user_name, l.start_date, l.end_date, l.reason, l.status FROM leaves l JOIN users u ON l.user_id = u.id"
    );
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave requests" });
  }
});

// Update leave request status (Approve/Reject)
router.put("/update/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const { status } = req.body;
  const { id } = req.params;

  try {
    await db.query("UPDATE leaves SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Leave status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating leave status" });
  }
});

// View Own Leaves (Employee);
router.get("/my-leaves", authenticateToken, async(req, res) => {
    const userId = req.user.userId;
    // console.log(userId);
  try {
    const [leaves] = await db.query(
      "SELECT * FROM leaves WHERE user_id = ?", [userId]);
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave requests" });
  }
  });


// Apply for Leave (Employee)
router.post("/apply", authenticateToken, async (req, res) => {
  const { start_date, end_date, reason } = req.body;
  const userId = req.user.userId;

  if (!start_date || !end_date || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const[leaves] = await db.query ("INSERT INTO leaves (user_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)",
    [userId, start_date, end_date, reason]);
    res.json({ message: "Leave applied successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error applying for leave" });
  }
});


module.exports = router;

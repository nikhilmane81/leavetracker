const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

module.exports = (io) => {
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

      // Fetch updated leave list
      const [updatedLeaves] = await db.query(
        "SELECT l.id, u.name as user_name, l.start_date, l.end_date, l.reason, l.status FROM leaves l JOIN users u ON l.user_id = u.id"
      );

      // Emit event to all connected clients
      io.emit("leaveUpdated", updatedLeaves);

      res.json({ message: "Leave status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating leave status" });
    }
  });

  return router;
};
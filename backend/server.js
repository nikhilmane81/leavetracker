require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db"); // Import the improved db connection

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Leave Tracker API is running...");
});

const leaveRoutes = require("./routes/leaveRoutes");
app.use("/leave", leaveRoutes);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

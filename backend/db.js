const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",      // Change if using a different DB server
  user: "root",           // Your MySQL username
  password: "root", // Your MySQL password
  database: "leavedb", // Your database name
});

db.getConnection()
  .then(() => console.log("✅ Connected to MySQL Database"))
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1); // Exit if DB connection fails
  });
module.exports = db;

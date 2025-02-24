const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",      // Change if using a different DB server
  user: "root",           // Your MySQL username
  password: "root", // Your MySQL password
  database: "leavedb", // Your database name
});

module.exports = db;

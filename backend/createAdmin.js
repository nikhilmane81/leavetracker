const bcrypt = require("bcrypt");
const db = require("./db"); // Adjust the path based on your project

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Admin User", "admin@example.com", hashedPassword, "admin"]
  );
  console.log("✅ Admin user created!");
};

createAdmin();

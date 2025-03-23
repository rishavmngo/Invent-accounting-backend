import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  database: "auth",
  password: "password",
  port: 5432,
  host: "localhost",
});

pool.query("Select NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Database connected successfully");
  }
});

export default pool;

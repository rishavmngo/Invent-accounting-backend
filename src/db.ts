import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  database: "auth",
  password: "password",
  port: 5432,
  host: "localhost",
});

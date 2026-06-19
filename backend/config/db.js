import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,

  port: process.env.DB_PORT,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,
});

// Test Database Connection

pool
  .connect()
  .then(() => {
    console.log("PostgreSQL Database Connected Successfully");
  })
  .catch((error) => {
    console.log("Database Connection Failed");

    console.log(error.message);
  });

export default pool;

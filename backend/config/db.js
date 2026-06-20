import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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

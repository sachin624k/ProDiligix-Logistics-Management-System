import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/tracking", trackingRoutes);

// Database Test
app.get("/db-test", async (req, res) => {
  const result = await pool.query("SELECT NOW()");

  res.json({
    database: "connected",
    time: result.rows[0],
  });
});

// Default Route
app.get("/", (req, res) => {
  res.json({
    message: "ProDiligix LMS API Running",
  });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

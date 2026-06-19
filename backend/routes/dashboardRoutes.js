import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET DASHBOARD STATS
router.get(
  "/stats",
  protect,
  authorizeRoles("ADMIN", "MANAGEMENT"),
  getDashboardStats,
);

export default router;

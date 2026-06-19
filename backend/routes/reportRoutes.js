import express from "express";

import {
  dailyReport,
  weeklyReport,
  monthlyReport,
  exportExcelReport,
  exportPDFReport,
} from "../controllers/reportController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// DAILY REPORT
router.get(
  "/daily",
  protect,
  authorizeRoles("ADMIN", "MANAGEMENT"),
  dailyReport,
);

// WEEKLY REPORT
router.get(
  "/weekly",
  protect,
  authorizeRoles("ADMIN", "MANAGEMENT"),
  weeklyReport,
);

// MONTHLY REPORT
router.get(
  "/monthly",
  protect,
  authorizeRoles("ADMIN", "MANAGEMENT"),
  monthlyReport,
);

// EXPORT EXCEL REPORT
router.get(
  "/export/excel",
  protect,
  authorizeRoles("ADMIN", "MANAGEMENT"),
  exportExcelReport,
);

// EXPORT PDF REPORT
router.get(
  "/export/pdf",
  protect,
  authorizeRoles("ADMIN", "MANAGEMENT"),
  exportPDFReport,
);

export default router;

import express from "express";
import {
  getReportData,
  exportExcelReport,
  exportPDFReport,
} from "../controllers/reportController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET REPORT DATA
router.get("/", protect, authorizeRoles("ADMIN", "MANAGEMENT"), getReportData);

// EXPORT EXCEL
router.get(
  "/export/excel",
  protect,
  authorizeRoles("ADMIN", "MANAGEMENT"),
  exportExcelReport,
);

// EXPORT PDF
router.get(
  "/export/pdf",
  protect,
  authorizeRoles("ADMIN", "MANAGEMENT"),
  exportPDFReport,
);

export default router;

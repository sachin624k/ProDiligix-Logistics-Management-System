import express from "express";
import {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipmentStatus,
} from "../controllers/shipmentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE SHIPMENT
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN", "OPERATIONS"),
  createShipment,
);

// GET ALL SHIPMENTS
router.get("/", protect, getShipments);

// GET SHIPMENT BY ID
router.get("/:id", protect, getShipmentById);

// UPDATE SHIPMENT STATUS
router.put(
  "/:id/status",
  protect,
  authorizeRoles("ADMIN", "OPERATIONS"),
  updateShipmentStatus,
);

export default router;

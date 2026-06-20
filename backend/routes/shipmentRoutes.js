import express from "express";

import {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipmentStatus,
  updateShipment,
  deleteShipment,
} from "../controllers/shipmentController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================
// CREATE SHIPMENT
// ADMIN + OPERATIONS
// ===============================

router.post(
  "/",

  protect,

  authorizeRoles("ADMIN", "OPERATIONS"),

  createShipment,
);

// ===============================
// GET ALL SHIPMENTS
// ADMIN + OPERATIONS
// ===============================

router.get(
  "/",

  protect,

  authorizeRoles("ADMIN", "OPERATIONS"),

  getShipments,
);

// ===============================
// GET SINGLE SHIPMENT
// ADMIN + OPERATIONS
// ===============================

router.get(
  "/:id",

  protect,

  authorizeRoles("ADMIN", "OPERATIONS"),

  getShipmentById,
);

// ===============================
// EDIT SHIPMENT
// ADMIN + OPERATIONS
// ===============================

router.put(
  "/:id",

  protect,

  authorizeRoles("ADMIN", "OPERATIONS"),

  updateShipment,
);

// ===============================
// UPDATE SHIPMENT STATUS
// ADMIN + OPERATIONS
// ===============================

router.put(
  "/:id/status",

  protect,

  authorizeRoles("ADMIN", "OPERATIONS"),

  updateShipmentStatus,
);

// ===============================
// DELETE SHIPMENT
// ADMIN ONLY
// ===============================

router.delete(
  "/:id",

  protect,

  authorizeRoles("ADMIN"),

  deleteShipment,
);

export default router;

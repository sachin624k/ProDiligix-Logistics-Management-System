import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE CUSTOMER (ADMIN + OPERATIONS)
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN", "OPERATIONS"),
  createCustomer,
);

// GET ALL CUSTOMERS (ADMIN + OPERATIONS)
router.get("/", protect, authorizeRoles("ADMIN", "OPERATIONS"), getCustomers);

// GET SINGLE CUSTOMER (ADMIN + OPERATIONS)
router.get(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "OPERATIONS"),
  getCustomerById,
);

// UPDATE CUSTOMER (ADMIN + OPERATIONS)
router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "OPERATIONS"),
  updateCustomer,
);

// DELETE CUSTOMER (ADMIN ONLY)
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteCustomer);

export default router;

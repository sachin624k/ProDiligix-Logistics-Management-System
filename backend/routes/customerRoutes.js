import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
} from "../controllers/customerController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN", "OPERATIONS"),
  createCustomer,
);

router.get("/", protect, getCustomers);

router.get("/:id", protect, getCustomerById);

router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "OPERATIONS"),
  updateCustomer,
);

export default router;

import express from "express";

import pool from "../config/db.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// DASHBOARD STATS
router.get(
  "/",

  protect,

  authorizeRoles("ADMIN", "MANAGEMENT"),

  async (req, res) => {
    try {
      const customers = await pool.query(
        `
      SELECT COUNT(*)
      FROM customers
      `,
      );

      const shipments = await pool.query(
        `
      SELECT COUNT(*)
      FROM shipments
      `,
      );

      const transit = await pool.query(
        `
      SELECT COUNT(*)
      FROM shipments
      WHERE status='IN_TRANSIT'
      `,
      );

      const delivered = await pool.query(
        `
      SELECT COUNT(*)
      FROM shipments
      WHERE status='DELIVERED'
      `,
      );

      const revenue = await pool.query(
        `
      SELECT 
      COALESCE(
        SUM(shipment_cost),
        0
      )
      AS total
      FROM shipments
      `,
      );

      const status = await pool.query(
        `
      SELECT 
      status,
      COUNT(*)

      FROM shipments

      GROUP BY status
      `,
      );

      const mode = await pool.query(
        `
      SELECT 
      shipment_mode,
      COUNT(*)

      FROM shipments

      GROUP BY shipment_mode
      `,
      );

      res.json({
        cards: {
          customers: customers.rows[0].count,

          shipments: shipments.rows[0].count,

          transit: transit.rows[0].count,

          delivered: delivered.rows[0].count,

          revenue: revenue.rows[0].total,
        },

        charts: {
          status: status.rows,

          mode: mode.rows,
        },
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  },
);

export default router;

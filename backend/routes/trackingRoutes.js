import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET TRACKING BY SHIPMENT NUMBER
router.get("/:shipmentId", protect, async (req, res) => {
  try {
    // GET SHIPMENT DETAILS

    const shipmentResult = await pool.query(
      `
      SELECT

        s.*,
        c.company_name

      FROM shipments s
      LEFT JOIN customers c
      ON s.customer_id = c.id
      WHERE s.shipment_id=$1
      `,
      [req.params.shipmentId],
    );

    if (shipmentResult.rows.length === 0) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    // GET TRACKING HISTORY

    const trackingResult = await pool.query(
      `
      SELECT *
      FROM tracking_history
      WHERE shipment_id=$1
      ORDER BY updated_at ASC
      `,
      [shipmentResult.rows[0].id],
    );

    res.json({
      shipment: shipmentResult.rows[0],
      tracking: trackingResult.rows,
    });
  } catch (error) {
    console.log("TRACKING ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE SHIPMENT STATUS
router.post("/:shipmentId", protect, async (req, res) => {
  try {
    const { status, location, remarks } = req.body;

    // UPDATE SHIPMENT TABLE
    await pool.query(
      `
      UPDATE shipments
      SET status=$1
      WHERE id=$2
      `,
      [status, req.params.shipmentId],
    );

    // INSERT TRACKING HISTORY
    const result = await pool.query(
      `
      INSERT INTO tracking_history
      (
        shipment_id,
        status,
        location,
        remarks
      )
      VALUES($1,$2,$3,$4)
      RETURNING *
      `,
      [req.params.shipmentId, status, location, remarks],
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;

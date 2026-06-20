import pool from "../config/db.js";
import { sendEmail } from "../utils/emailService.js";
import { createAuditLog } from "../utils/auditLogger.js";

// CREATE SHIPMENT
export const createShipment = async (req, res) => {
  try {
    const {
      customer_id,
      pickup_location,
      delivery_location,
      shipment_mode,
      weight,
      carrier_name,
      expected_delivery_date,
      shipment_cost,
    } = req.body;

    // Auto Shipment ID
    const shipment_id = "PDLMS-" + Date.now();

    const shipment = await pool.query(
      `
      INSERT INTO shipments
      (
        shipment_id,
        customer_id,
        pickup_location,
        delivery_location,
        shipment_mode,
        weight,
        carrier_name,
        expected_delivery_date,
        shipment_cost,
        created_by
      )

      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)

      RETURNING *
      `,

      [
        shipment_id,
        customer_id,
        pickup_location,
        delivery_location,
        shipment_mode,
        weight,
        carrier_name,
        expected_delivery_date,
        shipment_cost,
        req.user.id,
      ],
    );

    // First tracking entry
    await pool.query(
      `
      INSERT INTO tracking_history
      (shipment_id,status,remarks)

      VALUES($1,$2,$3)
      `,

      [shipment.rows[0].id, "BOOKED", "Shipment Created"],
    );

    await createAuditLog(
      req.user.id,

      "Created new shipment",

      "SHIPMENT",
    );

    res.status(201).json({
      message: "Shipment created successfully",
      shipment: shipment.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL SHIPMENTS
export const getShipments = async (req, res) => {
  try {
    const shipments = await pool.query(
      `
      SELECT
        shipments.*,
        customers.company_name

      FROM shipments

      JOIN customers
      ON shipments.customer_id = customers.id

      ORDER BY shipments.id DESC
      `,
    );

    res.json(shipments.rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET SHIPMENT DETAILS
export const getShipmentById = async (req, res) => {
  try {
    const shipment = await pool.query(
      `
      SELECT *

      FROM shipments

      WHERE id=$1
      `,

      [req.params.id],
    );

    const tracking = await pool.query(
      `
      SELECT *

      FROM tracking_history

      WHERE shipment_id=$1

      ORDER BY updated_at ASC
      `,

      [req.params.id],
    );

    res.json({
      shipment: shipment.rows[0],
      tracking: tracking.rows,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE STATUS
export const updateShipmentStatus = async (req, res) => {
  try {
    const { status, location, remarks } = req.body;

    const updated = await pool.query(
      `
      UPDATE shipments

      SET status=$1

      WHERE id=$2

      RETURNING *
      `,

      [status, req.params.id],
    );

    // Add tracking history
    await pool.query(
      `
      INSERT INTO tracking_history
      (shipment_id,status,location,remarks)

      VALUES($1,$2,$3,$4)
      `,

      [req.params.id, status, location, remarks],
    );

    // GET CUSTOMER EMAIL
    const customer = await pool.query(
      `
      SELECT
        customers.email

      FROM shipments

      JOIN customers
      ON shipments.customer_id = customers.id

      WHERE shipments.id=$1
      `,

      [req.params.id],
    );

    // SEND EMAIL NOTIFICATION
    if (customer.rows[0]?.email) {
      await sendEmail(
        customer.rows[0].email,

        "ProDiligix Shipment Update",

        `
        Your shipment status updated.
        Current Status: ${status}
        Location: ${location}
        Remarks: ${remarks}
        Thank you,
        ProDiligix Team
        `,
      );
    }

    res.json({
      message: "Shipment status updated",
      shipment: updated.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE SHIPMENT DETAILS
export const updateShipment = async (req, res) => {
  try {
    const {
      pickup_location,
      delivery_location,
      shipment_mode,
      weight,
      carrier_name,
      expected_delivery_date,
      shipment_cost,
      status,
    } = req.body;

    const updatedShipment = await pool.query(
      `
      UPDATE shipments SET

      pickup_location=$1,
      delivery_location=$2,
      shipment_mode=$3,
      weight=$4,
      carrier_name=$5,
      expected_delivery_date=$6,
      shipment_cost=$7,
      status=$8

      WHERE id=$9

      RETURNING *
      `,
      [
        pickup_location,
        delivery_location,
        shipment_mode,
        weight,
        carrier_name,
        expected_delivery_date,
        shipment_cost,
        status,
        req.params.id,
      ],
    );

    await createAuditLog(req.user.id, "Updated shipment details", "SHIPMENT");

    res.json({
      message: "Shipment updated successfully",
      shipment: updatedShipment.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE SHIPMENT
export const deleteShipment = async (req, res) => {
  try {
    // Delete tracking history first
    await pool.query(
      `
      DELETE FROM tracking_history
      WHERE shipment_id=$1
      `,
      [req.params.id],
    );

    // Delete shipment
    await pool.query(
      `
      DELETE FROM shipments
      WHERE id=$1
      `,
      [req.params.id],
    );

    await createAuditLog(req.user.id, "Deleted shipment", "SHIPMENT");

    res.json({
      message: "Shipment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

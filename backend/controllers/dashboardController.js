import pool from "../config/db.js";

// GET DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
  try {
    // TOTAL CUSTOMERS
    const customers = await pool.query(
      `
      SELECT COUNT(*)
      FROM customers
      `,
    );

    // TOTAL SHIPMENTS
    const shipments = await pool.query(
      `
      SELECT COUNT(*)
      FROM shipments
      `,
    );

    // IN TRANSIT
    const inTransit = await pool.query(
      `
      SELECT COUNT(*)
      FROM shipments
      WHERE status='IN_TRANSIT'
      `,
    );

    // DELIVERED
    const delivered = await pool.query(
      `
      SELECT COUNT(*)
      FROM shipments
      WHERE status='DELIVERED'
      `,
    );

    // REVENUE
    const revenue = await pool.query(
      `
      SELECT
        COALESCE(
          SUM(shipment_cost),
          0
        ) AS total_revenue
      FROM shipments
      `,
    );

    // SHIPMENT MODE CHART
    const modeSummary = await pool.query(
      `
      SELECT
        shipment_mode,
        COUNT(*) AS total
      FROM shipments
      GROUP BY shipment_mode
      `,
    );

    // STATUS CHART
    const statusSummary = await pool.query(
      `
      SELECT
        status,
        COUNT(*) AS total
      FROM shipments
      GROUP BY status
      `,
    );

    res.json({
      cards: {
        totalCustomers: customers.rows[0].count,
        totalShipments: shipments.rows[0].count,
        inTransit: inTransit.rows[0].count,
        delivered: delivered.rows[0].count,
        revenue: revenue.rows[0].total_revenue,
      },

      charts: {
        modeSummary: modeSummary.rows,
        statusSummary: statusSummary.rows,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

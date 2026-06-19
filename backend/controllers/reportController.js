import pool from "../config/db.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

// DAILY REPORT
export const dailyReport = async (req, res) => {
  try {
    const report = await pool.query(
      `
      SELECT
        shipments.*,
        customers.company_name

      FROM shipments

      JOIN customers
      ON shipments.customer_id = customers.id

      WHERE DATE(shipments.created_at) = CURRENT_DATE

      ORDER BY shipments.created_at DESC
      `,
    );

    res.json(report.rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// WEEKLY REPORT
export const weeklyReport = async (req, res) => {
  try {
    const report = await pool.query(
      `
      SELECT
        shipments.*,
        customers.company_name

      FROM shipments

      JOIN customers
      ON shipments.customer_id = customers.id

      WHERE shipments.created_at >= NOW() - INTERVAL '7 days'

      ORDER BY shipments.created_at DESC
      `,
    );

    res.json(report.rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// MONTHLY REPORT
export const monthlyReport = async (req, res) => {
  try {
    const report = await pool.query(
      `
      SELECT
        shipments.*,
        customers.company_name

      FROM shipments

      JOIN customers
      ON shipments.customer_id = customers.id

      WHERE shipments.created_at >= NOW() - INTERVAL '30 days'

      ORDER BY shipments.created_at DESC
      `,
    );

    res.json(report.rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// EXPORT EXCEL REPORT

export const exportExcelReport = async (req, res) => {
  try {
    const data = await pool.query(
      `
      SELECT
      shipments.shipment_id,
      customers.company_name,
      shipments.pickup_location,
      shipments.delivery_location,
      shipments.status,
      
      shipments.shipment_cost
      
      FROM shipments
      
      JOIN customers
      
      ON shipments.customer_id=customers.id
      `,
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Shipments");

    sheet.columns = [
      {
        header: "Shipment ID",
        key: "shipment_id",
      },
      {
        header: "Customer",
        key: "company_name",
      },
      {
        header: "Pickup",
        key: "pickup_location",
      },
      {
        header: "Delivery",
        key: "delivery_location",
      },
      {
        header: "Status",
        key: "status",
      },
      {
        header: "Cost",
        key: "shipment_cost",
      },
    ];

    sheet.addRows(data.rows);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=shipment_report.xlsx",
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// EXPORT PDF REPORT
export const exportPDFReport = async (req, res) => {
  try {
    const data = await pool.query(
      `
      SELECT
      shipments.shipment_id,
      customers.company_name,
      shipments.status,
      shipments.shipment_cost
      
      FROM shipments
      
      JOIN customers
      
      ON shipments.customer_id=customers.id
      `,
    );

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=shipment_report.pdf",
    );

    doc.pipe(res);

    doc.fontSize(20).text("ProDiligix Shipment Report");

    doc.moveDown();

    data.rows.forEach((item) => {
      doc.fontSize(12).text(
        `
          Shipment: ${item.shipment_id}
          Customer: ${item.company_name}
          Status: ${item.status}
          Cost: ${item.shipment_cost}
          ----------------------------
          `,
      );
    });

    doc.end();
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

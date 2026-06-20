import pool from "../config/db.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

// ===============================
// GET REPORT DATA
// DAILY / WEEKLY / MONTHLY
// ===============================

export const getReportData = async (req, res) => {
  try {
    const { type } = req.query;

    let condition = "";

    if (type === "daily") {
      condition = `AND DATE(shipments.created_at)=CURRENT_DATE`;
    }

    if (type === "weekly") {
      condition = `AND shipments.created_at >= NOW() - INTERVAL '7 days'`;
    }

    if (type === "monthly") {
      condition = `AND shipments.created_at >= NOW() - INTERVAL '30 days'`;
    }

    const report = await pool.query(
      `

      SELECT

      shipments.shipment_id,

      customers.company_name,

      shipments.pickup_location,

      shipments.delivery_location,

      shipments.shipment_mode,

      shipments.status,

      shipments.shipment_cost,

      shipments.created_at


      FROM shipments


      JOIN customers

      ON shipments.customer_id = customers.id


      WHERE 1=1

      ${condition}


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

// ===============================
// EXPORT EXCEL REPORT
// ===============================

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

      ON shipments.customer_id = customers.id

      `,
    );

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Shipments");

    sheet.columns = [
      {
        header: "Shipment ID",
        key: "shipment_id",
        width: 25,
      },

      {
        header: "Customer",
        key: "company_name",
        width: 25,
      },

      {
        header: "Pickup",
        key: "pickup_location",
        width: 25,
      },

      {
        header: "Delivery",
        key: "delivery_location",
        width: 25,
      },

      {
        header: "Status",
        key: "status",
        width: 20,
      },

      {
        header: "Cost",
        key: "shipment_cost",
        width: 15,
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

// ===============================
// EXPORT PDF REPORT
// ===============================

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

ON shipments.customer_id = customers.id

`,
    );

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=shipment_report.pdf",
    );

    doc.pipe(res);

    doc.fontSize(20).text("ProDiligix Shipment Report", {
      align: "center",
    });

    doc.moveDown();

    data.rows.forEach((item) => {
      doc.fontSize(12).text(
        `

Shipment ID : ${item.shipment_id}

Customer : ${item.company_name}

Status : ${item.status}

Cost : ₹${item.shipment_cost}

---------------------------------

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

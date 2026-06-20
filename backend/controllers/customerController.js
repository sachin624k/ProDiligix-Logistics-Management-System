import pool from "../config/db.js";

// CREATE CUSTOMER
export const createCustomer = async (req, res) => {
  try {
    const { company_name, contact_person, phone, email, gst_number, address } =
      req.body;

    const customer = await pool.query(
      `
      INSERT INTO customers
      (
        company_name,
        contact_person,
        phone,
        email,
        gst_number,
        address
      )
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [company_name, contact_person, phone, email, gst_number, address],
    );

    res.status(201).json({
      message: "Customer created successfully",
      customer: customer.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL CUSTOMERS
export const getCustomers = async (req, res) => {
  try {
    const customers = await pool.query(
      `
      SELECT *
      FROM customers
      ORDER BY id DESC
      `,
    );

    res.json(customers.rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET SINGLE CUSTOMER
export const getCustomerById = async (req, res) => {
  try {
    const customer = await pool.query(
      `
      SELECT *
      FROM customers
      WHERE id=$1
      `,
      [req.params.id],
    );

    res.json(customer.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE CUSTOMER
export const updateCustomer = async (req, res) => {
  try {
    const { company_name, contact_person, phone, email, gst_number, address } =
      req.body;

    const updatedCustomer = await pool.query(
      `
      UPDATE customers SET

      company_name=$1,
      contact_person=$2,
      phone=$3,
      email=$4,
      gst_number=$5,
      address=$6

      WHERE id=$7

      RETURNING *
      `,
      [
        company_name,
        contact_person,
        phone,
        email,
        gst_number,
        address,
        req.params.id,
      ],
    );

    res.json({
      message: "Customer updated",
      customer: updatedCustomer.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE CUSTOMER
export const deleteCustomer = async (req, res) => {
  try {
    await pool.query(
      `
      DELETE FROM customers
      WHERE id=$1
      `,
      [req.params.id],
    );

    res.json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

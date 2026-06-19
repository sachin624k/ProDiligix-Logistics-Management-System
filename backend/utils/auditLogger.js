import pool from "../config/db.js";

export const createAuditLog = async (user_id, action, module) => {
  await pool.query(
    `
        INSERT INTO audit_logs
        (user_id,action,module)
        VALUES($1,$2,$3)
        `,
    [user_id, action, module],
  );
};

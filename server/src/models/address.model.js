const { pool } = require("../config/db");

const Address = {
  async findByUserId(userId) {
    const query = `
      SELECT id, user_id AS "userId", recipient_name AS "recipientName",
             phone, address_line AS "addressLine", city, district,
             is_default AS "isDefault", created_at AS "createdAt"
      FROM user_addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  async findById(id, userId) {
    const query = `
      SELECT id, user_id AS "userId", recipient_name AS "recipientName",
             phone, address_line AS "addressLine", city, district,
             is_default AS "isDefault"
      FROM user_addresses
      WHERE id = $1 AND user_id = $2
    `;
    const { rows } = await pool.query(query, [id, userId]);
    return rows[0] || null;
  },

  async create({ userId, recipientName, phone, addressLine, city = "", district = "", isDefault = false }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      if (isDefault) {
        await client.query(`UPDATE user_addresses SET is_default = false WHERE user_id = $1`, [userId]);
      } else {
        // If this is the user's first address, make it default automatically
        const countRes = await client.query(`SELECT COUNT(*) FROM user_addresses WHERE user_id = $1`, [userId]);
        if (parseInt(countRes.rows[0].count, 10) === 0) {
          isDefault = true;
        }
      }

      const query = `
        INSERT INTO user_addresses (user_id, recipient_name, phone, address_line, city, district, is_default)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, user_id AS "userId", recipient_name AS "recipientName",
                  phone, address_line AS "addressLine", city, district, is_default AS "isDefault"
      `;
      const values = [userId, recipientName, phone, addressLine, city, district, isDefault];
      const { rows } = await client.query(query, values);

      await client.query("COMMIT");
      return rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  async setDefault(id, userId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`UPDATE user_addresses SET is_default = false WHERE user_id = $1`, [userId]);
      const res = await client.query(
        `UPDATE user_addresses SET is_default = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING id`,
        [id, userId]
      );
      await client.query("COMMIT");
      return res.rows.length > 0;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  async delete(id, userId) {
    const query = `DELETE FROM user_addresses WHERE id = $1 AND user_id = $2 RETURNING id`;
    const { rows } = await pool.query(query, [id, userId]);
    return rows.length > 0;
  }
};

module.exports = Address;

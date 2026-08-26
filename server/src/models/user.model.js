const { pool } = require("../config/db");

const User = {
  async findByEmail(email) {
    const query = `
      SELECT u.id, u.name, u.email, u.phone, u.password_hash AS "passwordHash",
             u.avatar_url AS "avatarUrl", u.status, u.created_at AS "createdAt",
             r.name AS role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE LOWER(u.email) = LOWER($1)
    `;
    const { rows } = await pool.query(query, [email.trim()]);
    return rows[0] || null;
  },

  async findById(id) {
    const query = `
      SELECT u.id, u.name, u.email, u.phone, u.avatar_url AS "avatarUrl", 
             u.status, u.created_at AS "createdAt", r.name AS role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  async create({ name, email, phone = null, passwordHash, avatarUrl = "", roleName = "customer" }) {
    // Get role ID
    const roleQuery = `SELECT id FROM roles WHERE name = $1`;
    let roleRes = await pool.query(roleQuery, [roleName]);
    let roleId = roleRes.rows[0]?.id;

    if (!roleId) {
      const defaultRoleRes = await pool.query(`SELECT id FROM roles WHERE name = 'customer'`);
      roleId = defaultRoleRes.rows[0]?.id || 2;
    }

    const insertQuery = `
      INSERT INTO users (role_id, name, email, phone, password_hash, avatar_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'active')
      RETURNING id, name, email, phone, avatar_url AS "avatarUrl", status, created_at AS "createdAt"
    `;
    const values = [roleId, name, email.toLowerCase().trim(), phone, passwordHash, avatarUrl];
    const { rows } = await pool.query(insertQuery, values);
    return { ...rows[0], role: roleName };
  },

  async updateProfile(id, { name, phone, avatarUrl }) {
    const query = `
      UPDATE users
      SET name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          avatar_url = COALESCE($3, avatar_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, name, email, phone, avatar_url AS "avatarUrl", status
    `;
    const { rows } = await pool.query(query, [name, phone, avatarUrl, id]);
    return rows[0] || null;
  },

  async updatePassword(id, passwordHash) {
    const query = `
      UPDATE users
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    await pool.query(query, [passwordHash, id]);
  },
};

module.exports = User;

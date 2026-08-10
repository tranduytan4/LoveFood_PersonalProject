const { pool } = require("../config/db");

const Category = {
  async findActive() {
    const query = `
      SELECT id, name, slug, image_url AS "imageUrl", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt"
      FROM categories
      WHERE is_active = true
      ORDER BY name ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async findBySlug(slug) {
    const query = `
      SELECT id, name, slug, image_url AS "imageUrl", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt"
      FROM categories
      WHERE slug = $1
    `;
    const { rows } = await pool.query(query, [slug]);
    return rows[0] || null;
  },

  async createMany(categories) {
    const inserted = [];
    for (const cat of categories) {
      const query = `
        INSERT INTO categories (name, slug, image_url, is_active)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, slug, image_url AS "imageUrl", is_active AS "isActive"
      `;
      const values = [cat.name, cat.slug, cat.imageUrl || "", cat.isActive !== undefined ? cat.isActive : true];
      const { rows } = await pool.query(query, values);
      inserted.push(rows[0]);
    }
    return inserted;
  },

  async deleteAll() {
    await pool.query("DELETE FROM categories");
  }
};

module.exports = Category;


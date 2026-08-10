const { pool } = require("../config/db");

const Product = {
  async findWithFilter({ search = "", category = "", sort = "newest" } = {}) {
    const params = [];
    const conditions = ["p.is_available = true"];

    if (search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
    }

    if (category.trim()) {
      params.push(category.trim());
      conditions.push(`c.slug = $${params.length}`);
    }

    let orderBy = "p.created_at DESC";
    if (sort === "priceAsc") orderBy = "p.price ASC";
    else if (sort === "priceDesc") orderBy = "p.price DESC";
    else if (sort === "bestSeller") orderBy = "p.sold_count DESC";

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.slug, 
        p.description, 
        p.image_url AS "imageUrl", 
        p.price::float AS price, 
        p.is_available AS "isAvailable", 
        p.sold_count AS "soldCount",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        json_build_object('name', c.name, 'slug', c.slug) AS category
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy}
    `;

    const { rows } = await pool.query(query, params);
    return rows;
  },

  async findBySlug(slug) {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.slug, 
        p.description, 
        p.image_url AS "imageUrl", 
        p.price::float AS price, 
        p.is_available AS "isAvailable", 
        p.sold_count AS "soldCount",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        json_build_object('name', c.name, 'slug', c.slug) AS category
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1 AND p.is_available = true
    `;
    const { rows } = await pool.query(query, [slug]);
    return rows[0] || null;
  },

  async createMany(products) {
    const inserted = [];
    for (const prod of products) {
      const query = `
        INSERT INTO products (name, slug, description, image_url, price, category_id, is_available, sold_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, slug, price::float AS price
      `;
      const values = [
        prod.name,
        prod.slug,
        prod.description || "",
        prod.imageUrl || "",
        prod.price,
        prod.category,
        prod.isAvailable !== undefined ? prod.isAvailable : true,
        prod.soldCount || 0,
      ];
      const { rows } = await pool.query(query, values);
      inserted.push(rows[0]);
    }
    return inserted;
  },

  async deleteAll() {
    await pool.query("DELETE FROM products");
  }
};

module.exports = Product;


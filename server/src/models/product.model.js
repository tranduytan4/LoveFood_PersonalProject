const { pool } = require("../config/db");

const Product = {
  async findWithFilter({ search = "", category = "", sort = "newest", isFeatured, isDeal } = {}) {
    const params = [];
    const conditions = ["p.is_available = true"];

    if (search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
    }

    if (category.trim() && category.toLowerCase() !== "all") {
      params.push(category.trim());
      conditions.push(`(c.slug = $${params.length} OR c.name ILIKE $${params.length})`);
    }

    if (isFeatured !== undefined) {
      params.push(isFeatured);
      conditions.push(`p.is_featured = $${params.length}`);
    }

    if (isDeal) {
      conditions.push(`(p.original_price IS NOT NULL AND p.original_price > p.price)`);
    }

    let orderBy = "p.created_at DESC";
    if (sort === "priceAsc") orderBy = "p.price ASC";
    else if (sort === "priceDesc") orderBy = "p.price DESC";
    else if (sort === "bestSeller") orderBy = "p.sold_count DESC";
    else if (sort === "topRated") orderBy = "p.rating_avg DESC";

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.slug, 
        p.description, 
        p.image_url AS "imageUrl", 
        p.price::float AS price, 
        p.original_price::float AS "originalPrice",
        p.is_available AS "isAvailable", 
        p.is_featured AS "isFeatured",
        p.sold_count AS "soldCount",
        p.rating_avg::float AS "ratingAvg",
        p.rating_count AS "ratingCount",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        json_build_object('name', c.name, 'slug', c.slug) AS category,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', pt.id,
                'name', pt.name,
                'priceAdjustment', pt.price_adjustment::float,
                'isAvailable', pt.is_available
              )
            )
            FROM product_toppings pt
            WHERE pt.product_id = p.id AND pt.is_available = true
          ),
          '[]'::json
        ) AS toppings
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
        p.original_price::float AS "originalPrice",
        p.is_available AS "isAvailable", 
        p.is_featured AS "isFeatured",
        p.sold_count AS "soldCount",
        p.rating_avg::float AS "ratingAvg",
        p.rating_count AS "ratingCount",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        json_build_object('name', c.name, 'slug', c.slug) AS category,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', pt.id,
                'name', pt.name,
                'priceAdjustment', pt.price_adjustment::float,
                'isAvailable', pt.is_available
              )
            )
            FROM product_toppings pt
            WHERE pt.product_id = p.id AND pt.is_available = true
          ),
          '[]'::json
        ) AS toppings
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1
    `;
    const { rows } = await pool.query(query, [slug]);
    return rows[0] || null;
  },

  async findPopular(limit = 9) {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.slug, 
        p.description, 
        p.image_url AS "imageUrl", 
        p.price::float AS price, 
        p.original_price::float AS "originalPrice",
        p.is_available AS "isAvailable", 
        p.is_featured AS "isFeatured",
        p.sold_count AS "soldCount",
        p.rating_avg::float AS "ratingAvg",
        p.rating_count AS "ratingCount",
        json_build_object('name', c.name, 'slug', c.slug) AS category,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', pt.id,
                'name', pt.name,
                'priceAdjustment', pt.price_adjustment::float,
                'isAvailable', pt.is_available
              )
            )
            FROM product_toppings pt
            WHERE pt.product_id = p.id AND pt.is_available = true
          ),
          '[]'::json
        ) AS toppings
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_available = true
      ORDER BY p.sold_count DESC, p.rating_avg DESC
      LIMIT $1
    `;
    const { rows } = await pool.query(query, [limit]);
    return rows;
  },

  async findDeals(limit = 12) {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.slug, 
        p.description, 
        p.image_url AS "imageUrl", 
        p.price::float AS price, 
        p.original_price::float AS "originalPrice",
        p.is_available AS "isAvailable", 
        p.is_featured AS "isFeatured",
        p.sold_count AS "soldCount",
        p.rating_avg::float AS "ratingAvg",
        p.rating_count AS "ratingCount",
        json_build_object('name', c.name, 'slug', c.slug) AS category,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', pt.id,
                'name', pt.name,
                'priceAdjustment', pt.price_adjustment::float,
                'isAvailable', pt.is_available
              )
            )
            FROM product_toppings pt
            WHERE pt.product_id = p.id AND pt.is_available = true
          ),
          '[]'::json
        ) AS toppings
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_available = true AND (p.original_price IS NOT NULL AND p.original_price > p.price)
      ORDER BY (p.original_price - p.price) DESC
      LIMIT $1
    `;
    const { rows } = await pool.query(query, [limit]);
    return rows;
  },

  async toggleAvailability(id) {
    const query = `
      UPDATE products
      SET is_available = NOT is_available, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, is_available AS "isAvailable"
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  async create(productData) {
    const query = `
      INSERT INTO products (category_id, name, slug, description, image_url, price, original_price, is_available, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, name, slug, price::float AS price, is_available AS "isAvailable"
    `;
    const values = [
      productData.categoryId,
      productData.name,
      productData.slug,
      productData.description || "",
      productData.imageUrl || "",
      productData.price,
      productData.originalPrice || null,
      productData.isAvailable !== undefined ? productData.isAvailable : true,
      productData.isFeatured || false,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
};

module.exports = Product;

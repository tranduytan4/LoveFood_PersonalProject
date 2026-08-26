const { pool } = require("../config/db");

const Review = {
  async findByProductId(productId) {
    const query = `
      SELECT r.id, r.rating, r.comment, r.created_at AS "createdAt",
             u.name AS "userName", u.avatar_url AS "userAvatar"
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
    `;
    const { rows } = await pool.query(query, [productId]);
    return rows;
  },

  async create({ orderId = null, productId, userId, rating, comment = "" }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertQuery = `
        INSERT INTO reviews (order_id, product_id, user_id, rating, comment)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, product_id AS "productId", rating, comment, created_at AS "createdAt"
      `;
      const { rows } = await client.query(insertQuery, [orderId, productId, userId, rating, comment]);

      // Recalculate average rating on product
      const avgQuery = `
        SELECT AVG(rating)::numeric(3,2) AS "avgRating", COUNT(*) AS "totalCount"
        FROM reviews
        WHERE product_id = $1
      `;
      const avgRes = await client.query(avgQuery, [productId]);
      const avgRating = avgRes.rows[0]?.avgRating || rating;
      const totalCount = avgRes.rows[0]?.totalCount || 1;

      await client.query(
        `UPDATE products SET rating_avg = $1, rating_count = $2 WHERE id = $3`,
        [avgRating, totalCount, productId]
      );

      await client.query("COMMIT");
      return rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
};

module.exports = Review;

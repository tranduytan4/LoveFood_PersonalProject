const { pool } = require("../config/db");

const Admin = {
  async getDashboardStats() {
    // 1. Total revenue & orders count
    const revenueRes = await pool.query(`
      SELECT 
        COALESCE(SUM(total_amount), 0)::float AS "totalRevenue",
        COUNT(*)::int AS "totalOrders",
        COUNT(*) FILTER (WHERE order_status = 'completed')::int AS "completedOrders",
        COUNT(*) FILTER (WHERE order_status = 'pending')::int AS "pendingOrders",
        COUNT(*) FILTER (WHERE order_status = 'preparing')::int AS "preparingOrders",
        COUNT(*) FILTER (WHERE order_status = 'shipping')::int AS "shippingOrders"
      FROM orders
    `);

    // 2. Active users count
    const usersRes = await pool.query(`SELECT COUNT(*)::int AS "totalUsers" FROM users WHERE status = 'active'`);

    // 3. Top selling products
    const topProductsRes = await pool.query(`
      SELECT p.id, p.name, p.slug, p.image_url AS "imageUrl", p.price::float AS price,
             p.sold_count AS "soldCount", c.name AS category
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.sold_count DESC
      LIMIT 5
    `);

    // 4. Recent 5 orders
    const recentOrdersRes = await pool.query(`
      SELECT o.id, o.order_code AS "orderCode", o.recipient_name AS "recipientName",
             o.total_amount::float AS "totalAmount", o.order_status AS "orderStatus",
             o.payment_method AS "paymentMethod", o.created_at AS "createdAt"
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    return {
      stats: {
        ...revenueRes.rows[0],
        totalUsers: usersRes.rows[0]?.totalUsers || 0,
      },
      topProducts: topProductsRes.rows,
      recentOrders: recentOrdersRes.rows,
    };
  }
};

module.exports = Admin;

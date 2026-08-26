const { pool } = require("../config/db");

const Order = {
  async createOrder({
    userId = null,
    addressId = null,
    recipientName,
    recipientPhone,
    shippingAddress,
    subtotal,
    shippingFee = 15000,
    discountAmount = 0,
    totalAmount,
    voucherId = null,
    paymentMethod = "COD",
    note = "",
    items = [],
  }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Generate Unique Order Code (e.g. LF-20260826-XXXX)
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderCode = `LF-${dateStr}-${randomSuffix}`;

      // 1. Insert Order
      const insertOrderQuery = `
        INSERT INTO orders (
          order_code, user_id, address_id, shipping_address_snapshot,
          recipient_name, recipient_phone, subtotal, shipping_fee,
          discount_amount, total_amount, voucher_id, payment_method,
          payment_status, order_status, note
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', 'pending', $13)
        RETURNING id, order_code AS "orderCode", subtotal::float, shipping_fee::float AS "shippingFee",
                  discount_amount::float AS "discountAmount", total_amount::float AS "totalAmount",
                  order_status AS "orderStatus", payment_status AS "paymentStatus", payment_method AS "paymentMethod",
                  created_at AS "createdAt"
      `;
      const orderValues = [
        orderCode,
        userId,
        addressId,
        shippingAddress,
        recipientName,
        recipientPhone,
        subtotal,
        shippingFee,
        discountAmount,
        totalAmount,
        voucherId,
        paymentMethod,
        note || "",
      ];
      const { rows: orderRows } = await client.query(insertOrderQuery, orderValues);
      const createdOrder = orderRows[0];
      const orderId = createdOrder.id;

      // 2. Insert Order Items & increment product sold count
      for (const item of items) {
        const insertItemQuery = `
          INSERT INTO order_items (
            order_id, product_id, product_name, product_price,
            quantity, item_total, options_json
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        const optionsJson = JSON.stringify({
          toppings: item.toppings || [],
          size: item.size || "Standard",
          itemNote: item.note || "",
        });

        await client.query(insertItemQuery, [
          orderId,
          item.productId || null,
          item.name || item.productName,
          item.price,
          item.quantity,
          itemTotal,
          optionsJson,
        ]);

        if (item.productId) {
          await client.query(
            `UPDATE products SET sold_count = sold_count + $1 WHERE id = $2`,
            [item.quantity, item.productId]
          );
        }
      }

      // 3. Insert Initial Order Status History
      await client.query(
        `INSERT INTO order_status_history (order_id, status, note, created_by) VALUES ($1, 'pending', 'Đơn hàng mới được tạo', $2)`,
        [orderId, userId]
      );

      // 4. Update Voucher usage if used
      if (voucherId) {
        await client.query(
          `UPDATE vouchers SET used_count = used_count + 1 WHERE id = $1`,
          [voucherId]
        );
      }

      await client.query("COMMIT");
      return createdOrder;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  async findByUserId(userId) {
    const query = `
      SELECT 
        o.id,
        o.order_code AS "orderCode",
        o.recipient_name AS "recipientName",
        o.recipient_phone AS "recipientPhone",
        o.shipping_address_snapshot AS "shippingAddress",
        o.subtotal::float AS subtotal,
        o.shipping_fee::float AS "shippingFee",
        o.discount_amount::float AS "discountAmount",
        o.total_amount::float AS "totalAmount",
        o.payment_method AS "paymentMethod",
        o.payment_status AS "paymentStatus",
        o.order_status AS "orderStatus",
        o.note,
        o.created_at AS "createdAt",
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', oi.id,
                'productId', oi.product_id,
                'name', oi.product_name,
                'price', oi.product_price::float,
                'quantity', oi.quantity,
                'itemTotal', oi.item_total::float,
                'options', oi.options_json,
                'imageUrl', p.image_url
              )
            )
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = o.id
          ),
          '[]'::json
        ) AS items
      FROM orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  async findByOrderCode(orderCode) {
    const query = `
      SELECT 
        o.id,
        o.order_code AS "orderCode",
        o.user_id AS "userId",
        o.recipient_name AS "recipientName",
        o.recipient_phone AS "recipientPhone",
        o.shipping_address_snapshot AS "shippingAddress",
        o.subtotal::float AS subtotal,
        o.shipping_fee::float AS "shippingFee",
        o.discount_amount::float AS "discountAmount",
        o.total_amount::float AS "totalAmount",
        o.payment_method AS "paymentMethod",
        o.payment_status AS "paymentStatus",
        o.order_status AS "orderStatus",
        o.note,
        o.created_at AS "createdAt",
        o.updated_at AS "updatedAt",
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', oi.id,
                'productId', oi.product_id,
                'name', oi.product_name,
                'price', oi.product_price::float,
                'quantity', oi.quantity,
                'itemTotal', oi.item_total::float,
                'options', oi.options_json,
                'imageUrl', p.image_url
              )
            )
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = o.id
          ),
          '[]'::json
        ) AS items,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', osh.id,
                'status', osh.status,
                'note', osh.note,
                'createdAt', osh.created_at
              )
              ORDER BY osh.created_at ASC
            )
            FROM order_status_history osh
            WHERE osh.order_id = o.id
          ),
          '[]'::json
        ) AS "statusHistory"
      FROM orders o
      WHERE o.order_code = $1
    `;
    const { rows } = await pool.query(query, [orderCode]);
    return rows[0] || null;
  },

  async findAllOrders({ status = "", limit = 50, offset = 0 } = {}) {
    const params = [];
    let condition = "";
    if (status && status !== "all") {
      params.push(status);
      condition = `WHERE o.order_status = $${params.length}`;
    }

    params.push(limit);
    const limitIdx = params.length;
    params.push(offset);
    const offsetIdx = params.length;

    const query = `
      SELECT 
        o.id,
        o.order_code AS "orderCode",
        o.recipient_name AS "recipientName",
        o.recipient_phone AS "recipientPhone",
        o.shipping_address_snapshot AS "shippingAddress",
        o.subtotal::float AS subtotal,
        o.shipping_fee::float AS "shippingFee",
        o.discount_amount::float AS "discountAmount",
        o.total_amount::float AS "totalAmount",
        o.payment_method AS "paymentMethod",
        o.payment_status AS "paymentStatus",
        o.order_status AS "orderStatus",
        o.note,
        o.created_at AS "createdAt",
        u.name AS "customerName",
        u.email AS "customerEmail",
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', oi.id,
                'name', oi.product_name,
                'price', oi.product_price::float,
                'quantity', oi.quantity,
                'itemTotal', oi.item_total::float,
                'options', oi.options_json
              )
            )
            FROM order_items oi
            WHERE oi.order_id = o.id
          ),
          '[]'::json
        ) AS items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ${condition}
      ORDER BY o.created_at DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;
    const { rows } = await pool.query(query, params);
    return rows;
  },

  async updateStatus(id, newStatus, note = "", adminId = null) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let paymentStatusUpdate = "";
      if (newStatus === "completed") {
        paymentStatusUpdate = ", payment_status = 'paid'";
      } else if (newStatus === "cancelled") {
        paymentStatusUpdate = ", payment_status = 'failed'";
      }

      const updateQuery = `
        UPDATE orders
        SET order_status = $1, updated_at = CURRENT_TIMESTAMP ${paymentStatusUpdate}
        WHERE id = $2
        RETURNING id, order_code AS "orderCode", order_status AS "orderStatus", payment_status AS "paymentStatus"
      `;
      const { rows } = await client.query(updateQuery, [newStatus, id]);
      const updatedOrder = rows[0];

      if (updatedOrder) {
        await client.query(
          `INSERT INTO order_status_history (order_id, status, note, created_by) VALUES ($1, $2, $3, $4)`,
          [id, newStatus, note || `Trạng thái cập nhật sang: ${newStatus}`, adminId]
        );
      }

      await client.query("COMMIT");
      return updatedOrder;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
};

module.exports = Order;

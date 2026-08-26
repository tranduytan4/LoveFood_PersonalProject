const { pool } = require("../config/db");

const Voucher = {
  async findActive() {
    const query = `
      SELECT id, code, description, discount_type AS "discountType",
             discount_value::float AS "discountValue",
             min_order_value::float AS "minOrderValue",
             max_discount::float AS "maxDiscount",
             usage_limit AS "usageLimit",
             used_count AS "usedCount",
             end_date AS "endDate"
      FROM vouchers
      WHERE is_active = true
        AND (end_date IS NULL OR end_date > CURRENT_TIMESTAMP)
        AND (usage_limit IS NULL OR used_count < usage_limit)
      ORDER BY discount_value DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async findByCode(code) {
    const query = `
      SELECT id, code, description, discount_type AS "discountType",
             discount_value::float AS "discountValue",
             min_order_value::float AS "minOrderValue",
             max_discount::float AS "maxDiscount",
             usage_limit AS "usageLimit",
             used_count AS "usedCount",
             end_date AS "endDate",
             is_active AS "isActive"
      FROM vouchers
      WHERE UPPER(code) = UPPER($1)
    `;
    const { rows } = await pool.query(query, [code.trim()]);
    return rows[0] || null;
  },

  calculateDiscount(voucher, subtotal) {
    if (!voucher || !voucher.isActive) {
      return { valid: false, message: "Voucher does not exist or is inactive" };
    }

    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return { valid: false, message: "This voucher has reached its usage limit" };
    }

    if (voucher.endDate && new Date(voucher.endDate) < new Date()) {
      return { valid: false, message: "This voucher has expired" };
    }

    if (voucher.minOrderValue && subtotal < voucher.minOrderValue) {
      return {
        valid: false,
        message: `Minimum order value for this coupon is $${voucher.minOrderValue.toFixed(2)}`,
      };
    }

    let discountAmount = 0;
    if (voucher.discountType === "percentage") {
      discountAmount = (subtotal * voucher.discountValue) / 100;
      if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else {
      discountAmount = voucher.discountValue;
    }

    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    return {
      valid: true,
      voucherId: voucher.id,
      code: voucher.code,
      discountAmount,
      finalTotal: subtotal - discountAmount,
    };
  }
};

module.exports = Voucher;

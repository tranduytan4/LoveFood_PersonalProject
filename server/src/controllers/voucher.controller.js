const Voucher = require("../models/voucher.model");

const getActiveVouchers = async (req, res, next) => {
  try {
    const vouchers = await Voucher.findActive();
    res.json({ data: vouchers });
  } catch (err) {
    next(err);
  }
};

const applyVoucher = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const numSubtotal = Number(subtotal);

    if (!code || isNaN(numSubtotal) || numSubtotal < 0) {
      return res.status(400).json({ message: "Please provide a valid coupon code and order subtotal." });
    }

    const voucher = await Voucher.findByCode(code);
    if (!voucher) {
      return res.status(404).json({ message: "Coupon code does not exist or has expired." });
    }

    const result = Voucher.calculateDiscount(voucher, numSubtotal);
    if (!result.valid) {
      return res.status(400).json({ message: result.message });
    }

    res.json({
      message: `Coupon ${voucher.code} applied successfully!`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getActiveVouchers, applyVoucher };

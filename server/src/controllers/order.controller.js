const Order = require("../models/order.model");
const Voucher = require("../models/voucher.model");

const createOrder = async (req, res, next) => {
  try {
    const {
      recipientName,
      recipientPhone,
      shippingAddress: rawAddress,
      shippingAddressSnapshot,
      addressId = null,
      items = [],
      voucherCode = null,
      paymentMethod = "COD",
      note = "",
    } = req.body;

    const shippingAddress = rawAddress || shippingAddressSnapshot;

    if (!recipientName || !recipientPhone || !shippingAddress) {
      return res.status(400).json({
        message: "Please provide all required delivery information (recipient name, phone, and address).",
      });
    }

    if (!items || !items.length) {
      return res.status(400).json({ message: "Your shopping cart is empty." });
    }

    // 1. Calculate raw subtotal on server for security
    let calculatedSubtotal = 0;
    for (const item of items) {
      const itemQty = item.quantity || item.qty || 1;
      const basePrice = Number(item.price) || 0;
      calculatedSubtotal += basePrice * itemQty;
    }

    const shippingFee = 2.50; // Flat shipping fee in USD
    let discountAmount = 0;
    let validVoucherId = null;

    // 2. Validate voucher if applied
    if (voucherCode) {
      const voucher = await Voucher.findByCode(voucherCode);
      if (voucher) {
        const voucherRes = Voucher.calculateDiscount(voucher, calculatedSubtotal);
        if (voucherRes.valid) {
          discountAmount = voucherRes.discountAmount;
          validVoucherId = voucher.id;
        }
      }
    }

    const totalAmount = Math.max(0, calculatedSubtotal + shippingFee - discountAmount);

    const userId = req.user ? req.user.id : null;

    const createdOrder = await Order.createOrder({
      userId,
      addressId,
      recipientName,
      recipientPhone,
      shippingAddress,
      subtotal: calculatedSubtotal,
      shippingFee,
      discountAmount,
      totalAmount,
      voucherId: validVoucherId,
      paymentMethod,
      note,
      items,
    });

    res.status(201).json({
      message: "Order placed successfully! Your meal is being prepared.",
      data: createdOrder,
    });
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findByUserId(req.user.id);
    res.json({ data: orders });
  } catch (err) {
    next(err);
  }
};

const getOrderByCode = async (req, res, next) => {
  try {
    const { orderCode } = req.params;
    const order = await Order.findByOrderCode(orderCode);

    if (!order) {
      return res.status(404).json({ message: "Order not found with the specified code." });
    }

    // If order has userId and user is logged in, check permission (unless admin)
    if (order.userId && req.user && req.user.role !== "admin" && req.user.id !== order.userId) {
      return res.status(403).json({ message: "You do not have permission to view this order." });
    }

    res.json({ data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getMyOrders, getOrderByCode };

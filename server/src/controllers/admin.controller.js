const Admin = require("../models/admin.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");

const getStats = async (req, res, next) => {
  try {
    const data = await Admin.getDashboardStats();
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { status = "", limit = 50, offset = 0 } = req.query;
    const orders = await Order.findAllOrders({
      status,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });
    res.json({ data: orders });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const allowedStatuses = ["pending", "confirmed", "preparing", "shipping", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status provided." });
    }

    const updated = await Order.updateStatus(parseInt(id, 10), status, note, req.user.id);
    if (!updated) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({
      message: `Order status updated to: ${status}`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

const toggleProductStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Product.toggleAvailability(parseInt(id, 10));
    if (!updated) {
      return res.status(404).json({ message: "Dish not found." });
    }
    res.json({
      message: `Dish marked as ${updated.isAvailable ? "In Stock" : "Out of Stock"} successfully.`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats, getAllOrders, updateOrderStatus, toggleProductStock };

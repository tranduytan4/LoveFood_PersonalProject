const router = require("express").Router();
const { createOrder, getMyOrders, getOrderByCode } = require("../controllers/order.controller");
const { authMiddleware, optionalAuth } = require("../middlewares/auth.middleware");

// Customer can create order with optional auth (or logged in)
router.post("/", optionalAuth, createOrder);

// Customer views own orders
router.get("/my-orders", authMiddleware, getMyOrders);

// Tracking order by order code
router.get("/track/:orderCode", optionalAuth, getOrderByCode);

module.exports = router;

const router = require("express").Router();
const {
  getStats,
  getAllOrders,
  updateOrderStatus,
  toggleProductStock,
} = require("../controllers/admin.controller");
const { authMiddleware, roleMiddleware } = require("../middlewares/auth.middleware");

// Restrict all admin routes to role admin or manager
router.use(authMiddleware);
router.use(roleMiddleware(["admin", "manager"]));

router.get("/stats", getStats);
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);
router.patch("/products/:id/toggle-stock", toggleProductStock);

module.exports = router;

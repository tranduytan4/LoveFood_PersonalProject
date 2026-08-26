const router = require("express").Router();

const authRoutes = require("./auth.routes");
const categoryRoutes = require("./category.routes");
const productRoutes = require("./product.routes");
const addressRoutes = require("./address.routes");
const voucherRoutes = require("./voucher.routes");
const orderRoutes = require("./order.routes");
const reviewRoutes = require("./review.routes");
const adminRoutes = require("./admin.routes");

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/addresses", addressRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/admin", adminRoutes);

module.exports = router;

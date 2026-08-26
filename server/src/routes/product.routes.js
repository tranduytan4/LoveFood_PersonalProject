const router = require("express").Router();
const {
  getProducts,
  getPopularProducts,
  getDealProducts,
  getProductBySlug,
} = require("../controllers/product.controller");

router.get("/", getProducts);
router.get("/popular", getPopularProducts);
router.get("/deals", getDealProducts);
router.get("/:slug", getProductBySlug);

module.exports = router;

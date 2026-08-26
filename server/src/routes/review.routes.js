const router = require("express").Router();
const { getProductReviews, createReview } = require("../controllers/review.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.get("/product/:productId", getProductReviews);
router.post("/", authMiddleware, createReview);

module.exports = router;

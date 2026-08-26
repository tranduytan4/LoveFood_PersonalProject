const Review = require("../models/review.model");

const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.findByProductId(parseInt(productId, 10));
    res.json({ data: reviews });
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment, orderId } = req.body;

    if (!productId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please provide a star rating between 1 and 5." });
    }

    const review = await Review.create({
      orderId: orderId || null,
      productId: parseInt(productId, 10),
      userId: req.user.id,
      rating: parseInt(rating, 10),
      comment: comment || "",
    });

    res.status(201).json({
      message: "Thank you for your rating & review!",
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProductReviews, createReview };

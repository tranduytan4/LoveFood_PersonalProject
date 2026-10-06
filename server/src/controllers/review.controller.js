const Review = require("../models/review.model");

const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const numericProductId = parseInt(productId, 10);
    if (isNaN(numericProductId)) {
      return res.status(400).json({ message: "Invalid product ID provided." });
    }

    const reviews = await Review.findByProductId(numericProductId);
    res.json({ data: reviews });
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment, orderId } = req.body;
    const numericProductId = parseInt(productId, 10);
    const numericRating = parseInt(rating, 10);
    const numericOrderId = orderId ? parseInt(orderId, 10) : null;

    if (isNaN(numericProductId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Please provide a star rating between 1 and 5." });
    }

    const review = await Review.create({
      orderId: !isNaN(numericOrderId) ? numericOrderId : null,
      productId: numericProductId,
      userId: req.user.id,
      rating: numericRating,
      comment: comment ? String(comment).trim() : "",
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

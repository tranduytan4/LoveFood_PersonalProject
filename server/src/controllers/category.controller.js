const Category = require("../models/category.model");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories };

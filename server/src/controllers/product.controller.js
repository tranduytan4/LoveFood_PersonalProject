const Product = require("../models/product.model");

const getProducts = async (req, res, next) => {
  try {
    const { search = "", category = "", sort = "newest" } = req.query;

    const products = await Product.findWithFilter({ search, category, sort });

    res.json({ data: products });
  } catch (err) {
    next(err);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findBySlug(slug);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProductBySlug };


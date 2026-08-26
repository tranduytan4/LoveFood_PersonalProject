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

const getPopularProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 9;
    const products = await Product.findPopular(limit);
    res.json({ data: products });
  } catch (err) {
    next(err);
  }
};

const getDealProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 12;
    const products = await Product.findDeals(limit);
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

module.exports = { getProducts, getPopularProducts, getDealProducts, getProductBySlug };

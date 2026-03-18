const Product = require("../models/product.model");
const Category = require("../models/category.model");

const getProducts = async (req, res, next) => {
  try {
    const { search = "", category = "", sort = "newest" } = req.query;

    const filter = { isAvailable: true };

    if (search.trim()) filter.$text = { $search: search.trim() };

    if (category.trim()) {
      const foundCategory = await Category.findOne({ slug: category.trim() });
      if (foundCategory) filter.category = foundCategory._id;
      else filter.category = null; // không match -> trả rỗng
    }

    const sortMap = {
      newest: { createdAt: -1 },
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      bestSeller: { soldCount: -1 },
    };

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sortMap[sort] || sortMap.newest);

    res.json({ data: products });
  } catch (err) {
    next(err);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, isAvailable: true })
      .populate("category", "name slug");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProductBySlug };

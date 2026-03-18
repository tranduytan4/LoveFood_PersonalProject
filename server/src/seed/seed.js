require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/category.model");
const Product = require("../models/product.model");

const runSeed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Product.deleteMany({});
  await Category.deleteMany({});

  const categories = await Category.insertMany([
    { name: "Burger", slug: "burger" },
    { name: "Pizza", slug: "pizza" },
    { name: "Drink", slug: "drink" },
  ]);

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

  await Product.insertMany([
    {
      name: "Cheese Burger",
      slug: "cheese-burger",
      price: 45000,
      category: catMap.burger,
      description: "Burger bò + phô mai",
    },
    {
      name: "Pepperoni Pizza",
      slug: "pepperoni-pizza",
      price: 99000,
      category: catMap.pizza,
      description: "Pizza pepperoni size M",
    },
    {
      name: "Coca Cola",
      slug: "coca-cola",
      price: 15000,
      category: catMap.drink,
      description: "Lon 330ml",
    },
  ]);

  console.log("✅ Seed done");
  process.exit(0);
};

runSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});

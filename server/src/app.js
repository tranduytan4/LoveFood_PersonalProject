const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { notFound } = require("./middlewares/notFound.middleware");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", routes);

// Root
app.get("/", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

// Seed endpoint for cloud deployment when web shell is restricted
const { runSeed } = require("./seed/seed");
app.get("/api/seed", async (req, res, next) => {
  try {
    await runSeed(false);
    res.json({
      success: true,
      message: "Database seeded successfully! You can now log in with Admin (admin@lovefood.com / admin123) or Customer (tun.nguyen@example.com / password123).",
    });
  } catch (err) {
    next(err);
  }
});

// 404 + Error handler (luôn đặt cuối cùng)
app.use(notFound);
app.use(errorHandler);

module.exports = app;

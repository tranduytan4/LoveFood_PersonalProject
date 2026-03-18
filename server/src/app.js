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

// 404 + Error handler (luôn đặt cuối cùng)
app.use(notFound);
app.use(errorHandler);

module.exports = app;

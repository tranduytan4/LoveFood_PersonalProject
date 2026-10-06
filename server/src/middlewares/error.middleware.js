const errorHandler = (err, req, res, next) => {
  console.error("Server Error:", err.message || err);

  // PostgreSQL unique violation error
  if (err.code === "23505") {
    return res.status(400).json({
      message: "The provided information (email, phone, or code) is already in use.",
    });
  }

  // PostgreSQL foreign key violation error
  if (err.code === "23503") {
    return res.status(400).json({
      message: "The referenced item (category, product, or order) does not exist.",
    });
  }

  // PostgreSQL invalid data format (e.g. invalid integer or uuid)
  if (err.code === "22P02") {
    return res.status(400).json({
      message: "Invalid parameter or data type format.",
    });
  }

  res.status(err.status || err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
};

module.exports = { errorHandler };

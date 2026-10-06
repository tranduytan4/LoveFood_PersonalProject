const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message || err);

  // PostgreSQL unique violation error
  if (err.code === "23505") {
    return res.status(400).json({
      message: "The provided information (email or phone number) is already registered in the system.",
    });
  }

  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
};

module.exports = { errorHandler };

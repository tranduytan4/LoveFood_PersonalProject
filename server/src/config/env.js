require("dotenv").config();

const env = {
  port: process.env.PORT || 5000,
  pgHost: process.env.PGHOST || "localhost",
  pgPort: parseInt(process.env.PGPORT, 10) || 5432,
  pgUser: process.env.PGUSER || "postgres",
  pgPassword: process.env.PGPASSWORD || "",
  pgDatabase: process.env.PGDATABASE || "smart_food_order",
};

module.exports = { env };


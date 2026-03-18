const app = require("./app");
const { connectDb } = require("./config/db");
const { env } = require("./config/env");

const startServer = async () => {
  if (!env.mongoUri) {
    console.error("❌ Missing MONGO_URI in .env");
    process.exit(1);
  }

  await connectDb(env.mongoUri);

  app.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port}`);
  });
};

startServer();
  
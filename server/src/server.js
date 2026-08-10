const app = require("./app");
const { initDb } = require("./config/db");
const { env } = require("./config/env");

const startServer = async () => {
  await initDb();

  app.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port}`);
  });
};

startServer();

  
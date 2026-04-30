import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { app } from "./app.js";

async function startServer() {
  try {
    await connectDatabase();

    app.listen(env.port, () => {
      console.log(`API server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start API server");
    console.error(error);
    process.exit(1);
  }
}

startServer();

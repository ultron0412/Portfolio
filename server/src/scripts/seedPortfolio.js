import { connectDatabase } from "../config/database.js";
import { defaultPortfolio } from "../data/defaultPortfolio.js";
import { Portfolio } from "../models/Portfolio.js";
import { User } from "../models/User.js";

async function run() {
  try {
    await connectDatabase();

    await User.deleteMany({});
    await Portfolio.deleteMany({});

    const adminUser = await User.create({
      username: "ayush",
      email: "admin@ayush.dev",
      password: process.env.ADMIN_PASSWORD || "Admin123!",
      role: "admin",
    });

    const portfolio = await Portfolio.create(defaultPortfolio);

    console.log(`Seeded admin: ${adminUser.email}`);
    console.log(`Seeded portfolio for: ${portfolio.personal.name}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed portfolio");
    console.error(error);
    process.exit(1);
  }
}

run();

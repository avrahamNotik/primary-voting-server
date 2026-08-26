import { db } from "./index";

const testConnection = async () => {
  try {
    await db.execute("SELECT 1");

    console.log("✅ Database connected successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:", error);

    process.exit(1);
  }
};

testConnection();

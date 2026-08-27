import bcrypt from "bcrypt";
import { db } from "./index";
import { users } from "./schema";

const PASSWORD = "123456";

const ADMINS_COUNT = 5;

const seed = async () => {
  console.log("🌱 Starting database seed...");

  /*
   * =========================
   * Password hash
   * =========================
   */

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  /*
   * =========================
   * Create admin users
   * =========================
   */

  console.log(`👑 Creating ${ADMINS_COUNT} admin users...`);

  const adminValues = Array.from({ length: ADMINS_COUNT }, (_, index) => ({
    givenName: `מנהל${index + 1}`,
    familyName: `מערכת${index + 1}`,
    email: `admin${index + 1}@seed.local`,
    passwordHash,
    role: "admin" as const,
  }));

  const createdAdmins = await db
    .insert(users)
    .values(adminValues)
    .onConflictDoNothing()
    .returning({
      id: users.id,
      email: users.email,
    });

  console.log(`✅ Created ${createdAdmins.length} admin users`);

  /*
   * =========================
   * Done
   * =========================
   */

  console.log("");
  console.log("=================================");
  console.log("🌱 SEED COMPLETED SUCCESSFULLY");
  console.log("=================================");
  console.log(`👑 Admins: ${createdAdmins.length}`);
  console.log(`🔑 Password: ${PASSWORD}`);
  console.log("=================================");

  console.log("");
  console.log("Admin users:");

  createdAdmins.forEach((admin) => {
    console.log(`- ${admin.email}`);
  });
};

seed()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });

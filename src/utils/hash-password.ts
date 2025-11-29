import bcryptjs from "bcryptjs";

/**
 * Utility script to hash passwords for creating users in the database
 * Usage: npx tsx src/utils/hash-password.ts <password>
 *
 * Example:
 *   npx tsx src/utils/hash-password.ts mypassword
 *   Output: $2a$10$...hash...
 *
 * Then run this SQL to insert the admin user:
 *   INSERT INTO users (username, password, role) VALUES ('admin', '<hash>', 'admin');
 */

const password = process.argv[2];

(async () => {
  if (!password) {
    console.error("Please provide a password as an argument");
    console.error("Usage: npx tsx src/utils/hash-password.ts <password>");
    process.exit(1);
  }

  const hash = await bcryptjs.hash(password, 10);
  console.log("Hashed password:", hash);
  console.log("\nSQL command to insert admin user:");
  console.log(
    `INSERT INTO users (username, password, role, created_at) VALUES ('admin', '${hash}', 'admin', NOW());`,
  );
})();

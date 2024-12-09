/** Common config for message.ly */

// Load environment variables
require("dotenv").config();

console.log("Loading Environment Variables:");
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("SECRET_KEY:", process.env.SECRET_KEY);

const DB_URI = process.env.DATABASE_URL || 
              (process.env.NODE_ENV === "test"
                ? "postgresql://mrmongol:Ozusen18@localhost/messagely_test"
                : "postgresql://mrmongol:Ozusen18@localhost/messagely");

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
};

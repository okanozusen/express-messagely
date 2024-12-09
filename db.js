/** Database connection for message.ly */

const { Client } = require("pg");
const { DB_URI } = require("./config");

console.log("Connecting to database:", DB_URI);

const client = new Client({
  connectionString: DB_URI,
});

client.connect().catch((err) => {
  console.error("Database connection error:", err.stack);
});

module.exports = client;

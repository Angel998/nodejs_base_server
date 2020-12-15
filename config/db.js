const mysql = require("mysql");
const { errorLog, processLog } = require("../utils/log");

const client = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

client.connect((err) => {
  if (err) {
    errorLog("Database: Error in connection");
    console.log(err);
    return process.exit(1);
  }
  processLog("Database: Connected");
});

client.on("error", (err) => {
  errorLog(`Database: Unhandled error: ${err.message}`);
  process.exit(1);
});

module.exports = client;

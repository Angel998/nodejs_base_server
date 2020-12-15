const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const server = require("./server/index");

async function startServer() {
  server.initServer();
}

process.on("unhandledRejection", (err, promise) => {
  console.log(`unhandledRejection: ${err}`);
  server.close();
});

startServer();

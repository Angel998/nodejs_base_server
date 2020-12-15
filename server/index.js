const express = require("express");
const cors = require("cors");
const { processLog } = require("../utils/log");

const middlewares = require("../middleware");
const routes = require("../routes");

const APP_PORT = process.env.APP_PORT || 5000;
let server = null;
let app = null;

function initServer() {
  if (server) return;

  app = express();
  app.use(
    cors({
      origin: process.env.APP_CLIENT_ORIGIN,
    })
  );
  app.use(express.json());
  middlewares(app);
  routes(app);

  server = app.listen(APP_PORT, () => {
    processLog(
      `Server running in ${process.env.NODE_ENV} mode on port ${APP_PORT}`
    );
  });
}

function close() {
  if (!server) return;
  server.close(() => {
    processLog("Server: Cerrando servidor");
    process.exit(1);
  });
}

module.exports = {
  app,
  server,
  initServer,
  close,
};

const auth = require("./auth");

const error = require("../middleware/error");

/*
 * api.website.com/route
 */
module.exports = (expressApp) => {
  expressApp.use("/auth", auth);
  expressApp.use(error);
};

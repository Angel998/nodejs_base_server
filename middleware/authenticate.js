const ErrorResponse = require("../utils/ErrorResponse");
const { verifyToken, generateToken } = require("../utils/jwt");
const UserModel = require("../models/User");

/**
 * @description Valida que un usuario tenga sesion iniciada a traves de su TOKEN
 * @param {String | Array} userType
 */
const validateMiddleware = (userType = null) => {
  return async function (req) {
    const authHeader = req.headers[process.env.AUTH_HEADER];
    if (!authHeader) ErrorResponse.notAcceptable();

    const token = authHeader.replace(process.env.AUTH_BEARER, "");
    if (!token) ErrorResponse.notAcceptable();

    const dataInToken = verifyToken(token);
    if (!dataInToken) ErrorResponse.sessionEnd();

    if (userType) {
      // Verificar si el user type concuerda con uno de los TYPES pasados en esta funcion
      if (Array.isArray(userType)) {
        const typeIndex = userType.findIndex(
          (type) => type == dataInToken.user.type
        );
        if (typeIndex < 0) {
          ErrorResponse.notAuthorized();
        }
      }

      if (typeof userType == "string" && userType != dataInToken.user.type) {
        ErrorResponse.notAuthorized();
      }
    }

    const user = await UserModel.getUserAuthWithId(dataInToken.user.id);
    if (!user.enabled) {
      ErrorResponse.notAuthorized();
    }

    req.user = user;
    req.token = generateToken({
      user,
    });
  };
};

module.exports = validateMiddleware;

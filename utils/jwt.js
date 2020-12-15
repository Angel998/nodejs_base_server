const jwt = require("jsonwebtoken");

/**
 * @description Genera un JSON Web Token
 * @param {Object} payload
 * @returns {String}
 */
const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
  return token;
};

/**
 * @description Retorna un objeto de un Token o Null
 * @param {String} token
 * @returns {Object | Null}
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {}
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
};

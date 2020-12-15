const bcrypt = require("bcryptjs");
const { errorLog } = require("./log");

/**
 * @description Encripta una clave o returna nulo en caso de no poder
 * @param {String} string_password
 * @returns {String | Null}
 */
function hashPassword(string_password) {
  try {
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(string_password, salt);
    return hash;
  } catch (err) {
    errorLog(`Hash: ${err.message}`);
  }
  return null;
}

/**
 * @description Compara un texto plano con un hash y retorna si a caso coindicen
 * @param {String} string_password
 * @param {String} hash_password
 * @returns {Boolean}
 */
function comparePassword(string_password, hash_password) {
  return bcrypt.compareSync(string_password, hash_password);
}

module.exports = {
  hashPassword,
  comparePassword,
};

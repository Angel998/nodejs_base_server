/**
 * @description Retorna la fecha actual en formato yyyy-mm-dd h:m:s
 * @returns {String}
 */
const getCurrentDateStr = () => {
  const date = new Date();
  const month = getDateValue(date.getMonth());
  const day = getDateValue(date.getDate());

  const hour = getDateValue(date.getHours());
  const minutes = getDateValue(date.getMinutes());

  return `${date.getFullYear()}-${month}-${day} ${hour}:${minutes}:${date.getSeconds()}`;
};

/**
 * @description Retorna el valor de un elemento de la fecha convertido a formato 00, por ejemplo si es 9, seria convertido a 09
 * @param {Number} value
 * @returns {String}
 */
const getDateValue = (value) => {
  if (value < 10) {
    return `0${value}`;
  }
  return `${value}`;
};

/**
 * @description Crea una cadena de texto aleatoria
 * @param {Number} length
 * @returns {String}
 */
const getRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

module.exports = {
  getRandomString,
  getCurrentDateStr,
  getDateValue,
};

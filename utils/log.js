const { getCurrentDateStr } = require("./string");

/**
 * @description Imprime una cadena string en el archivo
 * log para errores
 * @param {String} str
 */
function errorLog(str) {
  const str_log = `${getCurrentDateStr()} Error -> ${str}`;
  console.log(str_log);
}

/**
 * @description Imprime una cadena string en el archivo log para eventos
 * @param {String} str
 */
function processLog(str) {
  const str_log = `${getCurrentDateStr()} Log -> ${str}`;
  console.log(str_log);
}

module.exports = {
  errorLog,
  processLog,
};

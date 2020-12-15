const { isEmpty } = require("./validate");

/**
 * @description Retorna un objeto a partir de un JSON String
 * @param {String} string_json
 * @returns {Object}
 */
const jsonParse = (string_json) => {
  if (isEmpty(string_json) || typeof string_json != "string") return {};

  let response = {};
  try {
    response = JSON.parse(string_json);
  } catch (err) {
    response = {};
  }
  return response;
};

/**
 * @description Convierte un JSON a array { id: 1, name: 'User'} => [1, 'User']
 * @param {Object} jsonObject
 */
const jsonToArray = (jsonObject) => {
  const response = [];

  Object.keys(jsonObject).forEach((key) => {
    response.push(jsonObject[key]);
  });

  return response;
};

module.exports = {
  jsonParse,
  jsonToArray,
};

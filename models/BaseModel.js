const Database = require("../libraries/Database");

class BaseModel {
  constructor() {
    this.db = new Database();
  }

  /**
   * @description Transforma un objeto en un Array de parametros para la base de datos
   * @param {Object} objectInput
   * @returns {Array}
   */
  objToArray(objectInput) {
    const response = [];

    Object.keys(objectInput).forEach((key) => {
      response.push(objectInput[key]);
    });

    return response;
  }

  /**
   * @description Convierte un Objeto a String JSON
   * @param {Object} expectedObject
   * @returns {String}
   */
  toStrJson(expectedObject) {
    let response = "{}";
    try {
      response = JSON.stringify(expectedObject);
    } catch (err) {
      response = "{}";
    }
    return response;
  }
}

module.exports = BaseModel;

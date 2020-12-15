const { errorLog } = require("../utils/log");

class Database {
  constructor() {
    this.PARAMS_IDENTIFIER = "__";
    this.db = require("../config/db");
  }

  /**
   * @description Consulta a la base de datos y retorna su respuesta
   * @param {String} query_string
   * @param {Array} params
   * @returns {Object}
   */
  async query(query_string, params = []) {
    query_string = this.prepareQuery(query_string, params);
    try {
      const response = await this.queryDB(query_string, params);
      return response;
    } catch (err) {
      errorLog(
        `Database: Error Query: ${query_string}, params: ${params} \nStack: ${err.stack}\n-------------`
      );
    }

    return false;
  }

  /**
   * @description Ejecuta un query en la base de datos
   * @param {String} query_string
   * @param {Array} params
   */
  queryDB(query_string, params = []) {
    return new Promise((resolve, reject) => {
      this.db.query(query_string, params, (err, results) => {
        if (err) {
          return reject(err);
        }

        resolve({
          rows: results[0],
        });
      });
    });
  }

  /**
   * @description Consulta a la base de datos y retorna un elemento o un nulo
   * @param {String} query_string
   * @param {Array} params
   * @returns {Object | Null}
   */
  async single(query_string, params = []) {
    const response = await this.query(query_string, params);
    if (!response) return null;

    return response.rows[0];
  }

  /**
   * @description Consulta a la base de datos y retorna un elemento o un nulo
   * @param {String} query_string
   * @param {Array} params
   * @returns {Array | Null}
   */
  async resultSet(query_string, params = []) {
    const response = await this.query(query_string, params);
    if (!response) return [];

    return response.rows;
  }

  /**
   * @description Llama a la funcion que retorna un BOOLEAN de forma automatica y retorna su valor TRUE o FALSE
   * @param {String} function_name
   * @param {Array} params
   * @returns {Boolean}
   */
  async exists(function_name, params = []) {
    const query_string = `select * from ${function_name} as exists`;
    const response = await this.single(query_string, params);
    return response ? response.exists : true;
  }

  /**
   * @description Llama a una funcion que retorna un boolean TRUE | FALSE
   * @param {String} function_name
   * @param {Array} params
   * @returns {Boolean}
   */
  async success(function_name, params = []) {
    const query_string = `select * from ${function_name} as success`;
    const response = await this.single(query_string, params);
    return response ? response.success : true;
  }

  /**
   * @description Reemplaza los parametros en un query y lo retorna en el formato correcto
   * @param {String} query_string
   * @param {Array} params
   * @returns {String}
   */
  prepareQuery(query_string, params = []) {
    if (params.length == 0) return query_string;

    let params_str = "";
    for (let index = 0; index < params.length; index++) {
      params_str += "?";
      if (index < params.length - 1) {
        params_str += ", ";
      }
    }

    return query_string.replace(this.PARAMS_IDENTIFIER, params_str);
  }
}

module.exports = Database;

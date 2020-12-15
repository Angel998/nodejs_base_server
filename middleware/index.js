const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @description Funcion de respuesta general
 * @param {Object} req
 * @param {Object} res
 * @param {Object} data
 * @param {Object} anotherData
 * @param {Number} statusCode
 */
const responseFunction = (
  req,
  res,
  data = {},
  anotherData = {},
  statusCode = 200
) => {
  const baseData = {
    success: true,
  };
  if (
    data != null &&
    (Array.isArray(data) ||
      (typeof data == "object" && Object.keys(data).length > 0))
  ) {
    baseData.data = data;
  }

  if (req.token) {
    baseData.token = req.token;
  }

  res
    .json({
      ...baseData,
      ...anotherData,
    })
    .status(statusCode);
};

/**
 * Agrega una funcion al objeto Request para enviar respuestas al cliente
 */
const addResponseFunction = function (req, res, next) {
  req.response = (data = {}, anotherData = {}, statusCode = 200) => {
    responseFunction(req, res, data, anotherData, statusCode);
  };

  /**
   * @description Valida si un elemento es Null y de serlo envia un error
   */
  req.isNull = (element, data = {}, details = {}) => {
    if (element) return;

    ErrorResponse.error(data, details);
  };

  /**
   * @description Revisa si un elemento es nulo o contiene un valor, si contiene algo envia una respuesta al cliente, sino envia un error
   * @param {Object|Null} element
   * @param {Object} data Data para el error o AnotherData para respuesta
   * @param {Object} details Detalles extra para el error
   */
  req.responseOrIsNull = (element, data = {}, details = {}) => {
    if (element) return req.response(element, data);

    req.isNull(element, data, details);
  };

  /**
   * @description Envia el estado success en caso de ser TRUE o un error si es FALSE
   * @param {Boolean} success
   * @param {Object} data
   * @param {Object} details
   */
  req.success = (success, data = {}, details = {}) => {
    if (success) return req.response(data);

    ErrorResponse.error(data, details);
  };
  next();
};

module.exports = (expressApp) => {
  expressApp.use(addResponseFunction);
};

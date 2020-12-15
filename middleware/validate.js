const { validateParams, defaultParams } = require("../utils/validate");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @description Valida parametros y tambien asigna valores por defecto en caso de requerirlo
 * @param {Object} expectedParams
 * @param {Object} defaultValues
 * @param {Function | Null} validateFunction
 */
const validateMiddleware = (
  expectedParams = {},
  defaultValues = {},
  validateFunction = null
) => {
  return async function (req) {
    if (typeof validateFunction == "function") {
      const validationResponse = await validateFunction(req, req.params);
      if (validationResponse.errors) {
        ErrorResponse.error(validationResponse.errors);
      }
      req.body = validationResponse.data;
      return;
    }

    const allKeyParams = [];

    if (!defaultValues) defaultValues = {};
    if (!expectedParams) expectedParams = {};

    if (Object.keys(defaultValues).length > 0) {
      req.body = defaultParams(defaultValues, req.body);
      Object.keys(defaultValues).forEach((key) => allKeyParams.push(key));
    }

    if (Object.keys(expectedParams).length > 0) {
      const errors = validateParams(expectedParams, req.body);
      if (errors) {
        ErrorResponse.error(errors);
      }
      Object.keys(expectedParams).forEach((key) => allKeyParams.push(key));
    }

    if (allKeyParams.length == 0) return;
    Object.keys(req.body).forEach((key) => {
      if (allKeyParams.findIndex((keyParam) => keyParam == key) == -1) {
        delete req.body[key];
      }
    });
  };
};

module.exports = validateMiddleware;

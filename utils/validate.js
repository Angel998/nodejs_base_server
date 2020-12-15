const validator = require("validator");

/**
 *
 * @param {Object} expectedParams
 * @param {Object} objectParams
 * @returns {Object | Null}
 */
const validateParams = (expectedParams = {}, objectParams) => {
  const errors = {};

  if (isEmpty(objectParams)) objectParams = {};

  Object.keys(expectedParams).forEach((key) => {
    const param = expectedParams[key];
    const paramError = typeof param == "string" ? param : param.error;
    const paramType = param.type ? param.type : "string";

    if (!param.empty && isEmpty(objectParams[key])) {
      errors[key] = paramError || "Parametro requerido";
      return;
    }

    if (!isEmpty(paramType)) {
      if (paramType == "email") {
        if (!validator.isEmail(objectParams[key])) {
          errors[key] = paramError || "Se esperaba un correo";
          return;
        }
      } else if (paramType == "array") {
        if (!Array.isArray(objectParams[key])) {
          errors[key] = paramError || "Se esperaba un arreglo de datos";
          return;
        }
        if (param.not_empty && objectParams[key].length == 0) {
          errors[key] = paramError || "El arreglo no puede estar vacio";
          return;
        }
      } else {
        if (typeof objectParams[key] != paramType) {
          errors[key] = "Tipo de dato incorrecto";
          return;
        }
      }
    }
  });

  return isEmpty(errors) ? null : errors;
};

/**
 * @description Asigna valores por defecto a parametros
 * @param {Object} defaultParams
 * @param {Object} objectParams
 */
const defaultParams = (defaultParams, objectParams) => {
  if (isEmpty(objectParams)) {
    objectParams = {};
  }
  Object.keys(defaultParams).forEach((key) => {
    const param = defaultParams[key];
    const paramType = param.type;
    const paramDefaultValue =
      typeof param.default != "undefined" ? param.default : param;

    if (paramType) {
      if (paramType == "array" && !Array.isArray(objectParams[key])) {
        objectParams[key] = paramDefaultValue;
      } else if (typeof objectParams[key] != paramType) {
        objectParams[key] = paramDefaultValue;
      }
    } else if (isEmpty(objectParams[key])) {
      objectParams[key] = paramDefaultValue;
    }
  });
  return objectParams;
};

const isImageExtension = (extension) => {
  return ["jpg", "jpeg", "png"].findIndex((ext) => ext == extension) >= 0;
};

/**
 * @description Transforma un String a Number, retorna NULL en caso de no lograrlo
 * @param {String} value
 * @returns {Number | Null}
 */
const strToNumber = (value) => {
  let number = null;

  try {
    number = Number.parseFloat(value);
    if (isNaN(number) || isEmpty(number)) {
      number = null;
    }
  } catch (err) {}

  return number;
};

/**
 * @description Valida si un objeto es una coordenata y tambien elimina las claves que no necesita
 * @param {Object} object {lat, lng}
 * @returns {Null | Object}
 */
const isCoordinate = (object) => {
  const validations = {
    lat: {
      type: "number",
      error: "Latitud incorrecta",
    },
    lng: {
      type: "number",
      error: "Longitud incorrecta",
    },
  };
  const errors = validateParams(validations, object);
  if (errors) return errors;

  Object.keys(object).forEach((key) => {
    if (isEmpty(validations[key])) {
      delete object[key];
    }
  });
};

const isEmpty = (value) =>
  value === undefined ||
  value === "undefined" ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

module.exports = {
  validateParams,
  defaultParams,
  isEmpty,
  strToNumber,
  isImageExtension,
  isCoordinate,
};

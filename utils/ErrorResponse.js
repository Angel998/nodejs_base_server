const { defaultParams } = require("../utils/validate");

class ErrorResponse extends Error {
  constructor(
    data = {},
    statusCode = 400,
    error = "Ocurrio un error inesperado"
  ) {
    super(error);
    this.statusCode = statusCode;
    this.custom = true;
    this.data = data || {};
  }

  /**
   * @description Envia directamente al cliente una respuesta de error a su solicitud
   * @param {Object} data
   * @param {Object} details
   */
  static error(
    data = {},
    details = {
      error: "Ocurrio un error inesperado",
      statusCode: 400,
    }
  ) {
    if (!data) data = {};

    details = defaultParams(
      {
        error: "Ocurrio un error inesperado",
        statusCode: 400,
      },
      details
    );

    throw new ErrorResponse(data, details.statusCode, details.error);
  }

  /**
   * @description Genera un error 404
   * @param {Object} data
   */
  static notFound(data = {}, addMessage = true) {
    if (!data) data = {};

    throw new ErrorResponse(
      data,
      404,
      addMessage ? "Elemento no encontrado" : null
    );
  }

  /**
   * @description La sesion finalizo
   */
  static sessionEnd() {
    const error = new ErrorResponse(null, 403, "La sesion finalizo");
    error.expired = true;
    throw error;
  }

  /**
   * @description La peticion no esta autorizada para continuar
   */
  static notAuthorized() {
    const error = new ErrorResponse(null, 403, "Acceso no autorizado");
    error.not_authorized = true;
    throw error;
  }

  /**
   * @description Request no aceptable, terminar conexion inmediatamente
   */
  static notAcceptable() {
    const error = new ErrorResponse(null, 406, "Request inaceptable");
    error.not_acceptable = true;
    throw error;
  }
}

module.exports = ErrorResponse;

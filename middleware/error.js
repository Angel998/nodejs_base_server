const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV == "dev") {
    console.log("Route error: ", err.message);
    // console.log(err.stack);
  }

  const customErr = { ...err };
  // Finalizar request inmediatamente
  if (err.not_acceptable) {
    return res.status(customErr.statusCode || 406).end();
  }

  let statusCode = 500;
  let data = {};

  if (customErr.statusCode) {
    statusCode = customErr.statusCode;
  }
  if (customErr.data) {
    data = customErr.data;
  }

  const dataResponse = {
    success: false,
    data,
  };

  if (
    err.message != "Ocurrio un error inesperado" &&
    err.message != null &&
    err.message != "null"
  ) {
    dataResponse.error = err.message;
  }
  if (err.expired) {
    dataResponse.expired = true;
    if (Object.keys(customErr.data).length == 0) {
      delete dataResponse.data;
    }
  }
  if (req.token) {
    dataResponse.token = req.token;
  }

  res.status(statusCode || 500).json(dataResponse);
};

module.exports = errorHandler;

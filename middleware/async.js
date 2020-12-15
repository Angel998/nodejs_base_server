/**
 * @description Ejecuta una o varias funciones con try/catch, en caso
 * de generar error envia la informacion al Middleware Error
 * @param  {...Function} functions
 */
const asyncHandler = (...functions) => async (req, res, next) => {
  for (let index = 0; index < functions.length; index++) {
    const currentFunction = functions[index];
    try {
      await currentFunction(req, res, next);
    } catch (err) {
      return next(err);
    }
  }
};

module.exports = asyncHandler;

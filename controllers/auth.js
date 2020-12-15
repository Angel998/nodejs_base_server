const ErrorResponse = require("../utils/ErrorResponse");
const AsyncHandler = require("../middleware/async");
const ValidateHandler = require("../middleware/validate");

const userTypes = require("../config/types").user;
const UserModel = require("../models/User");
const crypt = require("../utils/crypt");
const jwt = require("../utils/jwt");

/**
 * @description Iniciar sesion desde formulario normal
 */
const loginUser = AsyncHandler(
  ValidateHandler({
    user: "Usuario requerido",
    password: "Clave requerida",
  }),
  async (req) => {
    const userAuth = await UserModel.getUserToAuth(req.body.user);
    if (!userAuth) {
      ErrorResponse.notFound(
        {
          user: "Usuario no encontrado",
        },
        false
      );
    }

    if (!userAuth.enabled) {
      ErrorResponse.error({
        user: "Usuario inhabilitado",
      });
    }

    if (!crypt.comparePassword(req.body.password, userAuth.password)) {
      ErrorResponse.error(null, {
        error: "Usuario o clave incorrecta",
      });
    }

    const user = await UserModel.getUserAuthWithId(userAuth.id);
    const token = jwt.generateToken({
      user: user,
    });

    req.response(null, {
      token,
    });
  }
);

/**
 * @description Registrarse desde formulario normal de cliente
 */
const registerUser = AsyncHandler(
  ValidateHandler({
    name: "Nombre requerido",
    email: {
      type: "email",
      error: "Correo invalido",
    },
    password: "Clave requerida",
  }),
  async (req) => {
    const userFields = req.body;
    const existsWithEmail = await UserModel.existsUserWithEmail(
      userFields.email
    );
    if (existsWithEmail) {
      ErrorResponse.error({
        email: "Este correo ya se encuentra en uso",
      });
    }

    userFields.password = crypt.hashPassword(userFields.password);

    if (!userFields.password) {
      ErrorResponse.error(null, {
        error:
          "Ocurrio un error al almacenar la clave, por favor intente de nuevo",
        statusCode: 500,
      });
    }

    const newUser = await UserModel.addUserFromRegisterForm({
      ...userFields,
      type: userTypes.USER_CLIENT,
      privileges: {},
    });

    if (!newUser) {
      ErrorResponse.error(null, {
        error:
          "Ocurrio un error en el registro del usuario, por favor intente de nuevo",
        statusCode: 500,
      });
    }

    const token = jwt.generateToken({
      user: newUser,
    });
    req.response(null, {
      token,
    });
  }
);

module.exports = {
  loginUser,
  registerUser,
};

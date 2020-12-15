const formidable = require("formidable");
const fs = require("fs");

const { UPLOAD_FOLDER } = require("../config/config");
const { getRandomString } = require("../utils/string");
const { isEmpty } = require("../utils/validate");
const { errorLog } = require("../utils/log");

const getParsedForm = (
  req,
  options = {
    saveFiles: false,
    folderToSave: null,
    getFields: false,
    maxFilesToSave: null,
  }
) => {
  return new Promise((resolve, _) => {
    const form = new formidable.IncomingForm();
    const files = [];
    const fields = {};

    form.on("error", function (err) {
      errorLog(`LFILE: ${err}`);
      if (options.getFields) {
        resolve({ files: [], fields: {} });
      } else {
        resolve([]);
      }
    });
    form.on("field", function (name, value) {
      fields[name] = value;
    });
    form.on("file", (_, file) => {
      files.push(file);
    });
    form.on("end", async () => {
      let files_response = [];
      if (options.saveFiles) {
        files_response = await saveFiles(
          files,
          options.folderToSave,
          options.maxFilesToSave
        );
      } else {
        files_response = files;
      }

      if (options.getFields) {
        resolve({ files: files_response, fields });
      } else {
        resolve(files_response);
      }
    });
    form.parse(req);
  });
};

const saveFiles = (
  files,
  folder_name = null,
  max_files_to_save = null,
  validateExtensionFunction = null
) => {
  return new Promise(async (resolve, _) => {
    const new_files = [];
    let EXTENDED_PATH_TO_SAVE = `${UPLOAD_FOLDER}/`;

    if (!isEmpty(folder_name)) {
      EXTENDED_PATH_TO_SAVE = `${EXTENDED_PATH_TO_SAVE}${folder_name}`;
      createFolderIfNotExists(EXTENDED_PATH_TO_SAVE);
    }

    const max_iterations =
      max_files_to_save > 0 && max_files_to_save <= files.length
        ? max_files_to_save
        : files.length;

    for (let index = 0; index < max_iterations; index++) {
      const file = files[index];

      const file_info = {
        oldPath: file.path,
        extension: getFileExtension(file.name),
      };

      // Si hay una funcion para validar la extension del archivo
      if (
        validateExtensionFunction &&
        typeof validateExtensionFunction == "function"
      ) {
        if (!validateExtensionFunction(file_info.extension)) {
          continue;
        }
      }

      file_info.name = getRandomFileName(file_info.extension);
      const new_file_path = `${EXTENDED_PATH_TO_SAVE}/${file_info.name}`;

      if (await saveFile(file_info.oldPath, new_file_path)) {
        file_info.shortPath = getShortFilePath(file_info.name, folder_name);
        new_files.push(file_info);
      }
    }

    resolve(new_files);
  });
};

/**
 * @description Crea carpetes con sus subcarpetas correspondientes
 * @param {String} folder_name
 */
const createFolderIfNotExists = (folder_name) => {
  if (fs.existsSync(folder_name)) return;
  fs.mkdirSync(folder_name, { recursive: true });
};

/**
 * @description Retorna la ruta corta a un archivo, por ejemplo /files/images
 * @param {String} file_name
 * @param {String | Null} folder_name
 * @returns {String}
 */
const getShortFilePath = (file_name, folder_name = null) => {
  let short_path = "";
  if (!isEmpty(folder_name)) {
    short_path = folder_name;
  }
  return `${short_path}/${file_name}`;
};

/**
 * @description Retorna la extension de un archivo
 * @param {String} file_name
 * @returns {String}
 */
const getFileExtension = (file_name) => {
  return file_name.split(".").pop();
};

/**
 * @description Crea un nombre aleatorio
 * @param {String} file_extension
 */
const getRandomFileName = (file_extension) => {
  return `${getRandomString(30)}.${file_extension}`;
};

/**
 * @description Guarda un archivo enviado desde un formulario
 * @param {String} file_path
 * @param {String} new_file_path
 */
const saveFile = (file_path, new_file_path) => {
  return new Promise((resolve, _) => {
    fs.rename(file_path, new_file_path, function (err) {
      if (err) {
        errorLog(`LFILE: SaveFile - ${err}`);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

/**
 * @description Elimina un archivo de la memoria del servidor
 * @param {String} path
 */
const deleteFile = (path, useFullPath = true) => {
  return new Promise((resolve) => {
    if (isEmpty(path)) return resolve(false);

    let file_path = path;

    if (useFullPath && file_path.indexOf(UPLOAD_FOLDER) < 0) {
      file_path = `${UPLOAD_FOLDER}/${file_path}`;
    }

    if (!fs.existsSync(file_path)) {
      errorLog(
        `No se puede borrar el archivo por que no existe: ${path} | ${file_path}`
      );
      return resolve(false);
    }
    fs.unlink(file_path, (err) => {
      if (err) {
        errorLog(`Error intentando borrar archivo: ${path} | ${err}`);
        return resolve(false);
      }
      resolve(true);
    });
  });
};

module.exports = {
  deleteFile,
  getParsedForm,
  saveFiles,
  saveFile,
};

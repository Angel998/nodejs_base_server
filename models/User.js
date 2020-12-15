const BaseModel = require("./BaseModel");

class User extends BaseModel {
  async getUserToAuth(username) {
    return null;
  }

  async getUserAuthWithId(id) {
    return null;
  }

  async existsUserWithEmail(email) {
    return false;
  }

  async addUserFromRegisterForm({}) {
    return null;
  }
}

module.exports = new User();

const BaseModel = require("./BaseModel");

class SiteModel extends BaseModel {
  getGeneralSiteClientData() {
    return {
      navigationLinks: this.getNavigationCategoryLinks(),
      contactLinks: this.getContactLinks(),
      socialLinks: this.getSocialLinks(),
      storeLocation: this.getStoreLocation(),
    };
  }

  getNavigationCategoryLinks() {
    return [{ href: "/link", text: "Enlaces" }];
  }

  getContactLinks() {
    return [
      {
        title: "Direccion",
        text: "",
        href: "",
      },
      {
        title: "Correo",
        text: "mail@server.com",
        href: "",
      },
    ];
  }

  getSocialLinks() {
    return [
      {
        href: "https://facebook.com",
        icon: "icon-facebook",
      },
      {
        href: "https://instagram.com",
        icon: "icon-whatsapp",
      },
      {
        href: "https://whatsapp.com",
        icon: "icon-instagram",
      },
    ];
  }

  getStoreLocation() {
    return {
      coordinates: {},
      frame: "https://www.google.com/maps/embed/v1/place?q=PLACE",
    };
  }
}

module.exports = new SiteModel();

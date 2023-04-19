class AbstractPeople {
  constructor(id) {
    if (this.constructor == AbstractPeople) {
      this.id = id;
    }
    this.id = id;
  }

  async init(app) {
    const character = await app.db.swPeople.findOne({
      where: { id: this.id },
    });
    if (character) {
      this.name = character.name;
      this.mass = parseInt(character.mass);
      this.height = parseInt(character.height);
      this.homeworldName = character.homeworldName;
      this.homeworldId = parseInt(character.homeworldId);
      return this;
    } else {
      return app.swapiFunctions
        .genericRequest(
          `${process.env.URL_API}people/${this.id}/`,
          "GET",
          null,
          true
        )
        .then((data) => {
          this.name = data.name;
          this.mass = parseInt(data.mass);
          this.height = parseInt(data.height);
          this.homeworldName = null;
          this.homeworldId = null;

          return app.swapiFunctions.genericRequest(
            data.homeworld,
            "GET",
            null,
            true
          );
        })
        .then((homeworldData) => {
          this.homeworldName = homeworldData.name;
          this.homeworldId = parseInt(
            homeworldData.url.match(/\/([0-9]*)\/$/)[1]
          );
          return this;
        });
    }
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getMass() {
    return this.mass;
  }

  getHeight() {
    return this.height;
  }

  getHomeworldName() {
    return this.homeworldName;
  }

  getHomeworlId() {
    return this.homeworlId;
  }

  getWeightOnPlanet(app) {
    return app.swapiFunctions.getWeightOnPlanet(this.mass, this.homeworldId);
  }
}
module.exports = AbstractPeople;

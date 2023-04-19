class Planet {
  constructor(id) {
    this.id = id;
  }

  async init(app) {
    const planets = await app.db.swPlanet.findOne({
      where: { id: this.id },
    });
    if (planets) {
      this.name = planets.name;
      this.gravity = planets.gravity;
      return this;
    } else {
      return app.swapiFunctions
        .genericRequest(
          `${process.env.URL_API}planets/${this.id}/`,
          "GET",
          null,
          true
        )
        .then((data) => {
          this.name = data.name;
          this.gravity = data.gravity;
          return this;
        });
    }
  }

  getName() {
    return this.name;
  }

  getGravity() {
    return this.gravity;
  }
}

module.exports = Planet;

const { peopleFactory } = require("../../app/People/index");
const { planetsFactory } = require("../../app/Planet/index");

const _isWookieeFormat = (req) => {
  if (req.query.format && req.query.format == "wookiee") {
    return true;
  }
  return false;
};

const applySwapiEndpoints = (server, app) => {
  const logRequest = async (req, res, next) => {
    try {
      await app.db.logging.create({
        action: req.route.path,
        header: JSON.stringify(req.headers),
        ip: req.ip,
      });
    } catch (error) {
      console.error(error);
    }
    next();
  };

  server.get("/hfswapi/test", async (req, res) => {
    const data = await app.swapiFunctions.genericRequest(
      process.env.URL_API,
      "GET",
      null,
      true
    );
    res.send(data);
  });

  server.get("/hfswapi/getPeople/:id", logRequest, async (req, res) => {
    let id = parseInt(req.params.id);
    try {
      let swapi = await peopleFactory(id, req.query.format, app);
      if (swapi != null) {
        res.send({
          code: 201,
          data: {
            name: swapi.name,
            mass: swapi.mass,
            height: swapi.height,
            homeworldName: swapi.name,
            homeworldId: swapi.id ? swapi.id : swapi.homeworldId,
          },
        });
      }
    } catch (error) {
      res.status(501).send(error);
    }
  });

  server.get("/hfswapi/getPlanet/:id", logRequest, async (req, res) => {
    let id = req.params.id;
    try {
      let dataPlanets = await planetsFactory(id, app);
      if (dataPlanets != null) {
        res.send({
          code: 201,
          data: {
            name: dataPlanets.name,
            gravity: dataPlanets.gravity,
          },
        });
      }
    } catch (error) {
      res.status(501).send(error);
    }
  });

  server.get(
    "/hfswapi/getWeightOnPlanetRandom",
    logRequest,
    async (req, res) => {
      try {
        const randomPerson = Math.floor(Math.random() * 83) + 1;
        const randomPlanet = Math.floor(Math.random() * 60) + 1;

        const dataPerson = await peopleFactory(
          randomPerson,
          req.query.format,
          app
        );
        const dataPlanets = await planetsFactory(randomPlanet, app);
        if (
          dataPerson.homeworldId === parseInt(dataPlanets.id) ||
          dataPerson === null
        ) {
          res.send({
            code: 400,
            type: "error",
            message: "The selected planet is the same planet as the character",
          });
        }
        const calculate = dataPerson.getWeightOnPlanet(app);
        res.send({ code: 201, data: { characterWeight: calculate } });
      } catch (error) {
        res.status(501).send(error);
      }
    }
  );

  server.get("/hfswapi/getLogs", async (req, res) => {
    try {
      const data = await app.db.logging.findAll();

      const result = data.map((actions) => ({
        action: actions.action,
        header: actions.header,
        ip: actions.ip,
      }));
      res.json({ code: 201, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener los registros de llamadas");
    }
  });
};

module.exports = applySwapiEndpoints;

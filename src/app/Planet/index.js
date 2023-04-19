const Planet = require("./Planet");

const planetsFactory = async (id, app) => {
  let planet = new Planet(id);
  await planet
    .init(app)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });
  return planet;
};
module.exports = { planetsFactory };

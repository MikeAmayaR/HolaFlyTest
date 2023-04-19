const AbstractPeople = require("./abstractPeople");
const CommonPeople = require("./commonPeople");

const peopleFactory = async (id, lang, app) => {
  let people = null;
  if (lang == "wookiee") {
    people = new AbstractPeople(id);
  } else {
    people = new CommonPeople(id);
  }

  await people
    .init(app)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });
  return people;
};

module.exports = { peopleFactory };

const pg = require("pg");
const client = new pg.Client(`postgres://localhost:5432/fitness-dev`);

module.exports = { client };
const pg = require("pg");
const client = new pg.Client({
    connectionString: process.env.DB_URL || `postgres://localhost:5432/fitness-dev`,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USERNAME || undefined,
    password: process.env.DB_PASSWORD || undefined,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "FitnessDB"
});

module.exports = {client}
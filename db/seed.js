const { client } = require('./client')

// Startup Functions------------------------------------
async function dropTables() {
    try {
        await client.query(`
            DROP TABLE IF EXISTS users;
            DROP TABLE IF EXISTS activities;
        `);
    } catch (error) {
        console.log(error)
    }
}

async function createTables() {
    try {
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,4
            );
            CREATE TABLE activities (
                "id" SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL
            );
            CREATE TABLE routines (
                id SERIAL PRIMARY KEY,
                "creatorID" INTEGER REFERENCES users(id),
                name VARCHAR(255) NOT NULL,
                "isPublic" BOOLEAN DEFAULT true,
                goal TEXT NOT NULL
            );
            CREATE TABLE "routineActivities" (
                id SERIAL PRIMARY KEY,
                "routineId" INTEGER REFERENCES routines(id),
                "activityId" INTEGER REFERENCES activities(id),
                duration INTEGER,
                count INTEGER,
                UNIQUE("routineId", "activityId")
            );
        `)
    } catch (error) {
        console.log(error)
    }
}


async function resetDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();

        client.end();
    } catch (error) {
        console.log(error)
    }
}

// Add run DB func and initial table values.
const { client } = require('./client')
const {createUser} = require('./users')
const {createActivity} = require('./activities')
const {createRoutine} = require('./routines')
const {addActivityToRoutine} = require('./routine_activities')

// Startup Functions------------------------------------
async function dropTables() {
    try {
        await client.query(`
            DROP TABLE IF EXISTS "routineActivities";
            DROP TABLE IF EXISTS routines;
            DROP TABLE IF EXISTS activities;
            DROP TABLE IF EXISTS users;
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
                name VARCHAR(255) NOT NULL
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

async function createInitialUsers(){
    try {
        await createUser({username: "Nicktest", password: "Nickpass", name: "NickDev"})
        await createUser({username: "Prestest", password: "Prespass", name: "PrestDev"})
    } catch (error) {
        console.log(error)
    }
}

async function createInitialActivities(){
    try {
        await createActivity({name:"PushupDev", description:"Do pushups until you die"})
        await createActivity({name:"SitupDev", description:"Do situps until you come back to life"})
        await createActivity({name:"SitupDe5v", description:"Do situ5ps until you come back to life"})
    } catch (error) {
        console.log(error)
    }
}

async function createInitialRoutines(){
    try {
        await createRoutine({creatorID: 2, isPublic: true, name: "My abs!", goal: "I want to die"})
        await createRoutine({creatorID: 1, isPublic: true, name: "My everything!", goal: "I want to die but like, not forever"})
    } catch (error) {
        console.log(error)
    }
}

async function createInitialRoutineActivities(){
    try {
        await addActivityToRoutine({routineId: 1}, {activityId: 1, duration: 5, count: 5})
        await addActivityToRoutine({routineId: 2}, {activityId: 1, duration: 3, count: 5})
        await addActivityToRoutine({routineId: 2}, {activityId: 2, duration: 4, count: 2})
    } catch (error) {
        console.log(error)        
    }
}

async function resetDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialActivities();
        await createInitialRoutines();
        await createInitialRoutineActivities();
        client.end();
    } catch (error) {
        console.log(error)
    }
}

resetDB();

// Add run DB func and initial table values.

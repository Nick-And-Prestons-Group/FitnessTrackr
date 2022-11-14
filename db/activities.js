const client = require('./client')

async function createActivity( {name, description} ) {
    try {
        const {result} = await client.query(`
        INSERT INTO activities(name, description)
        VALUES ($1,$2)
        RETURNING *;
        `, [name, description])
        
        return result
    } catch (error) {
        console.log(error);
    }
};

async function updateActivity({ id, name, description}){
    try {
        const {rows: [user]} = await client.query(`
            UPDATE activities
            SET name= $1,
                description= $2
            WHERE id = ${id}
            RETURNING *;
            `, [name, description])

        return user
    } catch (error) {
        console.log(error)
    }
};

async function getActivityById(id) {
    try {
        const { rows } = await client.query(`
            SELECT * FROM activities
            WHERE id=$1;
        `, [id]);

        return rows
    } catch (error) {
        console.error
    }
};

async function getAllActivities (){
    try {
        const { rows: [activities] } = await client.query(`
            SELECT *
            FROM activities;
        `);

        return activities
    } catch (error) {
        console.error
    }
};

async function addActivityToRoutine({ routineId, activityId, count, duration}){
    try {
        const {result} = await client.query(`
        INSERT INTO "routineActivities" ("routineId", "activityId", count, duration)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, [routineId, activityId, count, duration])
    } catch (error) {
        console.log(error)
    }
}

async function getActivityByName (name){
    try {
        const {rows:[activities]} = await client.query(`
            SELECT * FROM activities
            WHERE "name" = ${name}
            RETURNING *;
        `)

        return activities
    } catch (error) {
        console.log(error)
    }
}

module.exports = {createActivity, updateActivity, getActivityById, getAllActivities, addActivityToRoutine, getActivityByName}
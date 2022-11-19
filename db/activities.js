const {client} = require('./client')

async function getActivitySearch(searchInput){
    try {
        const {rows} = await client.query(`
        SELECT * FROM activities
        WHERE "name" LIKE '%${searchInput}%';
        `)

        return rows
    } catch (error) {
        console.log(error)
    }
}

async function createActivity( {name, description} ) {
    try {
        const {rows: [result]} = await client.query(`
        INSERT INTO activities(name, description)
        VALUES ($1,$2)
        RETURNING *;
        `, [name, description])
        
        return result
    } catch (error) {
        console.log(error);
    }
};

async function updateActivity(id, fields={}){

    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
    
      if (setString.length === 0) {
        return;
      }

    try {
        const {rows: [result]} = await client.query(`
            UPDATE activities
            SET ${ setString }
            WHERE id=${id}
            RETURNING *;
            `, Object.values(fields));

        return result
    } catch (error) {
        console.log(error)
    }
};

async function getActivityById(id) {
    try {
        const { rows: [result] } = await client.query(`
            SELECT * FROM activities
            WHERE id=$1;
        `, [id]);

        return result
    } catch (error) {
        console.error
    }
};

async function getAllActivities (){
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM activities;
        `);

        return rows
    } catch (error) {
        console.error
    }
};

async function addActivityToRoutine({ routineId, activityId, count, duration}){
    try {
        const {rows: [result]} = await client.query(`
        INSERT INTO "routineActivities" ("routineId", "activityId", count, duration)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, [routineId, activityId, count, duration])

        return result
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

module.exports = {getActivitySearch, createActivity, updateActivity, getActivityById, getAllActivities, addActivityToRoutine, getActivityByName, updateActivity}
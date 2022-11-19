const {client}= require('./client')

async function getRoutineActivityById(id) {
    try {
        const { rows: [routines] } = await client.query(`
            SELECT * FROM "routineActivities"
            WHERE id=$1;
        `, [id])
        
        return routines
    } catch (error) {
        console.error
    }
};

async function getRoutineActivitiesByRoutine({id}) {
    try {
        const { rows } = await client.query(`
            SELECT * FROM "routineActivities"
            WHERE "routineActivities"."routineId"=$1;
        `, [id])
        
        return rows
    } catch (error) {
        console.error
    }
};

async function addActivityToRoutine(routineId, {activityId, count, duration}){
    try {
        const {rows: [result]} = await client.query(`
            INSERT INTO "routineActivities" ("routineId", "activityId", count, duration)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `,[routineId, activityId, count, duration])
        console.log("result: ", result)

        return result
    } catch (error) {
        console.log(error)
    }
}

async function updateRoutineActivity({ id, count, duration}) {
    try {
        const {rows: [user]} = await client.query(`
            UPDATE "routineActivities"
            SET count = $1, duration = $2
            WHERE id = ${id}
            RETURNING *;
        `, [count, duration])

        return user
    } catch (error) {
        console.log(error)
    }
}

async function destroyRoutineActivity({id}){
    try {
        const {rows: [result]} = await client.query(`
            DELETE FROM "routineActivities"
            WHERE id = ${id}
            RETURNING *;
        `)

        return result
    } catch (error) {
        console.log(error)
    }
}

module.exports = {addActivityToRoutine, getRoutineActivityById, getRoutineActivitiesByRoutine, updateRoutineActivity, destroyRoutineActivity}
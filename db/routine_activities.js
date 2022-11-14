const client= require('./client')

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
        // select and return an array of all routine_activity records
        const { rows: [routines] } = await client.query(`
            SELECT * FROM "routineActivities"
            WHERE "routineActivities"."routineId"=$1;
        `, [id])
        
        return routines
    } catch (error) {
        console.error
    }
};

async function updateRoutineActivity({ id, count, duration}) {
    try {
        const {rows: [user]} = await client.query(`
            UPDATE "routineActivities"
                SET count = $1
                duration = $2
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
        const result = await client.query(`
            DELETE FROM "routineActivities"
            WHERE id = ${id}
            RETURNING *;
        `)

        return result
    } catch (error) {
        console.log(error)
    }
}

module.exports = {getRoutineActivityById, getRoutineActivitiesByRoutine, updateRoutineActivity, destroyRoutineActivity}
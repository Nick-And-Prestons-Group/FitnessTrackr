const {client} = require('./client')

async function getRoutineSearch({ searchInput }){
    try {
        const {rows} = await client.query(`
        SELECT * FROM routines
        WHERE name LIKE %${searchInput}%
        RETURNING *;
        `)

        return rows
    } catch (error) {
        console.log(error)
    }
}

async function createRoutine( {creatorID, isPublic, name, goal} ){
    try {
        const {result}=await client.query(`
        INSERT INTO routines ("creatorID", "isPublic", name, goal)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, [creatorID, isPublic, name, goal])

        return result
    } catch (error) {
        console.log(error)
    }
}

async function updateRoutine({ id, isPublic, name, goal}) {
    try {
        const {rows: [user]} = await client.query(`
            UPDATE routines
            SET "isPublic" = $1,
                name = $2,
                goal = $3
            WHERE id = ${id}
            RETURNING *;
        `, [isPublic, name, goal])
        
        return user
    } catch (error) {
        console.log(error)
    }
}

async function destroyRoutine({id}){
    try {
        // Delete the routine activities that depend on this routine
        await client.query(`
            DELETE FROM "routineActivities"
            WHERE "routineID" = ${id}
            RETURNING *;
        `)
        // finish the job
        await client.query(`
            DELETE FROM routines
            WHERE id = ${id}
            ;
        `)
    } catch (error) {
        console.log(error)
    }
}

async function getRoutinesById(id) {
    try {
        const { rows } = await client.query(`
            SELECT * FROM routines
            WHERE id=$1;
        `, [id]);

        return rows
    } catch (error) {
        console.error
    }
};

async function getRoutinesWithoutActivities (id){
    try {
        const { rows: [routines] } = await client.query(`
            SELECT *
            FROM routines
            WHERE id NOT IN (
                SELECT "routineId"
                FROM "routineActivities"
                );
        `);
        
        return routines
    } catch (error) {
        console.error
    }
};

// async function getAllRoutines (){
//     try {
//         const { rows } = await client.query(`
//             SELECT * FROM "routineActivities";
//         `);
        
//         return rows
//     } catch (error) {
//         console.error
//     }
// };

async function getAllRoutines() {
    try {
      const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id 
      `);
      return attachActivitiesToRoutines(routines);
    } catch (error) {
      throw error
    }
  }

async function getPublicRoutines (){
    try {
        const { rows } = await client.query(`
            SELECT routines.*, users.username AS "creatorName"
            FROM routines
            JOIN users ON routines."creatorId" = users.id 
            WHERE "isPublic"=true;
        `)
        
        return rows
    } catch (error) {
        console.error
    }
};

async function getAllRoutinesByUser({username}) {
    // const { username } = users.id

    try {
        // select and return array of all routines made by user including their activities
        const { rows: [routines] } = await client.query(`
            SELECT * FROM routines
            WHERE "creatorID"=$1;
        `, [username])
        
        return routines
    } catch (error) {
        console.error
    }
};

async function getPublicRoutinesByUser({username}) {
    // const { username } = users.id

    try {
    // select and return array of all public routines made by user including their activities
        const allRoutines = await getAllRoutinesByUser({username})

        const routines = allRoutines.filter(routine => {
            routine.isPublic
        })
        
        return routines
        
    } catch (error) {
        console.error
    }
};

async function getPublicRoutinesByActivity({id}) {
    try {
        // select and return an array of public routines which have a 
        // specific activityId in their routine_activities join, include their activities
        const { rows: [routines] } = await client.query(`
            SELECT routines.* 
            FROM routines
            JOIN "routineActivities" ON routines.id="routineActivities"."activityId"
            WHERE "routineActivities"."activityId"=$1 AND "isPublic" = true;
        `, [id])
        
        return routines
    } catch (error) {
        console.error
    }
};

async function attachActivitiesToRoutines(routines) {
    // no side effects
    const routinesToReturn = [...routines];
    const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
    const routineIds = routines.map(routine => routine.id);
    if (!routineIds?.length) return [];
    
    try {
      // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
      const { rows: activities } = await client.query(`
        SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
        FROM activities 
        JOIN routine_activities ON routine_activities."activityId" = activities.id
        WHERE routine_activities."routineId" IN (${ binds });
      `, routineIds);
  
      // loop over the routines
      for(const routine of routinesToReturn) {
        // filter the activities to only include those that have this routineId
        const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
        // attach the activities to each single routine
        routine.activities = activitiesToAdd;
      }
      return routinesToReturn;
    } catch (error) {
      throw error;
    }
  }

module.exports = { getRoutineSearch,createRoutine, updateRoutine, destroyRoutine, getRoutinesById, getRoutinesWithoutActivities, getAllRoutines, getAllRoutinesByUser, getPublicRoutines, getPublicRoutinesByUser, getPublicRoutinesByActivity}
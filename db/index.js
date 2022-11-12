const pg = require("pg");
const client = new pg.Client(`postgres://localhost:5432/fitness-dev`);
// -----------CREATE FUNCTIONS------------------------
async function createUser( { username, password, name } ) {
    try {
        const {result} = await client.query(`
        INSERT INTO users(username, password, name)
        VALUES ($1, $2, $3)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, password, name]);

        return result
    } catch (error) {
        console.log(error)
    }
};

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
}

async function createRoutines( {creatorID, isPublic, name, goal} ){
    try {
        const {result}=await client.query(`
        INSERT INTO routines ("creatorID", isPublic, name, goal)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, [creatorID, isPublic, name, goal])

        return result
    } catch (error) {
        console.log(error)
    }
}

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
// -------------UPDATE FUNCTIONS-------------

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
}

async function updateRoutine({ id, isPublic, name, goal}) {
    try {
        const {rows: [user]} = await client.query(`
            UPDATE routines
            SET isPublic = $1,
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

// -------------DESTROY FUNCTIONS-------------

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

// -------------GET FUNCTIONS-----------------
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

async function getUser({ username, password }) {
    try {
        if (!password) {
            return null
        }

        const { rows } = await client.query(`
            SELECT * FROM users
            WHERE username=$1;
        `, [username])

        return rows;

    } catch (error) {
        console.error
    }
};

async function getUserById(id) {
    try {
        const { rows } = await client.query(`
            SELECT id, username, name
            FROM users
            WHERE id=$1;
        `, [id]);
        
        return rows;
    } catch (error) {
        console.error
    }
};

async function getUserByUsername(username) {
    try {
       const { rows } = await client.query(`
            SELECT id, username, name
            FROM users
            WHERE username=$1;
       `, [username]);

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

async function getAllRoutines (){
    try {
        const { rows: [routines] } = await client.query(`
            SELECT * FROM "routineActivities";
        `);
        
        return routines
    } catch (error) {
        console.error
    }
};

async function getPublicRoutines (){
    try {
        const { rows: [routines] } = await client.query(`
            SELECT * FROM routines
            WHERE "isPublic"=true;
        `)
        
        return routines
    } catch (error) {
        console.error
    }
};

async function getAllRoutinesByUser({username}) {
    const { username } = users.id

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
    const { username } = users.id

    try {
    // select and return array of all public routines made by user including their activities
        const allRoutines = await getAllRoutinesByUser({username})

        const routines = allRoutines.filter(routine => {
            return routine.isPublic
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
            WHERE "routineActivities"."activityId"=$1;
        `, [id])
        
        return routines
    } catch (error) {
        console.error
    }
};


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

module.exports = { client };
const express = require("express");
const { getActivityById } = require("../db/activities");
const { getRoutineSearch, getPublicRoutines, createRoutine, getRoutinesById, updateRoutine, destroyRoutine } = require("../db/routines");
const { addActivityToRoutine, getRoutineActivitiesByRoutine } = require("../db/routine_activities");
const routinesRouter = express.Router();
const { requireUser } = require("./utilities");

routinesRouter.post("/search", async(req, res, next) =>{
    const {searchInput}= req.body

    try {    
        const searchArray = searchInput.split(' ').map((element) => {
            return `%${element}%`
        })
        console.log("search array: ", searchArray)

        const arr = searchArray.map(element => {
           const result = getRoutineSearch(element);
           console.log("result: ", result);
            return result
        })
        console.log("arr: ", arr)

        const allResults = await Promise.all(arr);
        console.log("all res: ", allResults)
        
        const resultArr = allResults.reduce((acc, val) => {
            if(Array.isArray(val)) {
                acc = [...acc, ...val]
            }
            return acc
        }, [])
        

        console.log("search res: ", resultArr);
        res.send(resultArr)
    } catch (error) {
        console.log(error)
    }
})

routinesRouter.get("/", async (req, res, next) => {
    try {
        const allRoutines = await getPublicRoutines();

        res.send({ allRoutines });
    } catch ({name, message}) {
        next({name, message})
    }
});

routinesRouter.post("/", requireUser, async (req, res, next) => {
    const { creatorID, isPublic, name, goal} = req.body;
    const routineData = {};

    if (name) {
        routineData.name = name
    }

    if (goal) {
        routineData.goal = goal
    }

    if (isPublic) {
        routineData.isPublic = isPublic
    }

    if (req.user) {
        routineData.creatorID = req.user.id
    }

    try {
        const newRoutine = await createRoutine(routineData);

        res.send({ newRoutine })
    } catch ({name, message}) {
        next({name, message})
    }
});


routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { isPublic, name, goal } = req.body;
    const updateFields = {};

    if (isPublic) {
        updateFields.isPublic = isPublic
    }

    if (name) {
        updateFields.name = name
    }

    if (goal) {
        updateFields.goal = goal
    }

    try {
        const fetchedRoutine = await getRoutinesById(routineId);

        if (fetchedRoutine.creatorID === req.user.id) {
            const updatedRoutine = await updateRoutine(routineId, updateFields);

            res.send({ updatedRoutine });
        } else {
            next({
                name: "Unauthorized User Error",
                message: "You cannot update a routine that is not yours"
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
});


routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
    const { routineId } = req.params;

    try {
        const fetchedRoutine = await getRoutinesById(routineId);

        if (fetchedRoutine && fetchedRoutine.creatorID === req.user.id) {
            await destroyRoutine({id: routineId});

            res.send({
                name: "Success",
                message: `Successfully deleted routine ${routineId}`
            })
        } else {
            next(fetchedRoutine ? {
                name: "Unauthorized User Error",
                message: "You cannot delete a routine that is not yours"
            } : {
                name: "Routine Not Found Error",
                message: "That routine does not exist"
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
});

routinesRouter.post("/:routineId/activities", async (req, res, next) => {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
    const addedActivity = {};

    if (activityId) {
        addedActivity.activityId = activityId
    }

    if (count) {
        addedActivity.count = count
    }

    if (duration) {
        addedActivity.duration = duration
    }

    try {
        const fetchedRoutineAct = await getRoutineActivitiesByRoutine({id: routineId});
        console.log(fetchedRoutineAct);
        const duplicatedRoutineActivity = fetchedRoutineAct.find((routineActivity, idx) => {
            return routineActivity.activityId == activityId
        })
        console.log("i am a duplicate: ", duplicatedRoutineActivity);

        const activityCheck = await getActivityById(activityId);
        console.log(activityCheck);

        if (!activityCheck) {
            next({
                name: "Activity doesn't exist",
                message: "Activity doesn't exist"
            })
        };

        if (duplicatedRoutineActivity) {
            next({
                name: "Duplication Error",
                message: "That pair already exists"
            })
        }
        console.log("i am running")
            const newRoutineActivity = await addActivityToRoutine(routineId, addedActivity)

            res.send({ newRoutineActivity })
    } catch ({name, message}) {
        next({name, message})
    }
});

module.exports = routinesRouter;

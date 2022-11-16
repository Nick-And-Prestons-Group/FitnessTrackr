const express = require("express");
const { getPublicRoutines, createRoutine, getRoutinesById, updateRoutine, destroyRoutine } = require("../db/routines");
const routinesRouter = express.Router();
const { requireUser } = require("./utilities");

routinesRouter.get("/", async (req, res, next) => {
    try {
        const allRoutines = await getPublicRoutines();

        res.send({ allRoutines });
    } catch ({name, message}) {
        next({name, message})
    }
});

routinesRouter.post("/", requireUser, async (req, res, next) => {
    const { isPublic, name, goal } = req.body;
    const routineData = {};

    if (req.user) {
        routineData.creatorID = req.user.id
    }

    if (isPublic) {
        routineData.isPublic = isPublic
    }

    if (name) {
        routineData.name = name
    }

    if (goal) {
        routineData.goal = goal
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
            const updatedRoutine = await updateRoutine(routineId, { updateFields });

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
        const fetchedRoutine = getRoutinesById(routineId);

        if (fetchedRoutine && fetchedRoutine.creatorID === req.user.id) {
            destroyRoutine(routineId);

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

routinesRouter.post("/:routineID/activities", async (req, res, next) => {
    const { routineID } = req.params;
    const { activityID, count, duration } = req.body;
    const addedActivity = {};

    if (activityID) {
        addedActivity.activityId = activityId
    }

    if (count) {
        addedActivity.count = count
    }

    if (duration) {
        addedActivity.duration = duration
    }

    try {
        if (routineID === activityID) {
            next({
                name: "Duplication Error",
                message: "That pair already exists"
            })
        } else {
            const newRoutineActivity = await addActivityToRoutine(routineID, { addedActivity })

            res.send({ newRoutineActivity })
        }
    } catch ({name, message}) {
        next({name, message})
    }
});

module.exports = routinesRouter;

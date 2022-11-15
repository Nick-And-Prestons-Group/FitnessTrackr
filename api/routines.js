const express = require("express");
const { getPublicRoutines, createRoutine } = require("../db/routines");
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

// patch/routines/:routineId -- update a routine like changing public/private status, name or goal (**)

// delete/routines/:routineId -- hard delete a routine and include the corresponding routineactivities (**)

// post /routines/:routineId/activities -- Attach a single activity to a routine. Prevent duplication on (routineId, activityId) pair.



module.exports = routinesRouter;
const express = require("express");
const { getPublicRoutines, createRoutine, getRoutinesById, updateRoutine } = require("../db/routines");
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
                message: "You cannot update a post that is not yours"
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
});

// delete/routines/:routineId -- hard delete a routine and include the corresponding routineactivities (**)
routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {

});
// post /routines/:routineId/activities -- Attach a single activity to a routine. Prevent duplication on (routineId, activityId) pair.
routinesRouter.post("/:routineId/activities", async (req, res, next) => {

});


module.exports = routinesRouter;
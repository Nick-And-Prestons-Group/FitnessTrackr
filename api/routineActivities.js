const express = require("express");
const routineActivitiesRouter = express.Router();
const {updateRoutineActivity, destroyRoutineActivity} = require('../db/routine_activities')
const { getUserById } = require('../db/users'); 
const { requireUser } = require("./utilities");

routineActivitiesRouter.patch('/:routineActivityId', requireUser, async(req, res, next)=>{
    const {id, count, duration} = req.body;
    try {
        const user = await getUserById(req.params.userId)

        if (user && user.id === req.user.id){
        const updatedRoutAct= await updateRoutineActivity({id, count, duration})

        res.send({post: updatedRoutAct})
    } else {
        next(user ? {
            name: "Unauthorized User",
            message: "You do not own this Routine"
        } : {
            name: "Routine Not Found",
            message: "Did not find an activity by that name"
        });
    };
    } catch ({name, message}) {
        next({name, message})
    };
});

routineActivitiesRouter.delete('/:routineActivityId', requireUser, async(req, res, next)=>{
    const { id } = req.body
    try {
        const user = await getUserById(req.params.userId)

        if (user && user.id === req.user.id){
            const deleteRoutineActivity = await destroyRoutineActivity({id})
            res.send({routine: deleteRoutineActivity});
        } else {
            next(user ? {
                name: "Unauthorized User",
                message: "You do not own this Routine"
            } : {
                name: "Routine Not Found",
                message: "Did not find an activity by that name"
            });
        };
    } catch ({name, message}) {
        next({name, message})
    };
});

module.exports = routineActivitiesRouter;
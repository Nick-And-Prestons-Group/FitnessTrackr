const express = require("express");
const routineActivitiesRouter = express.Router();
const {updateRoutineActivity, destroyRoutineActivity} = require('../db/routine_activities')

routineActivitiesRouter.patch('/:routineActivityId', async(req, res, next)=>{
    const {id, count, duration} = req.body;

    try {
        const updatedRoutAct= await updateRoutineActivity({id, count, duration})

        res.send({post: updatedRoutAct})
    } catch ({name, message}) {
        next({name, message})
    }
})

routineActivitiesRouter.delete('/:routineActivityId', async(req, res, next)=>{
    // double check functions db/routine_activities, line 16 and 46 to make sure they work as intended for this command.
    // 46 might need to be framed like 16
})

module.exports = routineActivitiesRouter;
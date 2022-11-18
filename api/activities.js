const express = require("express");
const activitiesRouter = express.Router();
const activityFunc = require('../db');
const {getActivitySearch, createActivity, getAllActivities, getActivityById, updateActivity } = require("../db/activities");
const { requireUser }  = require('./utilities')

activitiesRouter.use((req,res, next)=>{
    console.log("A request is being made to /activities");
    next();
});

activitiesRouter.get('/', async( req, res, next)=>{
    const activities = await getAllActivities();

    res.send({ activities });
});

activitiesRouter.get('/search', async( req, res, next)=>{
    const {searchinput} = req.body
    
    try {
        const searchresults= await getActivitySearch(searchinput);

        res.send({ searchresults })
    } catch ({name, message}) {
        next({name, message})
    }
})

activitiesRouter.post('/', requireUser, async(req, res, next) => {
    const{ name, description }=  req.body;

    try {
        const newAct= await createActivity({ name, description })

        res.send({post: newAct})
    } catch ({name, message}) {
       next({name, message})
    }
})

activitiesRouter.patch('/:activityId', requireUser, async(req, res, next) =>{
    const {id, name, description}= req.body;

    try {
        const updatedAct= await updateActivity({id, name, description})
        res.send({post: updatedAct})
    } catch ({name, message}) {
        next({name, message})
    }
})

activitiesRouter.get('/:activityId/routines', async(req, res, next)=>{
    const {id} = req.body
    try {
        const activities = await getActivityById(id);

        res.send({activities});
    } catch ({name, message}) {
        next({name, message});
    }
});

module.exports = activitiesRouter;
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

activitiesRouter.post("/search", async(req, res, next) =>{
    const {searchInput}= req.body

    try {    
        const searchArray = searchInput.split(' ').map((element) => {
            return `%${element}%`
        })
        console.log("search array: ", searchArray)

        const arr = searchArray.map(element => {
           const result = getActivitySearch(element);
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

activitiesRouter.post('/', requireUser, async(req, res, next) => {
    const{ name, description }=  req.body;

    try {
        const newAct= await createActivity({ name, description })

        res.send({newAct})
    } catch ({name, message}) {
       next({name, message})
    }
})

activitiesRouter.patch('/:activityId', requireUser, async(req, res, next) =>{
    const {activityId} = req.params;
    const {name, description}= req.body;
    const updateFields = {};

    if (name) {
        updateFields.name = name
    }

    if (description) {
        updateFields.description = description
    }
    try {
        const updatedAct= await updateActivity(activityId, updateFields)
        res.send({updatedAct})
    } catch ({name, message}) {
        next({name, message})
    }
})

activitiesRouter.get('/:activityId/routines', async(req, res, next)=>{
    const {activityId} = req.params
    try {
        const activities = await getActivityById(activityId);
        // no routines?

        res.send({activities});
    } catch ({name, message}) {
        next({name, message});
    }
});

module.exports = activitiesRouter;
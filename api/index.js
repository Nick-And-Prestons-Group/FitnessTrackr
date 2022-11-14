const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
const activitiesRouter = require("./activities");
const routinesRouter = require("./routines");
const routineActivitiesRouter = require("./routineActivities");
const { requireUser } = require("./utilities");

const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/health", async (req, res, next) => {
    res.send(`<h1>All is well, server is up!</h1>`)
});

router.use("/users", usersRouter);
router.use("/activities", activitiesRouter);
router.use("/routines", routinesRouter);
router.use("/routineActivities", routineActivitiesRouter);

router.use((error, req, res, next) => {
    res.send({
        name: error.name,
        message: error.message
    });
});

module.exports = router;
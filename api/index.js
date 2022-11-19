const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
const activitiesRouter = require("./activities");
const routinesRouter = require("./routines");
const routineActivitiesRouter = require("./routineActivities");
const { requireUser } = require("./utilities");

const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db/users");
require("dotenv").config();

router.get("/health", async (req, res, next) => {
    res.send(`<h1>All is well, server is up!</h1>`)
});

router.use(async (req, res, next) => {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");

    if (!auth) {
        console.log("You do not have a web token!")
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length)

        try {
            const parsedToken = jwt.verify(token, JWT_SECRET);

            const id = parsedToken && parsedToken.id

            if (id) {
                req.user = await getUserById(id);
                next();
            }
        } catch (error) {
            next(error);
        }
    } else {
        next({
            name: "Authorization Header Error",
            message: `Authorization token must start with ${prefix}`
        });
    }
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
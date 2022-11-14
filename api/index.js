const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
const activitiesRouter = require("./activities");
const routinesRouter = require("./routines");
const routineActivitiesRouter = require("./routineActivities");
const { requireUser } = require("./utilities");

// JWT SECRET and other requires relating to web token here

router.get("/health", async (req, res, next) => {
    // code here
});

router.use("/users", usersRouter);
router.use("/activities", activitiesRouter);
router.use("/routines", routinesRouter);
router.use("/routineActivities", routineActivitiesRouter);

module.exports = router;
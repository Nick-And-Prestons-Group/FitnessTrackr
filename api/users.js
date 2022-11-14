const express = require("express");
<<<<<<< HEAD
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utilities");

usersRouter.post("/register", async (req, res, next) => {
    const { username, password, name } = req.body;

    try {

    } catch ({name, message}) {
        next({name, message})
    }
});

module.exports = usersRouter;
=======
const router = express.Router();

module.exports = router;
>>>>>>> 613644f619f441024e63eec1ba9f00833492aa70

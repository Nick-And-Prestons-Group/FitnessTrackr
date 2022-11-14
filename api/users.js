const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utilities");
const { createUser, getUser, getUserById, getUserByUsername } = require("../db/users");
const { getAllRoutines, getAllRoutinesByUser, getPublicRoutinesByUser } = require("../db/routines");

usersRouter.post("/register", async (req, res, next) => {
    const { username, password, name } = req.body;

    try {
        const userTest = await getUserByUsername(username);

        if (userTest) {
            next({
                name: "Username Error",
                message: "A user by that username already exists"
            });
        }

        const user = await createUser({
            username,
            password,
            name
        });

        const token = jwt.sign({
            id: user.id,
            username }, JWT_SECRET, {
                expiresIn: "1w"
        });

        res.send({
            message: "Thank you for signing up!",
            token: token
        });

    } catch ({name, message}) {
        next({name, message})
    }
});

usersRouter.post("/login", async (req, res, next) => {
    const { username, password } = req.body;

    if(!username || !password) {
        next({
            name: "Invalid login Error",
            message: "Please enter a valid username and password"
        })
    }

    try {
        const user = await getUserByUsername(username);
        const token = jwt.sign({
            id: user.id,
            username }, JWT_SECRET, {
                expiresIn: "1w"
        });

        if (user && user.password === password) {
            res.send({
                message: "Logged in!",
                token: token
            })
        } else {
            next({
                name: "Incorrect Login Error",
                message: "Your username or password is incorrect"
            })
        }

    } catch ({name, message}) {
        next({name, message})
    }
});

// not fully functional yet
usersRouter.get("/me", requireUser, async (req, res, next) => {
    const { username, name, routines } = req.body;

    try {
        const userRoutines = await getAllRoutinesByUser({username});

        if () {
            res.send({
                username: username,
                name: name,
                routines: userRoutines
            })
        } else {
            next({
                name: "Unauthorized user error",
                message: "This user's routines are private"
            })
        }
    } catch ({name, message}) {
        next({name, messsage})
    }
});

// not fully functional yet
usersRouter.get("/:username/routines", async (req, res, next) => {
    const { username } = req.params
    const { routines } = req.body;
    try {
        if (username) {
            const routines = await getPublicRoutinesByUser(username);
            res.send({routines: routines})
        } else {
            next({
                name: "Invalid User Error",
                message: "This user does not exist"
            })
        }

    } catch ({name, message}) {
        next({name, message})
    }
});


module.exports = usersRouter;
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utilities");
const { createUser, getUser, getUserById, getUserByUsername } = require("../db/users");
const { getAllRoutines, getAllRoutinesByUser, getPublicRoutinesByUser } = require("../db/routines");

usersRouter.post("/register", async (req, res, next) => {
    const { username, password} = req.body;

    try {
        const userTest = await getUserByUsername(username);

        if (userTest && userTest.id) {
            next({
                name: "Username Error",
                message: "A user by that username already exists"
            });
        }

        const user = await createUser({
            username,
            password
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
        const user = await getUser({username, password});
        const token = jwt.sign({
            id: user.id,
            username }, JWT_SECRET, {
                expiresIn: "1w"
        });

        console.log(user);
        if (user.password === password) {
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

usersRouter.post("/me", requireUser, async (req, res, next) => {
    // When uploaded to Render try running as POST to get req.body
    const { userId } = req.body;

    try {
        if (req.user.id === userId) {
            const userData = await getAllRoutinesByUser({userId});
            console.log(userData);

            res.send({
                // add username to return here
                userData
            })
        } else {
            next({
                name: "Unauthorized user error",
                message: "This user's routines are private"
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
});

usersRouter.get("/:userId/routines", async (req, res, next) => {
    const { userId } = req.params

    try {
        const routines = await getPublicRoutinesByUser({userId});
        console.log(routines)
        
        if (routines) {
            res.send({ 
                userId,
                routines 
            })
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

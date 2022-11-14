const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utilities");
const { createUser, getUser, getUserById, getUserByUsername } = require("../db/users");

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

// user/me
// user/:username/routines

module.exports = usersRouter;
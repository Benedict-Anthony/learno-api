const express = require("express");
const UserController = require("../controllers/user.controller");

const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);

module.exports = userRouter;

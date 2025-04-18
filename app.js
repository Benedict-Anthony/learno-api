// app.js
const express = require("express");
const app = express();

const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

// any other middleware, error handlers, etc.

module.exports = app;

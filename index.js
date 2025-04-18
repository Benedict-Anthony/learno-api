const express = require("express");
const config = require("dotenv").config;
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const swaggerDocs = require("./swagger.js");
config();
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Let do this" });
});

app.use("/api/auth/", userRouter);
app.use("/api/posts/", postRouter);

swaggerDocs(app, PORT);
app.listen(PORT, () => {
  console.log("APP listens on ", PORT);
});

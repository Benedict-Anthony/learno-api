const express = require("express");
const PostController = require("../controllers/post.controller");
const protect = require("../middleware/protect.middleware");
const { route } = require("./user.routes");

const postRouter = express.Router();
const postContrroller = new PostController();

postRouter
  .route("/")
  .post(protect, postContrroller.createPost)
  .get(postContrroller.getPosts);

postRouter.route("/:id").get(postContrroller.getPost);

module.exports = postRouter;

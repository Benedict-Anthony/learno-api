const expressAsyncHandler = require("express-async-handler");
const { postSchema } = require("../validators/post.validators");
const { PrismaClient } = require("../generated/prisma");

class PostController {
  constructor() {
    this.prisma = new PrismaClient();
  }
  createPost = expressAsyncHandler(async (req, res, next) => {
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const author = await this.prisma.user.findFirst({
      where: { email: req.user.email },
    });

    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    const post = await this.prisma.post.create({
      data: {
        ...value,
        author: {
          connect: {
            id: author.id,
          },
        },
      },
    });

    res.status(201).json({ message: "Post created", post });
  });

  getPosts = expressAsyncHandler(async (req, res, next) => {
    const posts = await this.prisma.post.findMany({
      where: {},
      include: { author: { select: { email: true, name: true } } },
    });
    res.status(200).json(posts);
  });

  getPost = expressAsyncHandler(async (req, res, next) => {
    const post = await this.prisma.post.findFirst({
      where: { id: Number(req.params.id) },
      include: { author: { select: { email: true, name: true } } },
    });
    res.status(200).json(post);
  });
}

module.exports = PostController;

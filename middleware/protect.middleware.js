const expressAsyncHandler = require("express-async-handler");
const { PrismaClient } = require("../generated/prisma");
const jwt = require("jsonwebtoken");

const protect = expressAsyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  const authToken = req.headers.authorization;
  let foundToken;
  if (authToken?.startsWith("Bearer")) {
    foundToken = authToken
      .split("")
      .slice("Bearer".length + 1)
      .join("");
  } else if (authToken?.startsWith("JWT")) {
    foundToken = authToken
      .split("")
      .slice("JWT".length + 1)
      .join("");
  } else {
    res.status(400).json({ message: "Bearer or JWT token not set" });
    return;
  }

  if (!foundToken) {
    res.status(400).json({ message: "Bearer or JWT token not set" });
  }

  const verifyToken = jwt.verify(foundToken, process.env.SECRET);

  const user = await prisma.user.findFirst({
    where: {
      email: verifyToken.email,
    },
  });

  if (!user) {
    res.status(404).json({ message: "Invalid token" });
    return;
  }

  // @ts-ignore
  req.user = user;
  next();
});

module.exports = protect;

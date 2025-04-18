const { PrismaClient } = require("../generated/prisma");
const expressAsyncHandler = require("express-async-handler");
const {
  userRegisterSchema,
  userLoginSchema,
} = require("../validators/user.validators");
const bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

class UserController {
  constructor() {
    this.prisma = new PrismaClient();
    this.salt = bcrypt.genSaltSync(10);
    this.secret = process.env.SECRET;
    this.bcrypt = bcrypt;
  }

  generateToken = (id, email) => {
    const token = jwt.sign({ id, email }, this.secret);
    return token;
  };
  register = expressAsyncHandler(async (req, res, next) => {
    const { error, value } = userRegisterSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { password } = value;
    const hash = bcrypt.hashSync(password, this.salt);
    const user = await this.prisma.user.create({
      data: {
        ...value,
        password: hash,
      },
    });

    res.status(201).json(user);
  });

  login = expressAsyncHandler(async (req, res) => {
    const { error, value } = userLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { password, email } = value;
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "wrong credentials" });
      return;
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      res.status(404).json({ message: "wrong credentials" });
      return;
    }

    delete user.password;
    const token = this.generateToken(user.id, user.email);
    res.status(200).json({ user, token });
  });
}

module.exports = UserController;

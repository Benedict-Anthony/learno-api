const joi = require("joi");

const userRegisterSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  name: joi.string().required(),
});
const userLoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

module.exports = {
  userRegisterSchema,
  userLoginSchema,
};

const joi = require("joi");

const postSchema = joi.object({
  title: joi.string().required(),
  content: joi.string().required(),
  published: joi.bool().default(true),
});

module.exports = {
  postSchema,
};

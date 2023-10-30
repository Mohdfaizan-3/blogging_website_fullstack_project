const BlogSchema = require("../model/Blog");
const Joi = require("joi");

const createBlog = async (req, res) => {
  const isValid = Joi.object({
    title: Joi.string().required(),
    textBody: Joi.string().min(30).max(1000).required(),
  }).validate(req.body);

  if (isValid.error) {
    return res.status(400).send({
      status: 400,
      message: "could not validate the details",
      data: isValid.error.details[0].message.replace(/"/g, ""),
    });
  }

  const { title, textBody } = req.body;
  const blogObj = new BlogSchema({
    title,
    textBody,
    createdAt: new Date(),
    username: req.locals.username,
    userId: req.locals.userId,
  });

  try {
    await blogObj.save();
    return res.status(200).send({
      status: 200,
      message: "blog created successfully",
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "failed to fetch blog",
      data: error,
    });
  }
};

module.exports = { createBlog };

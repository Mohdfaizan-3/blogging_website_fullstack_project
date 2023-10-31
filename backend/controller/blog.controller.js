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
    return res.status(201).send({
      status: 201,
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

const getUserBlog = async (req, res) => {
  const userId = req.locals.userId;
  const page = Number(req.query.page) || 1;
  const LIMIT = 10;

  let blogData;

  try {
    blogData = await BlogSchema.find({ userId })
      .sort({ creationDateTime: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT);
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "failed to fetch blogs",
      data: error,
    });
  }

  return res.status(201).send({
    status: 201,
    message: "blog created successfully",
    data: blogData,
  });
};

const deleteBlog = async (req, res) => {
  const userId = req.locals.userId;
  const blogId = req.params.blogId;
  let blogData;
  try {
    blogData = await BlogSchema.findById(blogId);

    if (blogData === null) {
      return res.status(404).send({
        status: 404,
        message: "blog does not exist",
        data: error,
      });
    }
    if (blogData.userId !== userId) {
      return res.status(400).send({
        status: 400,
        message: "unauthorized to delete",
        data: error,
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "failed to fetch details",
      data: error,
    });
  }

  try {
    const result = await BlogSchema.findByIdAndDelete(blogId);

    if (!result) {
      return res.status(404).send({
        status: 404,
        message: "Blog not found",
      });
    }

    return res.status(200).send({
      status: 200,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Failed to delete blog",
      data: error,
    });
  }
};
module.exports = { createBlog, getUserBlog, deleteBlog };

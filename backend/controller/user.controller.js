const Joi = require("joi");
const UserSchema = require("../model/User");
const bcrypt = require("bcrypt");
const BCRYPT_SALT = Number(process.env.BCRYPT_SALT);

const registerUser = async (req, res) => {
  const isValid = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().min(3).max(25).alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }).validate(req.body);

  if (isValid.error) {
    res.status(400).send({
      status: 400,
      message: "could not validate the details", 
      data: isValid.error.details[0].message.replace(/"/g, ''), 
    });
  }

  try {
    const userExist = await UserSchema.find({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (userExist.length > 0) {
      res.status(400).send({
        status: 400,
        message: "user already exist",
        data: error,
      });
    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "error while checking user exist or not",
      data: error,
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_SALT);

  const userObj = new UserSchema({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email, 
    password: hashedPassword,
  });

  try {
    await userObj.save();
    res.status(201).send({
      status: 201,
      message: "user created successfully",
      data: userObj,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "error while saving the data to database",
      data: error,
    });
  }
};

module.exports = { registerUser };

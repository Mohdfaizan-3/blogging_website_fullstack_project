const Joi = require("joi");
const UserSchema = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const userLogin = async (req, res) => {
  const { username, password } = req.body;

  const isValid = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).validate(req.body);

  if (!isValid) {
    res.status(400).send({
      status: 400,
      message: "invalid detail",
      data: isValid.error,
    });
  } 

  let userData;
  try {
    userData = await UserSchema.findOne({ username });

    if (!userData) {
      res.status(400).send({
        status: 400,
        message: "no user found", 
      });
    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "error while fetching data from database",
      data: error,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if(!isPasswordValid) {
    res.status(400).send({
        status: 400,
        message: "incorrect password",
      });
  }

  const payload = {
    username: userData.username,
    name: userData.name,
    email: userData.email,
    userId: userData._id,
  }

  const token =  jwt.sign(payload, process.env.JWT_SECRET_KEY);

  res.status(200).send({
    status: 200,
    message: "user loggedIn successfully",
    data: token,
  });
};

module.exports = {userLogin}
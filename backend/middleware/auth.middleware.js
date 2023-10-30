const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const token = req.headers["my-token"];
  let verified;
  try {
    verified = jwt.verify(token, process.env.JWT_SECRET_KEY); // verified contains the payload
    if (verified) {
      req.locals = verified;
      next();
    } else {
      res.status(401).send({
        status: 401,
        message: "user not authenticated, please login again.",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "jwt not provided, please login again",
      data: error,
    });
  }
};

module.exports = { isAuth };

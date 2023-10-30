const express = require("express");
const { registerUser } = require("../controller/user.controller");
const app = express();
const { userLogin } = require("../controller/userLogin");

app.post("/register", registerUser);
app.post("/login", userLogin);

module.exports = app;

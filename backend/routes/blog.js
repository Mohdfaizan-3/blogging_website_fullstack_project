const express = require("express");
const app = express();
const { createBlog } = require("../controller/blog.controller");
const { isAuth } = require("../middleware/auth.middleware");

app.post("/create-blog", isAuth, createBlog);

module.exports = app;

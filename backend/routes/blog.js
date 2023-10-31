const express = require("express");
const app = express();
const { createBlog, getUserBlog, deleteBlog } = require("../controller/blog.controller");
const { isAuth } = require("../middleware/auth.middleware");

app.post("/create-blog", isAuth, createBlog);
app.get("/get-blogs", isAuth, getUserBlog);
app.delete("/delete-blog/:blogId", isAuth, deleteBlog);



module.exports = app;

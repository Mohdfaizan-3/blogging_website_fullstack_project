const express = require("express");
require("./config/db");
const app = express();
require("dotenv").config();
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

app.use(express.json());
const PORT = process.env.PORT;

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log("working at d ", PORT);
});

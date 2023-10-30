const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },

  textBody: {
    type: String,
    require: true,
  },

  createdAt: {
    type: Date,
    require: true,
  },

  userId: {
    type: String,
    require: true,
  },

  username: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("blogs", BlogSchema);

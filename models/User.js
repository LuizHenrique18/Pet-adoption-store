const mongoose = require("../db/conn");
const { Schema } = require("mongoose");

const User = mongoose.model(
  "User",
  new Schema(
    {
      name: {
        type: String,
        requied: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      image: {
        type: Array,
        required: true,
      },
      available: {
        type: Boolean,
      },
      user: Object,
      adopter: Object,
    },
    { timestamps: true }
  )
);

module.exports = User;

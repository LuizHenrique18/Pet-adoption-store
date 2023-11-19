const mongoose = require("../db/conn");
const { Schema } = require("mongoose");

const Pet = mongoose.model(
  "Pet",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = Pet;

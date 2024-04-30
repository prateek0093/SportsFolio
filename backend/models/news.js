const mongoose = require("mongoose");
const news = new mongoose.Schema(
  {
    news: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    visitHistory: [
      {
        timestamp: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);
const update = mongoose.model("update", news);
module.exports = update;

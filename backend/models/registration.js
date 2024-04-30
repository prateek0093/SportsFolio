const mongoose = require("mongoose");
const { Schema } = mongoose;
const newSchema = new mongoose.Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    require: true,
  },
  sport: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  participants: {
    type: Number,
    require: true,
  },
  tageline: {
    type: String,
    require: true,
  },
  venue: {
    type: String,
    require: true,
  },
  application_open: {
    type: Date,
    require: true,
  },
  application_close: {
    type: Date,
    require: true,
  },
  sportsthon_open: {
    type: Date,
    require: true,
  },
  sportsthon_close: {
    type: Date,
    require: true,
  },
});
const host = mongoose.model("host", newSchema);

module.exports = host;

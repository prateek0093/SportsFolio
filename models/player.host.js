const mongoose = require("mongoose");
const { Schema } = mongoose;
const player = new mongoose.Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Host",
  },
  eventJoined: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  playerName: {
    type: String,
    require: true,
    unique: true,
  },
  teamName: {
    type: String,
    require: true,
    unique: true,
  },
  squadSize: {
    type: Number,
    require: true,
  },
  phoneNo: {
    type: Number,
    require: true,
  },
});
const team = mongoose.model("team", player);
module.exports = team;

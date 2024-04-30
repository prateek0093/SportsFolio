const mongoose = require("mongoose");
const { Schema } = mongoose;
const player = new mongoose.Schema({
  eventJoined: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  playerName: {
    type: String,
    require: true,
  },
  teamName: {
    type: String,
    require: true,
  },
  phoneNo: {
    type: Number,
    require: true,
  },
});
const playerMate = mongoose.model("playerMate", player);
module.exports = playerMate;

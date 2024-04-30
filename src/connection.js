const mongoose = require("mongoose");
async function connectMongodB(url) {
  return mongoose.connect(url);
}
module.exports = {
  connectMongodB,
};

const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });
    console.log("Connect Mongo success!!");
  } catch (error) {
    console.log(error);
  }
}
module.exports = { connect };

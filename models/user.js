const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema(
  {
    us: {
      type: String,
      required: true,
    },
    pa: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);

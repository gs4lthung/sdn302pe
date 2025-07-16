const { Schema, default: mongoose } = require("mongoose");

const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseDescription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Courses", courseSchema);

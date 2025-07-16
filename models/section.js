const { Schema, default: mongoose } = require("mongoose");

const sectionSchema = new Schema(
  {
    sectionName: {
      type: String,
      required: true,
    },
    sectionDescription: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    isMainTask: {
      type: Boolean,
      default: false,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sections", sectionSchema);

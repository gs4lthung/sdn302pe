var express = require("express");
var router = express.Router();
const course = require("../models/course");
router.get("/", async function (req, res) {
  try {
    const courses = await course.find();
    return res.status(200).json({
      message: "List of courses",
      courses: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const courseId = req.params.id;
    const courseDetails = await course.findById(courseId);
    if (!courseDetails) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(200).json({
      message: "Course details",
      course: courseDetails,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.post("/", async function (req, res) {
  try {
    const { courseName, courseDescription } = req.body;
    if (!courseName || !courseDescription) {
      return res
        .status(400)
        .json({ error: "Course name and description are required" });
    }

    const newCourse = await course.create({
      courseName: courseName,
      courseDescription: courseDescription,
    });
    if (!newCourse) {
      return res.status(500).json({ error: "Failed to create course" });
    }

    return res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.put("/:id", async function (req, res) {
  try {
    const courseId = req.params.id;
    const { courseName, courseDescription } = req.body;

    const updatedCourse = await course.findByIdAndUpdate(
      courseId,
      {
        courseName: courseName || course.courseName,
        courseDescription: courseDescription || course.courseDescription,
      },
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const courseId = req.params.id;
    const deletedCourse = await course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(200).json({
      message: "Course deleted successfully",
      course: deletedCourse,
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

module.exports = router;

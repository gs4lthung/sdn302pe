var express = require("express");
var router = express.Router();
const courseModel = require("../models/course");
const sectionModel = require("../models/section");
router.get("/", async function (req, res) {
  const courses = await courseModel.find({});
  const sections = await sectionModel.find({}).populate("course");

  res.render("session", {
    username: req.session.username,
    error: req.session.error,
    courses: courses.map((c) => ({
      id: c._id,
      name: c.courseName,
    })),
    sections: sections.map((s) => ({
      id: s._id,
      name: s.sectionName,
      description: s.sectionDescription,
      duration: s.duration,
      isMainTask: s.isMainTask,
      course: s.course ? s.course.courseName : "No Course",
      courseId: s.course ? s.course._id : null,
    })),
  });
});

router.get("/create", async function (req, res) {
  const courses = await courseModel.find({});
  res.render("create", {
    username: req.session.username,
    courses: courses.map((c) => ({
      id: c._id,
      name: c.courseName,
    })),
    error: req.session.error,
  });
});

router.post("/", async function (req, res) {
  const { sectionName, sectionDescription, duration, isMainTask, course } =
    req.body;
  console.log(req.body);
  if (!sectionName || !sectionDescription || !duration || !course) {
    req.session.error = "All fields are required";
    return res.redirect("/view/sessions/create");
  }

  try {
    const isNameValid = /^([A-Z][a-z0-9]*)(\s[A-Z][a-z0-9]*)*$/.test(
      sectionName
    );
    //   const regex = /^[a-zA-Z0-9\s]+$/

    /**
     * Alphabets only	/^[A-Za-z]+$/	Only letters, no spaces
Alphanumeric (no spaces)	/^[A-Za-z0-9]+$/	Letters and digits
Alphanumeric (with spaces)	/^[A-Za-z0-9 ]+$/	Letters, digits, spaces
Only digits	/^\d+$/	0–9 only
Valid email	/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/	Basic email check
Valid US phone number	/^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/	Supports (123) 456-7890, 123-456-7890, etc.
Starts with capital letter	/^[A-Z]/	First letter is uppercase
Each word capitalized	/^([A-Z][a-z0-9]*)(\s[A-Z][a-z0-9]*)*$/	Like "My Name Is GPT"
Valid username	/^[a-zA-Z0-9_]{3,16}$/	3–16 characters, letters/numbers/underscores
Valid password (strong)	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/	At least 8 chars, 1 upper, 1 lower, 1 digit, 1 special
Hex color code	`/^#?([a-fA-F0-9]{6}	[a-fA-F0-9]{3})$/`
Date format (YYYY-MM-DD)	/^\d{4}-\d{2}-\d{2}$/	Simple ISO format
IP Address (IPv4)	/^(\d{1,3}\.){3}\d{1,3}$/	Basic IPv4 validation
URL (basic)	/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/\S*)?$/	Simple URL checker
     */

    if (!isNameValid) {
      console.log("Invalid section name");
      req.session.error = "Section name must start with a capital letter";
      res.redirect("/view/sessions/create");
      return;
    }

    const isSectionExists = await sectionModel.findOne({
      sectionName: sectionName,
    });

    if (isSectionExists) {
      req.session.error = "Section already exists";
      return res.redirect("/view/sessions/create");
    }

    const newSection = await sectionModel.create({
      sectionName: sectionName,
      sectionDescription: sectionDescription,
      duration: duration,
      isMainTask: isMainTask === "on",
      course: course,
    });

    req.session.error = null;

    res.redirect("/view/sessions");
  } catch (error) {
    console.error("Error creating section:", error);
    req.session.error = "An error occurred";
    res.redirect("/view/sessions/create");
  }
});

router.post("/:id", async function (req, res) {
  console.log("Updating section with ID:", req.params.id);
  console.log("Request body:", req.body);
  const { id } = req.params;
  const { sectionName, sectionDescription, duration, isMainTask, course } =
    req.body;

  try {
    const isNameValid = /^([A-Z][a-z0-9]*)(\s[A-Z][a-z0-9]*)*$/.test(
      sectionName
    );

    if (!isNameValid) {
      console.log("Invalid section name");
      req.session.error = "Section name must start with a capital letter";
      return res.redirect("/view/sessions");
    }

    const section = await sectionModel.findById(id);
    if (!section) {
      console.log("Section not found");
      req.session.error = "Section not found";
      return res.redirect("/view/sessions");
    }

    section.sectionName = sectionName || section.sectionName;
    section.sectionDescription =
      sectionDescription || section.sectionDescription;
    section.duration = duration || section.duration;
    section.isMainTask = isMainTask === "on" || section.isMainTask;
    section.course = course || section.course;
    await section.save();

    req.session.error = null;
    res.redirect("/view/sessions");
  } catch (error) {
    console.error("Error updating section:", error);
    req.session.error = "An error occurred";
    res.redirect("/view/sessions");
  }
});

router.delete("/:id", async function (req, res) {
  const { id } = req.params;

  try {
    const section = await sectionModel.findById(id);
    if (!section) {
      console.log("Section not found");
      req.session.error = "Section not found";
      return res.redirect("/view/sessions");
    }
    await sectionModel.deleteOne({ _id: id });
    req.session.error = null;
    return res.status(200).json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting section:", error);
    req.session.error = "An error occurred while deleting the section";
    res.redirect("/view/sessions");
  }
});

module.exports = router;

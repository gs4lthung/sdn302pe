var express = require("express");
var router = express.Router();
const member = require("../models/member");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/view/auth/login", function (req, res) {
  res.render("login");
});

router.post("/api/auth/login", async function (req, res) {
  try {
    console.log("Login request received:", req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const isMemberExist = await member.findOne({
      username: username,
    });

    if (!isMemberExist) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      isMemberExist.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const accessToken = jwt.sign(
      {
        username: isMemberExist.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
    });

    if (req.headers["content-type"] === "application/json") {
      return res
        .status(200)
        .json({ accessToken: accessToken, message: "Login successful" });
    }

    req.session.accessToken = accessToken;
    req.session.username = isMemberExist.username;
    return res.redirect("/view/sessions");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
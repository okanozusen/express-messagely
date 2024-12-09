const express = require("express");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const User = require("../models/user");
const router = new express.Router();

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (await User.authenticate(username, password)) {
    await User.updateLoginTimestamp(username);
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  } else {
    return res.status(400).json({ error: "Invalid username/password" });
  }
});

router.post("/register", async (req, res, next) => {
  const { username, password, first_name, last_name, phone } = req.body;
  const newUser = await User.register({ username, password, first_name, last_name, phone });
  await User.updateLoginTimestamp(username);
  const token = jwt.sign({ username }, SECRET_KEY);
  return res.json({ token });
});

module.exports = router;

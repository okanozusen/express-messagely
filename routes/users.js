const express = require("express");
const User = require("../models/user");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const router = new express.Router();

router.get("/", ensureLoggedIn, async (req, res, next) => {
  const users = await User.all();
  return res.json({ users });
});

router.get("/:username", ensureCorrectUser, async (req, res, next) => {
  const user = await User.get(req.params.username);
  return res.json({ user });
});

router.get("/:username/to", ensureCorrectUser, async (req, res, next) => {
  const messages = await User.messagesTo(req.params.username);
  return res.json({ messages });
});

router.get("/:username/from", ensureCorrectUser, async (req, res, next) => {
  const messages = await User.messagesFrom(req.params.username);
  return res.json({ messages });
});

module.exports = router;

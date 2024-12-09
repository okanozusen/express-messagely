const express = require("express");
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const router = new express.Router();

router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  const message = await Message.get(req.params.id);
  if (
    message.from_user.username !== req.user.username &&
    message.to_user.username !== req.user.username
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({ message });
});

router.post("/", ensureLoggedIn, async (req, res, next) => {
  const { to_username, body } = req.body;
  const message = await Message.create({
    from_username: req.user.username,
    to_username,
    body,
  });
  return res.json({ message });
});

router.post("/:id/read", ensureLoggedIn, async (req, res, next) => {
  const message = await Message.get(req.params.id);
  if (message.to_user.username !== req.user.username) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const updatedMessage = await Message.markRead(req.params.id);
  return res.json({ message: updatedMessage });
});

module.exports = router;

const express = require("express");
const router = new express.Router();

const chatController = require("../controllers/chat-controller");

router.post("/new", chatController.createChat);
router.patch("/:cid", chatController.updateChat);
router.get("/:uid", chatController.getUserChats);
router.delete("/:cid", chatController.deleteChat);
router.delete("/messages/:cid", chatController.clearChat);

module.exports = router;
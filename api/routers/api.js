const express = require('express');
const ChatController = require('../controllers/chat.js');

const router = express.Router();

router.post('/chat', ChatController.chat);

module.exports = router;
const express = require('express');
const ChatController = require('../controllers/chat.js');

const router = express.Router();

router.post('/completion', ChatController.completion);
router.post('/save', ChatController.save);
router.get('/conversation/:id', ChatController.conversation);
router.post('/random', ChatController.random);

module.exports = router;
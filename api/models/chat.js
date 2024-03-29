const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  promptName: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  messages: [{
    author: String,
    text: String
  }],
  displayedTimestamp: {
    type: String
  },
  isSharingPublicly: {
    type: Boolean
  },
  avatar: {
    type: Number
  },
  scoreCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
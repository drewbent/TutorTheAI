const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  chat: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Chat'
  },
  question1: {
    type: Number
  },
  question2: {
    type: Number
  }
}, {
  timestamps: true
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
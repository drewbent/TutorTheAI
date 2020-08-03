const axios = require('axios');
const Chat = require('../models/chat.js');
const { PROMPTS } = require('../constants/prompts');
const mongoose = require('mongoose');
const Score = require('../models/score.js');

const OPENAI_API_URL = 'https://api.openai.com/v1/';

const axiosAPI = axios.create({
  baseURL: OPENAI_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ process.env.API_KEY }`
  }
});

const ChatController = {
  completion: async (req, res) => {
    const promptName = req.body.promptName;
    const messageList = req.body.messageList;
    const prompt = ChatControllerHelper.getPrompt(messageList, promptName);
  
    console.log(prompt);
    console.log('\n\n\n\n');
  
    try {
      const resp = await axiosAPI.post('engines/davinci/completions', {
        prompt,
        max_tokens: 150,
        temperature: 0.9,
        top_p: 1,
        n: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stream: false,
        stop: ['\n', 'Tutor:', 'Student:']
      });
  
      res.json(resp.data);
    }
    catch(err) {
      console.log(err);
      res.status(400).json(`Error: ${ err }`);
    }
  },

  save: async (req, res) => {
    const messageList = req.body.messageList;
    const concept = req.body.concept;
    const time = req.body.time;
    const isSharingPublicly = req.body.isSharingPublicly;

    const promptName = concept.name;
    const prompt = ChatControllerHelper.getPrompt(messageList, promptName);
    const messages = messageList.map(msg => ({
      author: msg.author,
      text: msg.data.text
    }));
    const displayedTimestamp = time;

    const props = {
      promptName,
      prompt,
      messages,
      displayedTimestamp,
      isSharingPublicly
    }
    try {
      const newChat = new Chat(props);
      const savedChat = await newChat.save();
      const resp = {
        id: savedChat._id
      };

      res.json(resp);
    }
    catch(err) {
      console.log(err);
      res.status(400).json(`Error: ${ err }`);
    }
  },

  conversation: async (req, res) => {
    const id = req.params.id;

    try {
      const chat = await Chat.findById(id);
      const scores = await Score.find({ chat: mongoose.Types.ObjectId(id) });

      const resp = {
        chat,
        scores
      }

      res.json(resp);
    }
    catch(err) {
      console.log(err);
      res.status(400).json(`Error: ${ err }`);
    }
  },

  score: async (req, res) => {
    const prevIds = req.body.prevIds;
    const scores = req.body.scores;
    const currentId = prevIds.length > 0 && prevIds[0];

    const prevObjectIds = prevIds.map(id => mongoose.Types.ObjectId(id));

    try {
      const chats = await Chat.aggregate([
        {
          $match: {
            _id: {
              $not: { $in: prevObjectIds }
            },
            isSharingPublicly: true
          },
        },
        {
          $sample: { size: 1 }
        }
      ]);
      const chat = (chats.length > 0) && chats[0];

      const resp = {
        id: chat && chat._id
      }

      // Add scores to database as applicable
      if (currentId && scores) {
        const props = {
          chat: currentId
        };
        if (scores.length >= 1) props.question1 = scores[0]
        if (scores.length >= 2) props.question2 = scores[1]

        const newScore = new Score(props);
        await newScore.save();

        // Increment score count on Chat object.
        const chat = await Chat.findById(currentId);
        chat.scoreCount += 1;
        await chat.save();
      }
      
      res.json(resp);
    }
    catch(err) {
      console.log(err);
      res.status(400).json(`Error: ${ err }`);
    }
  }
}

const ChatControllerHelper = {
  getPrompt: (messages, promptName) => {
    const beginningConversation = PROMPTS[promptName];
  
    const formattedMessages = messages.map(msg => {
      const isGPT3 = (msg.author === 'them');
      const text = msg.data.text;
      return `${isGPT3 ? 'Student' : 'Tutor'}: ${text}`;
    });
    const actualConversation = formattedMessages.join('\n');
  
    const startSequence = '\nStudent:'
  
    return (
      beginningConversation +
      actualConversation +
      startSequence
    );
  }
}

module.exports = ChatController;
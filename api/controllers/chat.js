const axios = require('axios');
const Chat = require('../models/chat.js');
const {
  PROMPTS, BASE_API_PARAMETERS, BASE_CONTENT_FILTER_PARAMETERS
} = require('../constants/prompts');
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
    const params = ChatControllerHelper.getAPIParams(promptName);
  
    console.log(prompt);
    console.log('\n\n\n\n');
  
    try {
      const resp = await axiosAPI.post('engines/davinci/completions', {
        ...params,
        prompt,
        stream: false
      });

      const choices = resp && resp.data && resp.data.choices;
      const respText = (
        choices && choices.length >= 1 && choices[0] && choices[0].text &&
          choices[0].text.trim()
      );

      //const isToxic = await ChatControllerHelper.isToxic(respText);
      const isToxic = false;
  
      res.json({
        text: !isToxic ? respText : '',
        isToxic
      });
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
    const beginningConversation = PROMPTS[promptName].text;
  
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
  },

  getAPIParams: (promptName) => {
    return {
      ...BASE_API_PARAMETERS,
      ...PROMPTS[promptName].params
    };
  },

  isToxic: async (textToFilter) => {
    const prompt = `<|endoftext|>${textToFilter}\n--\nLabel: `;

    const resp = await axiosAPI.post('engines/davinci/completions', {
      ...BASE_CONTENT_FILTER_PARAMETERS,
      prompt,
      stream: false
    });

    const choices = resp && resp.data && resp.data.choices;
    const firstChoice = choices && choices.length >= 1 && choices[0];
    const text = firstChoice && firstChoice.text;
    const logprobs = firstChoice && firstChoice.logprobs;

    //console.log(text);
    //console.log(logprobs.top_logprobs);

    return (text === '2');
  }
}

module.exports = ChatController;
const axios = require('axios');
const Chat = require('../models/chat.js');
const { PROMPTS } = require('../constants/prompts');

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
      displayedTimestamp
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

      res.json(chat);
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
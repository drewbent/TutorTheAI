const express = require('express');
const axios = require('axios');

const router = express.Router();

const OPENAI_API_URL = 'https://api.openai.com/v1/';

const axiosAPI = axios.create({
  baseURL: OPENAI_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ process.env.API_KEY }`
  }
});

// Controller
// https://github.com/drewbent/parentclub/blob/6b109af86ab8a90877b3abbce2b5294315dd2579/v1/backend/controllers/question.controller.js
// https://github.com/drewbent/parentclub/blob/6b109af86ab8a90877b3abbce2b5294315dd2579/v1/backend/routes/questions.routes.js

router.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;

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

});

module.exports = router;
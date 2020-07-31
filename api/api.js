const express = require('express');
const axios = require('axios');
const dedent = require('dedent-js');

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

function getPrompt(messages) {
  const overview = dedent`
    The following is a conversation between a tutor and a smart high school student who is learning about orbital hybridization in chemistry for the first time. The student asks a number of questions.\n\n
  `;
  
  const beginningConversation = dedent`
    Tutor: I am going to help you understand about orbital hybridization.
    Student: That sounds good to me. Thank you.
    Tutor: Do you know what they are?
    Student: I don't think so. I know about atomic orbitals, like s and p, though.
    Tutor: Great. Hybrid orbitals are similar, but they help us understand the molecular geometry. You can think of it as mixing atomic orbitals, of sorts.
    Student: Why do they mix?
    Tutor: Let's consider an example like methane: CH4. Do you know the electron configuration of carbon?
    Student: I think it's 1s^2 2s^2 2p^2.
    Tutor: That's right. How many unpaired electrons are there?
    Student: Two, both in the 2p orbitals.
    Tutor: So, according to valence bond theory, how many bonds would it form?
    Student: Two.
    Tutor: But that's not right! We know it forms four bonds. So we must promote the 2s electrons to the empty 2p orbitals.
    Student: I see.
    Tutor: But the geometry is not right. It turns out that there is more symmetry. The nonequivalent orbitals hybridize in preparation for bond formation. So the single 2s orbital and three 2p orbitals form a set of four, equivalent, 2sp^3 orbitals. Does that make sense?
    Student: I think so. But let's try another example.\n
  `;

  const formattedMessages = messages.map(msg => {
    const isGPT3 = (msg.author === 'them');
    const text = msg.data.text;
    return `${isGPT3 ? 'Student' : 'Tutor'}: ${text}`;
  });
  const actualConversation = formattedMessages.join('\n');

  const startSequence = '\nStudent:'

  return (
    overview +
    beginningConversation +
    actualConversation +
    startSequence
  );
};

router.post('/chat', async (req, res) => {
  const messageList = req.body.messageList;
  const prompt = getPrompt(messageList);

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

});

module.exports = router;
import React, { useState } from 'react';
import axios from 'axios';
import dedent from 'dedent-js';
import { Launcher } from 'react-chat-window';

const API_URL = 'http://localhost:5000/api/v1/';
const axiosAPI = axios.create({
  baseURL: API_URL
});

function getPrompt(messages) {
  const overview = dedent`
    The following is a conversation between a tutor and a smart high school\
    student who is learning about orbital hybridization in chemistry for the\
    first time. The student asks a number of questions.\n\n
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

const App = () => {

  const initialMessages = [
    {
      author: 'me',
      type: 'text',
      data: {
        text: `Let's look at ethene and try to understand its hybridization. Do you remember the chemical formula for ethene?`
      }
    },
    {
      author: 'them',
      type: 'text',
      data: {
        text: 'C2H4.'
      }
    },
  ];
  const [messageList, setMessageList] = useState(initialMessages);

  async function handleUserMessage(message) {
    const newMessageList = [...messageList, message];
    setMessageList(newMessageList);

    const prompt = getPrompt(newMessageList);
    console.log(prompt);
    console.log('\n\n\n\n');
    const resp = await axiosAPI.post('/chat', {
      prompt
    });

    const choices = resp && resp.data && resp.data.choices;
    console.log(choices);
    const respText = (
      choices && choices.length >= 1 && choices[0] && choices[0].text
    );
    handleGPT3Message(respText);
  }

  async function handleGPT3Message(messageText) {
    const message = {
      author: 'them',
      type: 'text',
      data: {
        text: messageText
      }
    };

    setMessageList(prevMessageList =>[
      ...prevMessageList, message
    ]);
  }

  return (
    <div>
      <Launcher
        agentProfile={{
          teamName: 'Tutor the AI',
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
        }}
        onMessageWasSent={ handleUserMessage }
        messageList={ messageList }
      />
    </div>
  );
}

export default App;

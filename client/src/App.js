import React, { useState } from 'react';
import axios from 'axios';
import { Launcher } from 'react-chat-window/lib/index.js';
import { Select } from '@blueprintjs/select';

const API_URL = 'http://localhost:5000/api/v1/';
const axiosAPI = axios.create({
  baseURL: API_URL
});

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

    const resp = await axiosAPI.post('/chat', {
      messageList: newMessageList
    });

    const choices = resp && resp.data && resp.data.choices;
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
      <Select
        items={ ['Hello', 'Testing' ]}
        />
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

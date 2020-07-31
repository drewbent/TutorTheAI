import React, { useState } from 'react';
import axios from 'axios';
import { Launcher } from './react-chat-window/lib/index.js';
import { Popover, Menu, Button, Position } from '@blueprintjs/core';
import styled from 'styled-components'

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
    <>
      <S.Body>
        <Popover
          content={
            <Menu>
              <Menu.Divider title="Chemistry" />
              <Menu.Item text="Hybridization" />
              <Menu.Item text="Periodic Table" />
              <Menu.Divider title="Biology" />
              <Menu.Item text="DNA-RNA-Protein" />
              <Menu.Item text="CRISPR" />
              <Menu.Item text="Immunology" />
              <Menu.Divider title="Physics" />
              <Menu.Item text="Conservation of energy" />
              <Menu.Item text="Quantum mechanics" />
            </Menu>
          }
          position={ Position.RIGHT }
        >
          <Button text="Choose a concept" large="true" rightIcon="caret-down" />
        </Popover>
      </S.Body>

      <Launcher
        agentProfile={{
          teamName: 'Tutor the AI',
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
        }}
        onMessageWasSent={ handleUserMessage }
        messageList={ messageList }
        />
    </>
  );
}

export default App;

const S = {};
S.Body = styled.div`
  display: flex;
  height: 100%;
  width: 100%;

  justify-content: center;
  align-items: center;
`;

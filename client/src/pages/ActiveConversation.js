import axios from 'axios';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Launcher } from 'react-chat-window';
import logoWhiteBkg from '../images/logo_white_bkg.png';
import Header from '../components/Header';
import styled from 'styled-components';
import { Button } from '@blueprintjs/core';
import { MAX_NUM_OF_USER_MESSAGES } from '../constants/concepts';

const API_URL = 'http://localhost:5000/api/v1/';
const axiosAPI = axios.create({
  baseURL: API_URL
});

const composeMessage = ({ text, me }) => ({
  author: me ? 'me' : 'them',
  type: 'text',
  data: {
    text
  }
});

export default function ActiveConversation(props) {
  const locationState = props.location.state;
  const concept = locationState && locationState.concept;

  const initialMessage = concept && composeMessage({
    text: concept.humanFirstMessage,
    me: true
  });

  const [messageList, setMessageList] = useState([initialMessage]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const messagesRemaining = (
    Math.floor(1 + MAX_NUM_OF_USER_MESSAGES - messageList.length / 2)
  );

  if (!concept) {
    return <Redirect to="/" />
  }

  async function start() {
    setHasStarted(true);

    const newMessage = concept && concept.aiFirstMessage;
    handleGPT3Message(newMessage);
    setIsChatOpen(true);
  }

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
    const message = composeMessage({
      text: messageText,
      me: false
    });

    setMessageList(prevMessageList =>[
      ...prevMessageList, message
    ]);
  }

  function handleLauncherClick() {
    if (!hasStarted) {
      start();
    }

    setIsChatOpen(!isChatOpen);
  }
  
  return (
    <>
      <Header />

      <S.Body>
        <S.Title>{ concept.displayName }</S.Title>

        <S.Paragraph>
          You are tutoring the AI, who is playing the role of a high schooler learning the concept for the first time. They have general background knowledge on the subject.
        </S.Paragraph>

        <S.Paragraph>
          Your instructions:
          <S.Bullets>
            {concept.instructions.map((instruction, i) => (
              <S.Bullet key={i}>
                { instruction }
              </S.Bullet>
            ))}
            <S.Bullet>
              You have { messagesRemaining } messages remaining to accomplish this task.
            </S.Bullet>
          </S.Bullets>
        </S.Paragraph>

        <S.ActionButton
            onClick={ start }
            large={ true }
            icon={ 'learning' }
            intent={ 'success' }
            disabled={ hasStarted }>
          Let's go!
        </S.ActionButton>
      </S.Body>

      <Launcher
        agentProfile={{
          teamName: 'Tutor the AI',
          imageUrl: logoWhiteBkg
        }}
        onMessageWasSent={ handleUserMessage }
        handleClick={ handleLauncherClick }
        messageList={ messageList }
        isOpen={ isChatOpen } />
    </>
  );
}

const S = {};
S.Body = styled.div`
  max-width: 700px;

  padding: 0 10px;

  @media(min-width: 600px) {
    padding-left: 50px;
  }
`;
S.Title = styled.h2`

`;
S.Paragraph = styled.div`
  font-size: 16px;
  margin: 20px 0;
`;
S.Bullets = styled.ul`
  margin-top: 5px;
`;
S.Bullet = styled.li`

`;
S.ActionButton = styled(Button)`
  margin-top: 15px;
`;
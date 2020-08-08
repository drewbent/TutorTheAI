import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Launcher } from 'react-chat-window';
import logoWhiteBkg from '../images/logo_white_bkg.png';
import Header from '../components/Header';
import styled from 'styled-components';
import { Button, Spinner } from '@blueprintjs/core';
import {
  MAX_NUM_OF_USER_MESSAGES,
  GENERAL_INSTRUCTIONS_OVERVIEW,
  GENERAL_INSTRUCTIONS,
  IS_TOXIC_REPLY
} from '../constants/concepts';
import { API_URL } from '../constants/axios';
import moment from 'moment';
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from '../constants/recaptcha';
import { AppToaster } from '../components/AppToaster';
import { GA } from '../services/GA';

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

  const history = useHistory();

  const initialMessage = (concept && concept.humanFirstMessage &&
    composeMessage({
      text: concept.humanFirstMessage,
      me: true
    })
  );
  const initialMessageList = initialMessage ? [initialMessage] : [];

  const [messageList, setMessageList] = useState(initialMessageList);
  const [hasStarted, setHasStarted] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [finishingEarly, setFinishingEarly] = useState(false);
  const [waitingForAI, setWaitingForAI] = useState(false);

  const hasCompletedCaptcha = !!captchaValue;

  const numUserMessages = messageList.filter(x => x.author === 'me').length;
  const messagesRemaining = (MAX_NUM_OF_USER_MESSAGES - numUserMessages);

  const lastMessageFromAI = (
    messageList.length > 0
    && messageList[messageList.length - 1].author === 'them'
  );

  let messagesRemainingStr = `${messagesRemaining} messages`;
  if (messagesRemaining === 1) {
    messagesRemainingStr = messagesRemainingStr.slice(0, -1);
  }

  useEffect(() => {
    if ((messagesRemaining === 0 && lastMessageFromAI) || finishingEarly) {
      // Completed with messages
      const timer = setTimeout(() => {
        const time = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

        history.push('/conversation', {
          messageList: messageList,
          concept: concept,
          time: time
        });
      }, finishingEarly ? 0 : 1800);

      if (!finishingEarly) {
        GA.event({
          category: 'Conversation',
          action: 'Finish conversation at limit'
        });
      }

      return () => clearTimeout(timer);
    }
  }, [
    messagesRemaining, lastMessageFromAI, concept, history, messageList,
    finishingEarly
  ]);

  if (!concept) {
    return <Redirect to="/" />
  }

  const conceptInstructions = [
    ...concept.instructions, ...GENERAL_INSTRUCTIONS
  ];

  function start() {
    setHasStarted(true);

    const newMessage = concept && concept.aiFirstMessage;
    handleGPT3Message(newMessage);
    setIsChatOpen(true);
  }

  async function finishEarly() {
    setFinishingEarly(true);

    GA.event({
      category: 'Conversation',
      action: 'Finish conversation early',
      value: messagesRemaining
    });
  }

  async function handleUserMessage(message) {
    const prevMessage = messageList[messageList.length - 1];
    const prevMessageIsMe = (prevMessage.author === 'me');
    if (prevMessageIsMe) {
      // User tried to submit two questions in a row.
      return;
    }
    
    if (messagesRemaining <= 0) {
      // User quickly submitted a question even though they had no remaining.
      return;
    }

    const newMessageList = [...messageList, message];
    setMessageList(newMessageList);

    GA.event({
      category: 'Conversation',
      action: 'Send message to AI'
    });

    try {
      setWaitingForAI(true);

      const resp = await axiosAPI.post('/completion', {
        messageList: newMessageList,
        promptName: concept.name,
        captchaValue
      }, {
        withCredentials: true
      });

      setWaitingForAI(false);

      const respText = resp && resp.data && resp.data.text;
      const isToxic = resp && resp.data && resp.data.isToxic;
      if (!isToxic) {
        handleGPT3Message(respText);
      } else {
        handleGPT3Message(IS_TOXIC_REPLY);
      }
    }
    catch(err) {
      if (err.response && err.response.status === 401) {
        AppToaster.show({
          message: 'Timed out. Please reload the page.',
          intent: 'danger'
        });
      }
    }
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

  function onCaptchaChange(value) {
    setCaptchaValue(value);
  }
  
  return (
    <>
      <Header />

      <S.Body>
        <S.Title>{ concept.displayName }</S.Title>

        <S.Paragraph>
          { GENERAL_INSTRUCTIONS_OVERVIEW }
        </S.Paragraph>

        <S.Paragraph>
          Your instructions:
          <S.Bullets>
            {conceptInstructions.map((instruction, i) => (
              <S.Bullet key={i}>
                { instruction }
              </S.Bullet>
            ))}
            <S.Bullet>
              You have <b>{ messagesRemainingStr }</b> remaining to accomplish this task.
            </S.Bullet>
          </S.Bullets>
        </S.Paragraph>

        {!hasStarted &&
          <ReCAPTCHA
            sitekey={ RECAPTCHA_SITE_KEY }
            onChange={ onCaptchaChange }
          />
        }

        <S.ActionButton
            onClick={ hasStarted ? finishEarly : start }
            disabled={ !hasCompletedCaptcha }
            large={ true }
            icon={ hasStarted ? 'stop' : 'learning' }
            intent={ hasStarted ? 'primary' : 'success' }
            outlined={ hasStarted ? true : false }>
          {hasStarted ? `Finish early` : `Let's go!` }
        </S.ActionButton>

        {waitingForAI &&
          <S.Spinner size={ 30 } />
        }
      </S.Body>

      {hasCompletedCaptcha &&
        <Launcher
          agentProfile={{
            teamName: 'Tutor the AI',
            imageUrl: logoWhiteBkg
          }}
          onMessageWasSent={ handleUserMessage }
          handleClick={ handleLauncherClick }
          messageList={ messageList }
          isOpen={ isChatOpen } />
      }
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
S.Spinner = styled(Spinner)`
  justify-content: left;
  margin-top: 20px;
`;
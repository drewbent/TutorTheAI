import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button, Card, Elevation } from '@blueprintjs/core';
import styled, { css } from 'styled-components';
import logo from '../images/logo.png';
import { Redirect } from 'react-router-dom';
import { API_URL } from '../constants/axios';

const axiosAPI = axios.create({
  baseURL: API_URL
});

export default function SavedConversation(props) {
  const locationState = props.location.state;
  const messageList = locationState && locationState.messageList;
  const concept = locationState && locationState.concept;
  const time = locationState && locationState.time;

  if (!messageList || !concept || !time) {
    return <Redirect to="/" />
  }

  async function handleSaveClicked() {
    const resp = await axiosAPI.post('/csavehat', {
      messageList,
      concept
    });
  }

  const messageListExtended = [{
    author: 'them',
    type: 'text',
    data: {
      text: `Hi! I'm the AI.`
    }
  }, ...messageList]

  return (
    <>
      <Header />

      <S.Title>
        { concept.displayName }
      </S.Title>
      <S.Subtitle>
        { time }
      </S.Subtitle>

      <S.TopControls>
        <Button
            onClick={ handleSaveClicked }
            large={ true }
            icon={ 'saved' }
            intent={ 'success' }>
          Save message history
        </Button>
      </S.TopControls>

      <S.CardList>
        {messageListExtended.map((message, i) => {

          const isMe = (message.author === 'me');
          return (
            <S.CardRow key={ i } isMe={ isMe }>
              {!isMe &&
                <S.AILogo src={ logo } />
              }
              <S.Card
                  interactive={ true }
                  elevation={ Elevation.ONE }>
                <p>
                  { message.data.text }
                </p>
              </S.Card>
            </S.CardRow>
          );

        })}
      </S.CardList>
    </>
  );
}

const S = {};
S.Title = styled.h1`
  text-align: center;
`;
S.Subtitle = styled.h3`
  text-align: center;
`;
S.TopControls = styled.div`
  text-align: center;
`;
S.CardList = styled.div`
  margin: 50px auto;
  width: 95%;
  max-width: 700px;
`;
S.Card = styled(Card)`
  width: 60%;
  margin: 20px 0;
`;
S.CardRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  ${props => props.isMe && css`
    justify-content: flex-end;

    ${S.Card} {
      background-color: #4e8cff;
      color: white;
    }
  `}
`;
S.AILogo = styled.img`
  height: 40px;
  margin-right: 5px;
`;
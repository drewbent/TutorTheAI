import { Card, Elevation, Spinner } from '@blueprintjs/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams, useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Header from '../components/Header';
import SaveSessionButton from '../components/SaveSessionButton';
import { API_URL } from '../constants/axios';
import logo from '../images/logo.png';
import { getConceptDisplayName } from '../helpers';

const axiosAPI = axios.create({
  baseURL: API_URL
});

export default function SavedConversation(props) {
  // Should either have location state (coming directly from having
  // had the conversation) or have url params (linked to it by friend or as a
  // reviewer).

  const history = useHistory();

  // Location state
  const locationState = props.location.state;
  const messageListDefault = locationState && locationState.messageList;
  const conceptDefault = locationState && locationState.concept;
  const timeDefault = locationState && locationState.time;
  const [messageList, setMessageList] = useState(messageListDefault);
  const [concept, setConcept] = useState(conceptDefault);
  const [time, setTime] = useState(timeDefault);

  // URL params
  const { id } = useParams();
  const hasParams = !!id;
  const [hasFetchedData, setHasFetchedData] = useState(false);
  useEffect(() => {
    async function fetchConversation() {
      try {        
        const resp = await axiosAPI.get(`/conversation/${id}`);
        const data = resp && resp.data;

        setTime(data.displayedTimestamp);
        setConcept({
          displayName: getConceptDisplayName(data.promptName)
        });
        setMessageList(data.messages && data.messages.map(msg => ({
          author: msg.author,
          type: 'text',
          data: {
            text: msg.text
          }
        })));
        
        setHasFetchedData(true);
      }
      catch(err) {
        console.log(err);
        history.push('/');
      }
    }

    const missingAllData = (!messageList && !concept && !time);
    if (hasParams && missingAllData) {
      // Only fetch from database if all data is missing and params are
      // provided.
      fetchConversation();
    }
  }, [hasParams, id, time, concept, messageList, history]);

  const missingAnyData = (!messageList || !concept || !time);
  if ((missingAnyData && !hasParams) ||
      (missingAnyData && hasParams && hasFetchedData)) {
    // Redirect if data doesn't exist and it's not coming via params/API.
    // Also redirect if data did come from params/API but it wasn't complete.
    return <Redirect to="/" />
  }

  if (missingAnyData) {
    // If data is still missing, then we must be waiting for it to load via
    // ajax from the API.
    return <S.Spinner size={ 50 } />
  }

  const messageListExtended = [{
    author: 'them',
    type: 'text',
    data: {
      text: `Hi! I'm the AI. Thanks for helping tutor me.`
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

      {!hasParams &&
        <S.TopControls>
          <SaveSessionButton
            dataToSave={{
              messageList,
              concept,
              time
            }} />
        </S.TopControls>
      }

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
S.Spinner = styled(Spinner)`
  height: 100%;
`;
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
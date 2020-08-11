import { Card, Elevation, Spinner, Button } from '@blueprintjs/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams, useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Header from '../components/Header';
import SaveSessionButton from '../components/SaveSessionButton';
import { API_URL } from '../constants/axios';
import avatar1 from '../images/logo.png';
import avatar2 from '../images/avatars/alien-large.png';
import { getConceptDisplayName } from '../helpers';
import EvaluationControls from '../components/EvaluationControls';
import ScoreDisplay from '../components/ScoreDisplay';

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
  const isSpecialAvatarDefault = locationState && locationState.isSpecialAvatar;
  const [messageList, setMessageList] = useState(messageListDefault);
  const [concept, setConcept] = useState(conceptDefault);
  const [time, setTime] = useState(timeDefault);
  const [isSpecialAvatar, setIsSpecialAvatar] = useState(isSpecialAvatarDefault);
  const [scores, setScores] = useState([]);

  // URL params
  const { id } = useParams();
  const [currentIdDownloading, setCurrentIdDownloading] = useState(id);
  const hasParams = !!id;
  const [hasFetchedData, setHasFetchedData] = useState(false);
  useEffect(() => {
    async function fetchConversation() {
      try {        
        const resp = await axiosAPI.get(`/conversation/${id}`);
        const data = resp && resp.data;
        const chat = data && data.chat;
        const scores = data && data.scores;

        setTime(chat.displayedTimestamp);
        setIsSpecialAvatar(chat.avatar === 1);
        setConcept({
          displayName: getConceptDisplayName(chat.promptName)
        });
        setMessageList(chat.messages && chat.messages.map(msg => ({
          author: msg.author,
          type: 'text',
          data: {
            text: msg.text
          }
        })));
        setScores(scores);
        
        setHasFetchedData(true);
      }
      catch(err) {
        console.log(err);
        history.push('/');
      }
    }

    const missingAllData = (!messageList && !concept && !time);
    if ((hasParams && missingAllData) || id !== currentIdDownloading) {
      // Only fetch from database if all data is missing and params are
      // provided ... OR ... if there is a new id / data to fetch.
      setCurrentIdDownloading(id);
      fetchConversation();
    }
  }, [hasParams, id, time, concept, messageList, history, currentIdDownloading]);

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

  // Check if isEvaluating.
  const isEvaluating = locationState && locationState.isEvaluating;
  const evaluationObjectIds = (
    locationState && locationState.evaluationObjectIds
  );
  let newEvaluationObjectIds = [];
  if (evaluationObjectIds) {
    newEvaluationObjectIds = [id, ...evaluationObjectIds];
  }

  const messageListExtended = [{
    author: 'them',
    type: 'text',
    data: {
      text: `Hi! I'm the AI. Thanks for helping tutor me.`
    }
  }, ...messageList];

  function handleReport() {
    // Send to Google form.
    window.open(`https://docs.google.com/forms/d/e/1FAIpQLSdVIQ-UpnuYS3rR5MH-HB5zAf9yiCdQlfBS2e1ckECbBkJZsg/viewform?usp=pp_url&entry.1313298236=${window.location.href}`);
  }

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
        <S.Centered>
          <SaveSessionButton
            dataToSave={{
              messageList,
              concept,
              time,
              avatar: isSpecialAvatar ? 1 : 0
            }} />
        </S.Centered>
      }

      <S.CardList>
        {messageListExtended.map((message, i) => {

          const isMe = (message.author === 'me');
          return (
            <S.CardRow key={ i } isMe={ isMe }>
              {!isMe &&
                <S.AILogo src={ isSpecialAvatar ? avatar2 : avatar1 } />
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

      {isEvaluating &&
        <S.Centered>
          <EvaluationControls
            newEvaluationObjectIds={ newEvaluationObjectIds } />
        </S.Centered>
      }

      {!isEvaluating && hasParams &&
        <S.Centered>
          <ScoreDisplay
            scores={ scores } />
        </S.Centered>
      }

      <S.Spacer />

      {hasParams &&
        <S.Right>
          <S.FlagButton
            text="Report"
            icon="flag"
            intent="warning"
            onClick={ handleReport }
            minimal="true" />
        </S.Right>
      }
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
S.Centered = styled.div`
  text-align: center;
`;
S.Right = styled.div`
  text-align: right;
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
S.Spacer = styled.div`
  height: 40px;
  flex: 0 0 auto;
`;
S.FlagButton = styled(Button)`
  margin: 0 10px 10px 0;
`;
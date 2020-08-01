import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import ConceptPicker from '../components/ConceptPicker';
import logo from '../images/logo.png';
import Header from '../components/Header';
import { Button, Tooltip, Position } from '@blueprintjs/core';
import { API_URL } from '../constants/axios';

const axiosAPI = axios.create({
  baseURL: API_URL
});

export default function Homepage(props) {
  const BUTTON_WIDTH = 200;

  const history = useHistory();

  const [isFindingNextEvaluation, setIsFindingNextEvaluation] = useState(false);

  async function handleEvaluateClick() {
    // TODO(drew): Error handling?
    setIsFindingNextEvaluation(true);
    const resp = await axiosAPI.post('/random', {
      prevIds: []
    });
    setIsFindingNextEvaluation(false);

    const id = resp && resp.data && resp.data.id;
    history.push(`/conversation/${id}`, {
      isEvaluating: true,
      evaluationObjectIds: [] 
    });
  }

  return (
    <>
      <Header noLogo={ true } />

      <S.SpacerTop />
      <S.Body>
        <img src={ logo } alt="Logo" width={ 100 } />
        <h1>Tutor the AI</h1>
        
        <S.Buttons>

          <ConceptPicker
            onChosen={
              (concept) => history.push('/tutoring', { concept })
            }
            buttonWidth={ BUTTON_WIDTH } />
          
          <S.Tooltip
            content={
              <>
                <div>
                  Provide feedback on others' tutoring sessions
                </div>
                <div>
                  (for those who opted in to receive it)
                </div>
              </>
            }
            position={ Position.RIGHT }
            usePortal={ false }>
            <S.Button
              text="Evaluate Others"
              large="true"
              width={ BUTTON_WIDTH }
              onClick={ handleEvaluateClick }
              loading={ isFindingNextEvaluation } />
          </S.Tooltip>

        </S.Buttons>

      </S.Body>
      <S.SpacerBottom />
    </>
  );
}

const S = {};
S.SpacerTop = styled.div`
  flex: 0 1 auto;
  height: 50px;
`;
S.SpacerBottom = styled.div`
  flex: 0 1 auto;
  height: 200px;
`;
S.Body = styled.div`
  flex: 1 1 auto;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
S.Buttons = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  
  > * {
    margin-top: 10px;
  }
`;
S.Tooltip = styled(Tooltip)`
  width: 100%;
`;
S.Button = styled(Button)`
  width: ${props => props.width}px;
`;
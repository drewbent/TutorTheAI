import PropTypes from 'prop-types'
import axios from 'axios';
import React, { useState } from 'react'
import { RadioGroup, Radio, Callout, Button } from '@blueprintjs/core';
import styled from 'styled-components';
import { API_URL } from '../constants/axios';
import { useHistory } from 'react-router-dom';
import { animateScroll } from 'react-scroll';

const axiosAPI = axios.create({
  baseURL: API_URL
});

export default function EvaluationControls(props) {
  const [question1Value, setQuestion1Value] = useState();
  const [question2Value, setQuestion2Value] = useState();
  const bothQuestionsAnswered = question1Value && question2Value;

  const [isFindingNextEvaluation, setIsFindingNextEvaluation] = useState(false);

  const history = useHistory();

  function handleQuestion1Change(e) {
    setQuestion1Value(e.target.value);
  }

  function handleQuestion2Change(e) {
    setQuestion2Value(e.target.value);
  }

  async function handleSubmit() {
    setIsFindingNextEvaluation(true);
    const resp = await axiosAPI.post('/random', {
      prevIds: props.newEvaluationObjectIds
    });
    setIsFindingNextEvaluation(false);

    // Clear state of page
    setQuestion1Value(false);
    setQuestion2Value(false);
    animateScroll.scrollToTop();

    const id = resp && resp.data && resp.data.id;
    if (id) {
      history.push(`/conversation/${id}`, {
        isEvaluating: true,
        evaluationObjectIds: props.newEvaluationObjectIds
      });
    }
    else {
      // No id means that everything has been cycyled through.
      // Return to homepage.
      history.push('/');
    }
  }

  return (
    <>
      <S.Callout>
        <S.RadioGroup
            label="Did the human understand the concept they were teaching?"
            onChange={ handleQuestion1Change }
            selectedValue={ question1Value }
            inline={ true }
        >
            <Radio label="Not really" value="0" className="bp3-large" />
            <Radio label="Somewhat" value="1" className="bp3-large" />
            <Radio label="Quite well" value="2" className="bp3-large" />
            <Radio label="Mastered" value="3" className="bp3-large" />
        </S.RadioGroup>
      </S.Callout>

      <S.Callout>
        <S.RadioGroup
            label="Did the AI end up learning the concept?"
            onChange={ handleQuestion2Change }
            selectedValue={ question2Value }
            inline={ true }
        >
            <Radio label="Not really" value="0" className="bp3-large" />
            <Radio label="Somewhat" value="1" className="bp3-large" />
            <Radio label="Quite well" value="2" className="bp3-large" />
            <Radio label="Mastered" value="3" className="bp3-large" />
        </S.RadioGroup>
      </S.Callout>

      {bothQuestionsAnswered &&
        <S.Button
          text="Submit & Proceed to Next"
          large="true"
          intent="primary"
          onClick={ handleSubmit }
          loading={ isFindingNextEvaluation } />
      }

      <S.Spacer />
    </>
  );
}

EvaluationControls.propTypes = {
  newEvaluationObjectIds: PropTypes.array.isRequired
}

const S = {};
S.RadioGroup = styled(RadioGroup)`
  font-weight: 600;
`;
S.Callout = styled(Callout)`
  margin-top: 10px;
`;
S.Button = styled(Button)`
  margin-top: 10px;
`;
S.Spacer = styled.div`
  height: 40px;
`;
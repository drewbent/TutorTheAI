import PropTypes from 'prop-types'
import axios from 'axios';
import React, { useState } from 'react'
import { RadioGroup, Callout, Button } from '@blueprintjs/core';
import styled from 'styled-components';
import { API_URL } from '../constants/axios';
import { useHistory } from 'react-router-dom';
import { animateScroll } from 'react-scroll';
import { LABELS_MAPPED_TO_SCORES, SCORE_PROMPTS } from '../constants/scores';
import { GA } from '../services/GA';

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
    const resp = await axiosAPI.post('/score', {
      prevIds: props.newEvaluationObjectIds,
      scores: [question1Value, question2Value]
    });
    setIsFindingNextEvaluation(false);

    // Clear state of page
    setQuestion1Value(false);
    setQuestion2Value(false);
    animateScroll.scrollToTop();

    GA.event({
      category: 'Evaluation',
      action: 'Rate conversation'
    });

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

  const radioOptions = (
    Object.keys(LABELS_MAPPED_TO_SCORES).map((key) => ({
      value: `${key}`,
      label: LABELS_MAPPED_TO_SCORES[key],
      className: "bp3-large"
    }))
  );

  return (
    <>
      <S.Callout>
        <S.RadioGroup
            label={ SCORE_PROMPTS[0] }
            onChange={ handleQuestion1Change }
            selectedValue={ question1Value }
            inline={ true }
            options={ radioOptions } />
      </S.Callout>

      <S.Callout>
        <S.RadioGroup
            label={ SCORE_PROMPTS[1] }
            onChange={ handleQuestion2Change }
            selectedValue={ question2Value }
            inline={ true }
            options={ radioOptions } />
      </S.Callout>

      {bothQuestionsAnswered &&
        <S.Button
          text="Submit & Proceed to Next"
          large="true"
          intent="primary"
          onClick={ handleSubmit }
          loading={ isFindingNextEvaluation } />
      }
    </>
  );
}

EvaluationControls.propTypes = {
  newEvaluationObjectIds: PropTypes.array.isRequired
}

const S = {};
S.RadioGroup = styled(RadioGroup)`
  font-weight: 600;
  font-size: 18px;
`;
S.Callout = styled(Callout)`
  margin-top: 10px;
`;
S.Button = styled(Button)`
  margin-top: 10px;
`;
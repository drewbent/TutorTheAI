import PropTypes from 'prop-types'
import React from 'react'
import { ResponsiveBar } from '@nivo/bar';
import styled from 'styled-components';
import {
  MIN_SCORES_TO_DISPLAY, LABELS_MAPPED_TO_SCORES
} from '../constants/scores';
import { Tooltip, Position } from '@blueprintjs/core';
import _ from 'lodash';

export default function ScoreDisplay(props) {
  const { scores } = props;

  const question1 = Object.keys(LABELS_MAPPED_TO_SCORES).sort().map((key) => ({
    'rating': LABELS_MAPPED_TO_SCORES[key],
    'count': 0
  }));
  const question2 = _.cloneDeep(question1);
  
  scores.forEach(score => {
    question1[score.question1]['count'] += 1;
    question2[score.question2]['count'] += 1;
  });

  const isEnoughScores = (scores.length >= MIN_SCORES_TO_DISPLAY);
  if (!isEnoughScores) {
    return <></>;
  }

  function TooltipHeader(props) {
    return (
      <Tooltip
        content={
          <p>Feedback from other humans reviewing the tutoring session</p>
        }
        position={ Position.TOP }
        usePortal={ false }
      >
        <S.Heading>
          { props.header }
        </S.Heading>
      </Tooltip>
    );
  }

  return (
    <S.Container>
      <TooltipHeader
        header="Did the human understand the concept they were teaching?" />
      { MyResponsiveBar(question1) }
      <TooltipHeader
        header="Did the AI end up learning the concept?" />
      { MyResponsiveBar(question2) }
    </S.Container>
  );
}

const MyResponsiveBar = (data) => (
  <S.Chart>
    <ResponsiveBar
      data={data}
      keys={[ 'count' ]}
      indexBy="rating"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      colors={{ scheme: 'nivo' }}
      defs={[
          {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: '#38bcb2',
              size: 4,
              padding: 1,
              stagger: true
          },
          {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: '#eed312',
              rotation: -45,
              lineWidth: 6,
              spacing: 10
          }
      ]}
      borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      axisTop={null}
      axisRight={null}
      axisLeft={null}
      enableGridY={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  </S.Chart>
);

ScoreDisplay.propTypes = {
  scores: PropTypes.arrayOf(PropTypes.object)
}

const S = {};
S.Container = styled.div`

`;
S.Heading = styled.h2`

`;
S.Spacer = styled.div`
  height: 40px;
  flex: 0 0 auto;
`;
S.Chart = styled.div`
  height: 200px;
`;
import PropTypes from 'prop-types'
import React from 'react'
import { ResponsiveBar } from '@nivo/bar';
import styled from 'styled-components';

export default function DisplayScores(props) {
  const { scores } = props;

  const question1 = [
    {
      'rating': 'Not really',
      'count': 0
    },
    {
      'rating': 'Somewhat',
      'count': 0
    },
    {
      'rating': 'Quite well',
      'count': 0
    },
    {
      'rating': 'Mastered',
      'count': 0
    }
  ];

  const question2 = [
    {
      'rating': 'Not really',
      'count': 0
    },
    {
      'rating': 'Somewhat',
      'count': 0
    },
    {
      'rating': 'Quite well',
      'count': 0
    },
    {
      'rating': 'Mastered',
      'count': 0
    }
  ];
  
  scores.forEach(score => {
    question1[score.question1]['count'] += 1;
    question2[score.question2]['count'] += 1;
  });

  console.log(scores);
  console.log(question1);
  console.log(question2);
  console.log('');

  return (
    <S.Container>
      <S.Heading>Did the human understand the concept they were teaching?</S.Heading>
      { MyResponsiveBar(question1) }
      <S.Heading>Did the AI end up learning the concept?</S.Heading>
      { MyResponsiveBar(question2) }
    </S.Container>
  );
}

const MyResponsiveBar = (data) => (
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
);

DisplayScores.propTypes = {
  scores: PropTypes.arrayOf(PropTypes.object)
}

const S = {};
S.Container = styled.div`
  height: 200px;
`;
S.Heading = styled.h2`

`;
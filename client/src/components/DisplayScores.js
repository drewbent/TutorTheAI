import PropTypes from 'prop-types'
import React from 'react'

export default function DisplayScores(props) {
  const { scores } = props;

  return (
    <div>
      {scores.map(score => (
        <p key={ score._id }>
          { score.question1 }
          { score.question2 }
        </p>
      ))}
    </div>
  );
}

DisplayScores.propTypes = {
  scores: PropTypes.arrayOf(PropTypes.object)
}
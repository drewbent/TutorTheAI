import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../images/logo.png';
import { Icon, Dialog } from '@blueprintjs/core';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

export default function Header(props) {
  const { noLogo } = props;

  const [isInfoOpen, setIsInfoOpen] = useState(false);

  function handleInfoClick() {
    setIsInfoOpen(true);
  }

  return (
    <>
      <S.Header>
        {!noLogo &&
          <>
            <S.Link to='/'><img src={ logo } alt="Logo" height={ 35 } /></S.Link>
            <S.Link to='/'><h3>Tutor the AI</h3></S.Link>
          </>
        }
        
        <S.InfoIcon icon="info-sign" iconSize={ 20 } onClick={ handleInfoClick } />
      </S.Header>

      <Dialog
          icon="info-sign"
          isOpen={ isInfoOpen }
          autoFocus="true"
          canEscapeKeyClose="true"
          canOutsideClickClose="true"
          enforceFocus="true"
          usePort="true"
          onClose={ () => setIsInfoOpen(false) }
          title="About">
        <S.DialogBody>
          <p>
            "If you want to master something, teach it." —Richard Feynman
          </p>

          <p>
            But who then is to be the learner? That's where the AI comes in.
          </p>

          <p>
          TutorTheAI provides you with the opportunity to practice the <a href="https://fs.blog/2012/04/feynman-technique/" target="_blank" rel="noopener noreferrer">Feynman Learning Technique</a> through tutoring an AI.
          </p>

          <ul>
            <li>Choose something to learn</li>
            <li>Try teaching it to a 6th grader</li>
            <li>Identify your gaps in understanding</li>
            <li>Fill in those gaps</li>
          </ul>

          <p>
            Brain icon made by <a href="https://www.flaticon.com/free-icon/brain_749854" title="Skyclick" target="_blank" rel="noopener noreferrer">Skyclick</a> from <a href="https://www.flaticon.com/" title="Flaticon" target="_blank" rel="noopener noreferrer">www.flaticon.com</a>
          </p>
        </S.DialogBody>
      </Dialog>
    </>
  );
}

Header.propTypes = {
  noLogo: PropTypes.bool
}

const S = {};
S.Link = styled(Link)`
  &, &:hover, &:visited, &:active, &:focus {
    color: inherit;
    text-decoration: inherit;
  }
`;
S.Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 0 20px;
  height: 50px;

  *:not(:last-child) {
    margin-right: 5px;
  }
`;
S.InfoIcon = styled(Icon)`
  margin-left: auto;
  cursor: pointer;
`;
S.DialogBody = styled.div`
  padding: 10px;
  font-size: 16px;
`;
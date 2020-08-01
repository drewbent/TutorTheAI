import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../images/logo.png';
import { Icon, Dialog } from '@blueprintjs/core';
import { PropTypes } from 'prop-types';

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
            <img src={ logo } alt="Logo" height={ 35 } />
            <h3>Tutor the AI</h3>
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
          TutorTheAI provides you with the opportunity to practice the <a href="https://fs.blog/2012/04/feynman-technique/">Feynman Learning Technique</a> through tutoring an AI.
          </p>

          <ul>
            <li>Choose something to learn</li>
            <li>Try teaching it to a 6th grader</li>
            <li>Identify your gaps in understanding</li>
            <li>Fill in those gaps</li>
          </ul>
        </S.DialogBody>
      </Dialog>
    </>
  );
}

Header.propTypes = {
  noLogo: PropTypes.bool
}

const S = {};
S.Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 5px 10px;

  * {
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
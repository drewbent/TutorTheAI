import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../images/logo.png';
import { Icon, Dialog } from '@blueprintjs/core';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { GA } from '../services/GA';

export default function Header(props) {
  const { noLogo } = props;

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  function handleInfoClick() {
    setIsInfoOpen(true);

    GA.event({
      category: 'Meta',
      action: 'Open info modal'
    });
  }

  function handleEmail() {
    setIsEmailOpen(true);

    GA.event({
      category: 'Meta',
      action: 'Open contact modal'
    });
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
        
        <S.EmailIcon icon="envelope" iconSize={ 20 } onClick={ handleEmail } />
        <S.InfoIcon icon="info-sign" iconSize={ 20 } onClick={ handleInfoClick } />
      </S.Header>

      <MyDialog
          icon="envelope"
          isOpen={ isEmailOpen }
          onClose={ () => setIsEmailOpen(false) }
          title="Contact">
        <S.DialogBody>
          Questions or feedback? <a href="https://forms.gle/fYMCDhDCQ2wEM2yn8" target="_blank" rel="noopener noreferrer">Submit here</a>.
          <br />
          You can also email <a href="mailto:dbent@stanford.edu">Drew</a>.
        </S.DialogBody>
      </MyDialog>

      <MyDialog
          icon="info-sign"
          isOpen={ isInfoOpen }
          onClose={ () => setIsInfoOpen(false) }
          title="About">
        <S.DialogBody>
          <S.Quote>
            <i>"If you want to master something, teach it."</i>
          </S.Quote>

          <p>
            But who then is to be the learner? That's where the AI comes in.
          </p>

          <p>
          <b>Tutor the AI</b> provides you with the opportunity to practice the <a href="https://fs.blog/2012/04/feynman-technique/" target="_blank" rel="noopener noreferrer">Feynman Learning Technique</a> through tutoring an AI.
          </p>

          <ol>
            <li>Choose something to learn</li>
            <li>Try teaching it to a 6th grader</li>
            <li>Identify your gaps in understanding</li>
            <li>Fill in those gaps</li>
          </ol>

          <S.Warning>
            Note: OpenAI is an experimental AI and, despite precautions, may still generate hateful or inaccurate messages. We take this seriously and encourage you to report any such cases. 
          </S.Warning>

          <S.Credits>
            Website made by <a href="https://www.linkedin.com/in/drewbent/" target="_blank" rel="noopener noreferrer">Drew Bent</a>.<br />
            AI made by <a href="https://openai.com/blog/openai-api/" target="_blank" rel="noopener noreferrer">OpenAI</a>.<br />
            Brain icon made by <a href="https://www.flaticon.com/free-icon/brain_749854" title="Skyclick" target="_blank" rel="noopener noreferrer">Skyclick</a> from <a href="https://www.flaticon.com/" title="Flaticon" target="_blank" rel="noopener noreferrer">www.flaticon.com</a>.
          </S.Credits>

        </S.DialogBody>
      </MyDialog>
    </>
  );
}

function MyDialog(props) {
  const { children, ...rest } = props;

  return (
    <Dialog
        autoFocus="true"
        canEscapeKeyClose="true"
        canOutsideClickClose="true"
        enforceFocus="true"
        usePort="true"
        {...rest}>

      { children }

    </Dialog>
  )
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
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 0 20px;
  height: 50px;

  *:not(:last-child) {
    margin-right: 5px;
  }
`;
S.EmailIcon = styled(Icon)`
  margin-left: auto;
  cursor: pointer;
`;
S.InfoIcon = styled(Icon)`
  margin-left: 5px;
  cursor: pointer;
`;
S.DialogBody = styled.div`
  padding: 30px;
  font-size: 16px;
`;
S.Quote = styled.p`
  padding-bottom: 20px;
`;
S.Warning = styled.p`
  border-top: 1px solid #8A9BA8;
  padding-top: 10px;
  margin-top: 40px;
  color: #A67908;
`;
S.Credits = styled.p`
  color: #8A9BA8;

  a {
    color: #5C7080;
  }
`;
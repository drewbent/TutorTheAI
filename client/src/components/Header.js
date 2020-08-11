import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../images/logo.png';
import { Icon, Dialog, Tooltip, Position } from '@blueprintjs/core';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { GA } from '../services/GA';

export default function Header(props) {
  const { noLogo } = props;

  const [isInfoOpen, setIsInfoOpen] = useState(false);

  function handleInfoClick() {
    setIsInfoOpen(true);

    GA.event({
      category: 'Meta',
      action: 'Open info modal'
    });
  }

  function handleSignup() {
    window.open('https://forms.gle/nsNDcKezwEU476s96');
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

        <S.SignupTooltip
          content={
            <p>Get notified when new concepts are added!</p>
          }
          position={ Position.LEFT }
          usePortal={ false }
        >
          <S.SignupIcon
            icon="star" iconSize={ 20 } intent="primary"
            onClick={ handleSignup } />
        </S.SignupTooltip>

        <S.InfoIcon
          icon="info-sign" iconSize={ 20 } onClick={ handleInfoClick } />
      </S.Header>

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
            <b>Tutor the AI</b> lets you review and assess your understanding of foundational concepts through tutoring an AI.
          </p>

          <p>
            Here's the secret: it's not actually about teaching the AI. It's about testing your own knowledge. The AI will ask follow-up questions. See if you can answer them!
          </p>

          <S.Warning>
            Note: OpenAI is an experimental AI and, despite precautions, may still generate hateful or inaccurate messages. We take this seriously and encourage you to report any such cases. 
          </S.Warning>

          <S.Credits>
            Website made by <a href="https://www.linkedin.com/in/drewbent/" target="_blank" rel="noopener noreferrer">Drew Bent</a> (<a href="mailto:dbent@stanford.edu">email</a>).<br />
            AI made by <a href="https://openai.com/blog/openai-api/" target="_blank" rel="noopener noreferrer">OpenAI</a>.<br />
            Brain icon by <a href="https://www.flaticon.com/free-icon/brain_749854" title="Skyclick" target="_blank" rel="noopener noreferrer">Skyclick</a> from <a href="https://www.flaticon.com/" title="Flaticon" target="_blank" rel="noopener noreferrer">www.flaticon.com</a>.
          </S.Credits>

          <S.Contact>
            Questions or feedback? <a href="https://forms.gle/fYMCDhDCQ2wEM2yn8" target="_blank" rel="noopener noreferrer">Submit here</a>.
            <br />
            Want updates? <a href="https://forms.gle/nsNDcKezwEU476s96" target="_blank" rel="noopener noreferrer">Click here</a>.
          </S.Contact>

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
`;
S.Icon = styled(Icon)`
  cursor: pointer;
`;
S.InfoIcon = styled(S.Icon)`
  margin-left: 10px;
`;
S.SignupTooltip = styled(Tooltip)`
  margin-left: auto;
`;
S.SignupIcon = styled(S.Icon)`

`;
S.DialogBody = styled.div`
  padding: 30px 30px 0 30px;
  font-size: 16px;
`;
S.Quote = styled.p`
  padding-bottom: 20px;
`;
S.Warning = styled.p`
  border-top: 1px solid #8A9BA8;
  padding-top: 10px;
  margin-top: 30px;
  color: #A67908;
`;
S.Credits = styled.p`
  color: #8A9BA8;

  a {
    color: #5C7080;
  }
`;
S.Contact = styled.p`
  border-top: 1px solid #8A9BA8;
  padding-top: 10px;
  margin-top: 30px;

  color: #8A9BA8;

  a {
    color: #5C7080;
  }
`;
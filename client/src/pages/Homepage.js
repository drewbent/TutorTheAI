import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import ConceptPicker from '../components/ConceptPicker';
import logo from '../images/logo.png';
import Header from '../components/Header';

export default function Homepage(props) {
  const history = useHistory();

  return (
    <>
      <Header noLogo={ true } />

      <S.SpacerTop />
      <S.Body>
        <img src={ logo } alt="Logo" width={ 100 } />
        <h1>Tutor the AI</h1>
        
        <ConceptPicker
          onChosen={
            (concept) => history.push('/tutoring', { concept })
          } />

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

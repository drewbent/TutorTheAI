import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import ConceptPicker from '../components/ConceptPicker';
import logo from '../images/logo.png';

export default function Homepage(props) {
  const history = useHistory();

  return (
    <>
      <S.BodyContainer>
        <S.SpacerTop />
        <S.Body>
          <img src={ logo } alt="Logo" width={ 100 } />
          <h1>Teach the AI</h1>
          
          <ConceptPicker
            onChosen={
              (concept) => history.push('/tutoring', { concept })
            } />

        </S.Body>
        <S.SpacerBottom />
      </S.BodyContainer>
    </>
  );
}

const S = {};
S.BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  justify-content: flex-start;
  align-items: center;
`;
S.SpacerTop = styled.div`
  flex: 0 0 auto;
  height: 50px;
`;
S.SpacerBottom = styled.div`
  flex: 0 0 auto;
  height: 200px;
`;
S.Body = styled.div`
  flex: 1 1 auto;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

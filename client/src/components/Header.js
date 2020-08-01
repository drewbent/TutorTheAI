import React from 'react';
import styled from 'styled-components';
import logo from '../images/logo.png';

export default function Header(props) {
  return (
    <S.Header>
      <img src={ logo } alt="Logo" height={ 35 } />
      <h3>Teach the AI</h3>
    </S.Header>
  );
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
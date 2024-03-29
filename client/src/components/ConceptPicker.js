import { Button, Menu, Popover, Position } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';
import { CONCEPTS_METADATA } from '../constants/concepts';
import styled from 'styled-components';
import { GA } from '../services/GA';

export default function ConceptPicker(props) {
  const { onChosen } = props;
  
  function handleMenuItemClick(concept) {
    onChosen(concept);

    GA.event({
      category: 'Conversation',
      action: 'Choose concept',
      label: concept.name
    });
  }

  function handleRequestConcept() {
    window.open('https://forms.gle/dDDcMnXqxCmdBfVp8');
  }
  
  return (
    <Popover
      content={
        <Menu>
          
          {CONCEPTS_METADATA.map((concept, i) => (
            concept.sectionTitle
              ? <Menu.Divider
                  title={ concept.sectionTitle }
                  key={ i } />
              : <Menu.Item
                  text={ concept.displayName }
                  onClick={ () => handleMenuItemClick(concept) }
                  key={ i } />
          ))}

          <Menu.Divider
            title="Coming soon" />
          <Menu.Item
            text="Request a concept!"
            intent="success"
            onClick={ () => handleRequestConcept() } />
        </Menu>
      }
      position={ Position.RIGHT }>
      
      <S.Button
        text="Choose a concept"
        large="true"
        rightIcon="caret-down"
        intent="primary"
        width={ props.buttonWidth } />

    </Popover>
  )
}

ConceptPicker.propTypes = {
  onChosen: PropTypes.func,
  buttonWidth: PropTypes.number
}

const S = {};
S.Button = styled(Button)`
  width: ${props => props.width}px;
`;
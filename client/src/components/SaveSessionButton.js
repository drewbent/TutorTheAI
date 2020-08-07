import { Button, Position, Tooltip, Checkbox } from '@blueprintjs/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { API_URL } from '../constants/axios';
import { AppToaster } from './AppToaster';
import styled from 'styled-components';
import { GA } from '../services/GA';

const axiosAPI = axios.create({
  baseURL: API_URL
});

export default function SaveSessionButton(props) {
  const { dataToSave } = props;

  const history = useHistory();

  const [isSaving, setIsSaving ] = useState(false);
  const [isSharingPublicly, setIsSharingPublicly] = useState(true);

  async function handleSaveClicked() {
    // TODO(drew): Error handling?
    setIsSaving(true);
    const resp = await axiosAPI.post('/save', {
      ...dataToSave,
      isSharingPublicly
    });
    setIsSaving(false);
    
    const id = resp && resp.data && resp.data.id;
    history.push(`/conversation/${id}`);

    AppToaster.show({
      message: 'You can now share the current URL with others!',
      intent: 'success'
    });

    GA.event({
      category: 'Conversation',
      action: 'Save conversation'
    });
  }

  return (
    <>
      <Tooltip
        content={
          <span>
            A permalink you can share with others
          </span>
        }
        position={ Position.RIGHT }
        usePortal={ false }>

        <Button
          onClick={ handleSaveClicked }
          large={ true }
          icon={ 'saved' }
          intent={ 'success' }
          loading={ isSaving }>

          Save tutoring session

        </Button>

      </Tooltip>

      <S.CheckboxTooltip
        content={
          <>
            <p>
              Other humans who go to the website will be asked to review your tutoring session and provide feedback on the effectiveness of your tutoring.
            </p>
            <p>
              When enough reviews come in, they will be shared with you at the bottom of this page.
            </p>
          </>
        }
        position={ Position.BOTTOM }
        usePortal={ false }>

        <Checkbox
          checked={ isSharingPublicly }
          label="Include in review queue"
          large={ true }
          onChange={ () => {
            setIsSharingPublicly(!isSharingPublicly);
          }} />

      </S.CheckboxTooltip>
    </>
  );
}

SaveSessionButton.propTypes = {
  dataToSave: PropTypes.shape({
    messageList: PropTypes.array,
    concept: PropTypes.object,
    time: PropTypes.string
  })
}

const S = {};
S.CheckboxTooltip = styled(Tooltip)`
  display: block;
  margin-top: 10px;
`;
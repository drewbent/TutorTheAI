import { Button, Position, Tooltip } from '@blueprintjs/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { API_URL } from '../constants/axios';
import { AppToaster } from './AppToaster';

const axiosAPI = axios.create({
  baseURL: API_URL
});

export default function SaveSessionButton(props) {
  const { dataToSave } = props;

  const history = useHistory();

  const [isSaving, setIsSaving ] = useState(false);

  async function handleSaveClicked() {
    // TODO(drew): Error handling?
    setIsSaving(true);
    const resp = await axiosAPI.post('/save', dataToSave);
    setIsSaving(false);
    
    const id = resp && resp.data && resp.data.id;
    history.push(`/conversation/${id}`);

    AppToaster.show({
      message: 'You can now share the current URL with others!',
      intent: 'success'
    });
  }

  return (
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
  );
}

SaveSessionButton.propTypes = {
  dataToSave: PropTypes.shape({
    messageList: PropTypes.array,
    concept: PropTypes.object,
    time: PropTypes.string
  })
}
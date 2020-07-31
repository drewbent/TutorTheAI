import React from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/';

const App = () => {

  const axiosAPI = axios.create({
    baseURL: API_URL
  });

  async function handleClick() {
    const resp = await axiosAPI.post('/chat', {})

    console.log(resp);
  }

  return (
    <div>
      Hello, world
      <button onClick={ handleClick }>Click here</button>
    </div>
  );
}

export default App;

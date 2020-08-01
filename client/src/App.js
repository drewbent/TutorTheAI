import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ActiveConversation from './pages/ActiveConversation';
import Homepage from './pages/Homepage';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={ Homepage } />
        <Route path="/tutoring" exact component={ ActiveConversation } />
      </Switch>
    </Router>
  )
  
}

export default App;
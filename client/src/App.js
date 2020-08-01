import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ActiveConversation from './pages/ActiveConversation';
import Homepage from './pages/Homepage';
import SavedConversation from './pages/SavedConversation';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={ Homepage } />
        <Route path="/tutoring" exact component={ ActiveConversation } />
        <Route path="/conversation" exact component={ SavedConversation } />
      </Switch>
    </Router>
  )
  
}

export default App;
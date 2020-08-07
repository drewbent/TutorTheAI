import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import ActiveConversation from './pages/ActiveConversation';
import Homepage from './pages/Homepage';
import SavedConversation from './pages/SavedConversation';
import { GA } from './services/GA';

const App = () => {
  useEffect(() => {
    GA.init();
  }, []);

  const location = useLocation();

  useEffect(() => {
    GA.pageView(location.pathname)
  }, [location]);

  return (
    <Switch>
      <Route path="/" exact component={ Homepage } />
      <Route path="/tutoring" component={ ActiveConversation } />
      <Route path="/conversation/:id?" component={ SavedConversation } />
    </Switch>
  )
  
}

export default App;
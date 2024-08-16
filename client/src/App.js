import React from 'react';
import {Route, Routes} from 'react-router-dom';

import Main from './pages/Main';

const  App = () => {
  return (
    <div className="App">
      <Routes>
        <Route />
        <Route path=""/>  
      </Routes>
      <Main />
    </div>
  );
}

export default App;

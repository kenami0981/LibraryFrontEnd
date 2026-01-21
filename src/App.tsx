import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div>
      <h1>TEST APP</h1>
      <Outlet />
    </div>
  );
}

export default App;

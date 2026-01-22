import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import LibraryNavbar from './Components/NavBar';

function App() {
  return (
    <div>
      <LibraryNavbar/>
      <Outlet />
    </div>
  );
}

export default App;

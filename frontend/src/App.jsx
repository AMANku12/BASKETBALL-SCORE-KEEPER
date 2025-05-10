import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Auth from "./Components/Auth";
import Home from './Components/Home';
import CreateRoom from './Components/CreateRoom';
import MatchRoom from './Components/MatchRoom';
import JoinRoom from './Components/JoinRoom';
import socket from './socket';

function App() {
  useEffect(()=>{
    socket.connect();          // connect once globally
    return ()=> socket.disconnect();
  },[])

  return (
    <div className="app">
      <div className="app-background"></div>
      <Router>
        <Header />
        <div className="content">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/createroom' element={<CreateRoom />} />
            <Route path='/matchroom' element={<MatchRoom />} />
            <Route path='/joinroom' element={<JoinRoom />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

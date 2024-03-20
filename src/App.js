import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home';
import SearchAndBorrow from './components/SearchAndBorrow';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import { useState } from 'react';


function App() {
  const [userInfo, setUserInfo] = useState({})
  const [books, setBooks] = useState({})
  const [currentState, setCurrentState] = useState('Login');


  return (
    <>
      <Navbar setUserInfo={setUserInfo} userInfo={userInfo} setCurrentState={setCurrentState}/>
      {currentState === 'Home' && <Home setCurrentState={setCurrentState} userInfo={userInfo}/>}
      {currentState === 'SearchAndBorrow' && <SearchAndBorrow userInfo={userInfo} books={books} setBooks={setBooks} setCurrentState={setCurrentState}/>}
      {currentState === 'Profile' && <Profile userInfo={userInfo} setCurrentState={setCurrentState}/>}
      {currentState === 'Login' && <Login setUserInfo={setUserInfo} setCurrentState={setCurrentState}/>}
      {currentState === 'Register' && <Register setUserInfo={setUserInfo} setCurrentState={setCurrentState}/>}
    </>
  );
}

export default App;

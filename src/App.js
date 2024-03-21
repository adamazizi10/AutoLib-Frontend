import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home';
import SearchAndBorrow from './components/SearchAndBorrow';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import { useState } from 'react';
import Footer from './components/Footer';


function App() {
  const [books, setBooks] = useState({})
  const intialState = () => localStorage.getItem('username') && localStorage.getItem('username').length > 0 ? 'Home' : 'Login'
  const [currentState, setCurrentState] = useState(intialState());

  const setUserInfo = (userData) => {
    console.log('The userdata username: ', userData.username)
    localStorage.setItem('username',userData.username)
    localStorage.setItem('user_id',userData.user_id)
  } 

  const userInfo = {
    username: localStorage.getItem('username'),
    user_id: localStorage.getItem('user_id')
  }
  return (
    <>
      <Navbar setUserInfo={setUserInfo} userInfo={userInfo} setCurrentState={setCurrentState} />
      {userInfo && userInfo.username && userInfo.username.length > 0 ? (
        <>
          {currentState === 'Home' && <Home setCurrentState={setCurrentState} userInfo={userInfo} />}
          {currentState === 'SearchAndBorrow' && <SearchAndBorrow userInfo={userInfo} books={books} setBooks={setBooks} setCurrentState={setCurrentState} />}
          {currentState === 'Profile' && <Profile userInfo={userInfo} setCurrentState={setCurrentState} />}
        </>
      ) : (
        <>
          {currentState === 'Login' && <Login setUserInfo={setUserInfo} setCurrentState={setCurrentState} />}
          {currentState === 'Register' && <Register setUserInfo={setUserInfo} setCurrentState={setCurrentState} />}
        </>
      )}
       <Footer currentState={currentState} setCurrentState={setCurrentState}/>
    </>
  );

}

export default App;

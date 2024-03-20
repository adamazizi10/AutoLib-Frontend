import React from 'react';
import './Navbar.css';

const Navbar = ({ userInfo, setUserInfo, setCurrentState }) => {
    return (
        <div className="navbar">
            {userInfo && userInfo.user_id ? (
                <>
                    <div className={`navbar-item navbara-and-dropdown-items`} onClick={() => setCurrentState('Home')}>
                        Home
                    </div>
                    <div className={`navbar-item navbara-and-dropdown-items`} onClick={() => setCurrentState('SearchAndBorrow')}>
                        Search/Borrow
                    </div>
                    <div className={`navbar-item navbara-and-dropdown-items`} onClick={() => setCurrentState('Profile')}>
                        Profile
                    </div>
                    <div className={`navbar-item navbara-and-dropdown-items`} onClick={() => { setUserInfo({}); setCurrentState('Login')}} >
                        Logout
                    </div>
                </>
            ) : (
                <>
                    <div className={`navbar-item navbara-and-dropdown-items`} onClick={() => setCurrentState('Login')} >
                        Login
                    </div>
                    <div className={`navbar-item navbara-and-dropdown-items`} onClick={() => setCurrentState('Register')}>
                        Register
                    </div>
                </>
            )}
        </div>
    );
};

export default Navbar;
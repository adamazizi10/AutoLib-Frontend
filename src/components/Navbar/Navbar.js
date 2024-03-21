import React from 'react';
import './Navbar.css';

const Navbar = ({ userInfo, setCurrentState }) => {
    return (
        <div className="navbar">
            {userInfo && userInfo.username && userInfo.username.length > 0 &&
                <>
                    <div className={`navbar-item navbara-and-dropdown-items`} onClick={() => setCurrentState('Home')}>
                        Home
                    </div>
                    <div className={`navbar-item navbara-and-dropdown-items`} onClick={() => setCurrentState('SearchAndBorrow')}>
                        Books
                    </div>
                    <div className={`navbar-item navbara-and-dropdown-items`} onClick={() => setCurrentState('Profile')}>
                        Profile
                    </div>
                    <div className={`navbar-item navbara-and-dropdown-items`} onClick={() => {
                        localStorage.removeItem('username');
                        localStorage.removeItem('user_id');
                        setCurrentState('Login')
                    }} >
                        Logout
                    </div>

                    <div style={{ color: 'white', right: '0px', position: 'absolute' }}>
                        <b><u>Signed In as:</u></b><span style={{ color: 'lime' }}>&nbsp;&nbsp;&nbsp;{userInfo.username}&nbsp;&nbsp;&nbsp;</span>
                    </div>
                </>
            }

        </div>
    );
};

export default Navbar;





{/* // ) : (
            //     <>
            //         <div className={`navbar-item navbara-and-dropdown-items`} onClick={() => setCurrentState('Login')} >
            //             Login
            //         </div>
            //         <div className={`navbar-item navbara-and-dropdown-items`} onClick={() => setCurrentState('Register')}>
            //             Register
            //         </div>
            //     </>
            // )} */}
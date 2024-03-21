import React from 'react';

const Footer = ({ setCurrentState, currentState }) => {
    return (
        <footer className="footer mt-auto py-3">
            <div className="container">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    {currentState !== 'Login' && currentState !== 'Register' &&
                        <>
                            <li className="nav-item"><div onClick={() => setCurrentState('Home')} className="btn hover-pointer nav-link px-2 text-body-secondary">Home</div></li>
                            <li className="nav-item"><div onClick={() => setCurrentState('SearchAndBorrow')} className="btn hover-pointer nav-link px-2 text-body-secondary">Books</div></li>
                            <li className="nav-item"><div onClick={() => setCurrentState('Profile')} className="btn hover-pointer nav-link px-2 text-body-secondary">Profile</div></li>
                            <li className="nav-item"><div onClick={() => { localStorage.removeItem('username'); localStorage.removeItem('user_id'); setCurrentState('Login') }} className="btn hover-pointer nav-link px-2 text-body-secondary">Logout</div></li>
                        </>
                    }
                </ul>
                <p className="text-center text-body-secondary">&copy; 2024 Central Library, Inc</p>
            </div>
        </footer>
    );
}

export default Footer;



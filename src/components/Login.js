import React, { useState } from 'react';
import {REACT_APP_LOGIN} from './Routes'

const Login = ({ setUserInfo, setCurrentState }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    const response = await fetch(`${REACT_APP_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();
    if (response.ok) {
      setUserInfo(data); // Set user info
      setCurrentState('Home'); // Redirect to home
      console.log('page login return data: ', data)
    } else {
      setError(data.error) // Display error message
    }
  };


  return (
    <div className='mt-5'>
      <section className="p-3 p-md-4 p-xl-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-xxl-11">
              <div className="card border-light-subtle shadow-lg">
                <div className="row g-0">
                  <div className="col-12 col-md-6">
                    <img className="img-fluid rounded-start w-100 h-100 object-fit-cover" loading="lazy" src={`${process.env.PUBLIC_URL}/HomePics/HomePic3.jpg`} alt="Welcome back you've been missed!" />
                  </div>
                  <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                    <div className="col-12 col-lg-11 col-xl-10">
                      <div className="card-body p-3 p-md-4 p-xl-5">
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-5">
                              <h4 className="text-center">Welcome back!</h4>
                            </div>
                          </div>
                        </div>
                        <form onSubmit={handleLogin}>
                          <div className="row gy-3 overflow-hidden">
                            <div className="col-12">
                              <div className="form-floating mb-3">
                                <input
                                  type="username"
                                  className="form-control"
                                  name="username"
                                  id="username"
                                  placeholder="username"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                />
                                <label htmlFor="username" className="form-label">Username</label>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-floating mb-3">
                                <input
                                  type="password"
                                  className="form-control"
                                  name="password"
                                  id="password"
                                  placeholder="Password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                                <label htmlFor="password" className="form-label">Password</label>
                              </div>
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <div className="col-12">
                              <div className="d-grid">
                                <button className="btn btn-dark btn-lg" type="submit">Log in now</button>
                              </div>
                            </div>
                          </div>
                        </form>
                        <div className="row">
                          <div className="col-12">
                            <div className="d-flex justify-content-center mt-4">
                              <div className="link-secondary text-decoration-none btn px-1" onClick={() => setCurrentState("Register")}>Don't have an account? </div>
                              <div className="text-primary btn hover-pointer px-0" onClick={() => setCurrentState("Register")}>Register Here</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import {REACT_APP_REGISTER} from './Routes'

const Register = ({ setUserInfo, setCurrentState }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch(`${REACT_APP_REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        confirm_password: confirmPassword
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.message); // Success message
      console.log('the data i want rn: ', data); // Success message
      setUserInfo(data);
      setCurrentState('Home');
      // Handle success, redirect to home or perform other actions
    } else {
      setError(data.error); // Display error message
    }
  };

  return (
    <div>
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
                          <form onSubmit={(e) => {
                            e.preventDefault(); // Prevent default form submission behavior
                            handleRegister(); // Call your registration function
                          }}>
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
                              <div className="col-12">
                                <div className="form-floating mb-3">
                                  <input
                                    type="password"
                                    className="form-control"
                                    name="ConfirmPassword"
                                    id="ConfirmPassword"
                                    placeholder="ConfirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                   />
                                  <label htmlFor="password" className="form-label">Password</label>
                                </div>
                              </div>
                              {error && <p style={{ color: 'red' }}>{error}</p>}
                              <div className="col-12">
                                <div className="d-grid">
                                  <button className="btn btn-dark btn-lg">Register</button>
                                </div>
                              </div>
                            </div>
                          </form>
                          <div className="row">
                            <div className="col-12">
                              <div className="d-flex justify-content-center mt-4">
                                <div className="link-secondary text-decoration-none btn px-1" onClick={() => setCurrentState("Login")}>Already have an account?</div>
                                <div className="text-primary btn hover-pointer px-0" onClick={() => setCurrentState("Login")}>Login Here</div>
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
    </div>
  )
}

export default Register;

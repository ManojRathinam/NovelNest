import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData);
      const newUser = response.data;
      if (!newUser) {
        setError("Couldn't register user. Please try again.");
      } else {
        // Navigate to the login page only if the registration is successful
        navigate('/login');
      }
    } catch (err) {
      // Handle the error case here
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };
  

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        {error && <p className="form_error-message">{error}</p>}
        <form className="form register_form" onSubmit={registerUser}>
          <input type="text" placeholder="Full Name" name="name" value={userData.name} onChange={changeInputHandler} autoFocus />
          <input type="text" placeholder="Email" name="email" value={userData.email} onChange={changeInputHandler} />
          <input type="password" placeholder="Password" name="password" value={userData.password} onChange={changeInputHandler} />
          <input type="password" placeholder="Confirm Password" name="password2" value={userData.password2} onChange={changeInputHandler} />
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
        <small>
          Already have an account? <Link to="/login">Sign in</Link>
        </small>
      </div>
    </section>
  );
};
export default Register;
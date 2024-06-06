import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/userContext'

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext); // Changed [setCurrentUser] to { setCurrentUser }
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(null); // Moved setCurrentUser inside useEffect
    navigate('/login');
  }, [setCurrentUser, navigate]);

  return (
    <></>
  )
}

export default Logout;

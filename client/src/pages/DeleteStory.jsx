import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'
import Loader from '../components/Loader';


const DeleteStory = ({postId: id}) => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate(); // Moved inside component body
  const token = currentUser?.token;

  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  
  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]); // Added dependencies to useEffect
  
  const removePost = async () => {
    setIsLoading(true)
    try {
      const response = await axios.delete(`${process.env.REACT_index.s_BASE_URL}/posts/${id}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      if(response.status === 200){
        if(location.pathname === `/myposts/${currentUser.id}`){
          navigate(0)
        }else{
          navigate('/')
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.log("Couldn't delete post.")
    }
  }
  
  if(isLoading){
    return <Loader/>
  }


  return (
    <Link className='btn sm danger' onClick={() => removePost(id)}>Delete</Link>
  )
}

export default DeleteStory
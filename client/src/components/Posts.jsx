import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import PostItem from './PostItem';
import Loader from '../components/Loader';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/categories/${searchTerm}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response)
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`);
        if (response && response.data) {
          setPosts(response.data);
        } else {
          setPosts([]); // Set empty array if response or response.data is undefined
        }
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    }
  
    fetchPosts();
  }, []);
  

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className='posts'>
      <div className="container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
      {posts.length > 0 ? (
        <div className='container posts_container'>
          {posts.map(({ _id, thumbnail, category, title, description, creator, createdAt }) => (
            <PostItem
              key={_id}
              postID={_id}
              thumbnail={thumbnail}
              category={category}
              title={title}
              desc={description} 
              authorID={creator} 
              createdAt={createdAt}
            />
          ))}
        </div>
      ) : (
        <h2 className='center'>No posts Found</h2>
      )}
    </section>
  );
}

export default Posts
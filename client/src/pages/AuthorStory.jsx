import React, { useEffect, useState } from 'react';
import PostItem from '../components/PostItem';
import axios from 'axios';
import Loader from '../components/Loader';
import { useParams } from 'react-router-dom';

const AuthorStory = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
  const { id } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`);
        setPosts(response.data); // Assuming the response.data is an array of posts
        setIsLoading(false); // Set loading state to false when posts are fetched
      } catch (error) {
        console.error('Error fetching posts:', error);
        setIsLoading(false); // Set loading state to false if an error occurs
      }
    };

    fetchPosts();
  }, [id]); // Fetch posts whenever the author id changes

  return (
    <section className='posts'>
      {isLoading ? ( // Show loader while loading
        <Loader />
      ) : (
        <div className='container posts_container'>
          {posts.length > 0 ? (
            posts.map(post => (
              <PostItem
                key={post._id}
                postID={post._id}
                thumbnail={post.thumbnail}
                category={post.category}
                title={post.title}
                desc={post.description}
                authorID={post.author}
              />
            ))
          ) : (
            <h2 className='center'>No posts found for this author</h2>
          )}
        </div>
      )}
    </section>
  );
};

export default AuthorStory;

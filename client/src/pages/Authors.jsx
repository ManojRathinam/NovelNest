import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`);
        setAuthors(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    getAuthors();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors-container">
          {authors.map(({ _id: id, avatar, name, posts }) => (
            <div key={id} className="author-card">
              {/* Corrected the link to navigate to the user's posts */}
              <Link to={`/posts/users/${id}`} className="author-link">
                <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt={`Author ${name}`} className="author-avatar" />
                <div className="author-info">
                  <h4 className="author-name">{name}</h4>
                  <p className="author-posts">{posts} Posts</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <h2 className="center"> No user/author found.</h2>
      )}
    </section>
  );
};

export default Authors;

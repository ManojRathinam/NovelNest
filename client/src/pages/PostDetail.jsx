import React, { useContext, useEffect, useState } from 'react';
import PostAuthor from '../components/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import DeleteStory from './DeleteStory';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [showFullStory, setShowFullStory] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        setError(message);
      }
      setIsLoading(false);
    };

    getPost();
  }, [id]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value));
  };

  const submitComment = async () => {
    try {
      // Make API call to submit comment
      console.log('Comment:', comment);
      setComment(''); // Clear comment box after submission
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const submitRating = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      if (!token) {
        // Handle the case where the token is not available
        console.error('No token available');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the authorization header
        }
      };

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts/${id}/rate`, { rating }, config);
      console.log(response.data); // Handle the response
      setRating(0); // Reset rating after submission
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };


  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="post-detail">
      {error && <p className="error">{error}</p>}
      {post && (
        <div className="container post-detail_container">
          <div className="post-detail_header">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
            {currentUser?.id === post?.creator && (
              <div className="post-detail_buttons">
                <Link to={`/posts/${post._id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeleteStory postId={id} />
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <div className="post-detail_cover">
            <img src={post.thumbnail} alt="" />
          </div>
          <div className="post-detail_summary">
            <h3>Summary:</h3>
            <p>{post.summary}</p>
          </div>
          <div className="post-detail_actions">
            <button className="btn primary" onClick={() => setShowFullStory(!showFullStory)}>
              {showFullStory ? 'Hide Full Story' : 'Read Full Story'}
            </button>
          </div>
          {showFullStory && (
            <div className="post-detail_description">
              <h3>Full Story:</h3>
              {ReactHtmlParser(post.description)}
            </div>
          )}
          <div className="ratings-comments-container">
            <div className="ratings-card">
              <h3>Rate this post:</h3>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star}>
                    <input type="radio" name="rating" value={star} onChange={handleRatingChange} />
                    ★
                  </label>
                ))}
              </div>
              <button className="btn primary" onClick={submitRating}>
                Submit Rating
              </button>
            </div>
            <div className="comments-card">
              <h3>Leave a Comment:</h3>
              <textarea
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                rows="4"
                placeholder="Write your comment here..."
                value={comment}
                onChange={handleCommentChange}
              ></textarea>
              <button className="btn primary" style={{ marginTop: '0.5rem' }} onClick={submitComment}>
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostDetail;

import React from 'react';
import { Link } from 'react-router-dom';
import PostAuthor from './PostAuthor';

const PostItem = ({ postID, category, title, desc, authorID, thumbnail, createdAt, rating }) => {
  const shortDesc = desc.length > 145 ? desc.substr(0, 145) + '....' : desc;
  const postTitle = title.length > 30 ? title.substr(0, 30) + "...." : title;

  const thumbnailUrl = thumbnail ? `${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}` : '';

  return (
    <article className='post-card'>
      <div className='post-card__cover'>
        <img src={thumbnail} alt={title} />
      </div>

      <div className='post-card__content'>
        <Link to={`/posts/${postID}`}>
          <h3>{postTitle}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{ __html: shortDesc }} />
        {rating && (
          <div className="post-card__rating">
            Rating: {rating} {/* Display the rating */}
          </div>
        )}
        <div className="post-card__footer">
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link to={`/posts/categories/${category}`} className='btn category'>{category}</Link>
        </div>
      </div>
    </article>
  );
}

export default PostItem;
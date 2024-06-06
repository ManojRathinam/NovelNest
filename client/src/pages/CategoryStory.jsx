import React, { useEffect, useState } from 'react'
import PostItem from '../components/PostItem'
import axios from 'axios'
import Loader from '../components/Loader'
import { useParams } from 'react-router-dom'


const CategoryStory = () => {
  const[posts,setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const {category} = useParams;

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`)
        setPosts(response?.data)
      } catch (err) {
        console.log(err)
      }
      
      setIsLoading(false)
    }
    fetchPosts();
  }, [category])

  if(isLoading){
    return <Loader />
  }


  return (
    <section className='posts'>
        {posts.length > 0 ? <div className='container posts_conatiner'>
            {posts.map(({ id, thumbnail, category, title, desc, authorID }) => 
            <PostItem key={id} postID={id} thumbnail={thumbnail} category={category} title={title} desc={desc} authorID={authorID} />
        )}
        </div>: <h2 className='center'>No posts Found</h2>}
    </section>
  )
}

export default CategoryStory
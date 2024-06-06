import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <ul className='footer_categories'>
        <li><Link to = "/posts/categories/:Adventure">Adventure</Link></li>
        <li><Link to = "/posts/categories/:Fanfiction">Fiction</Link></li>
        <li><Link to = "/posts/categories/:Horror">Horror</Link></li>
        <li><Link to = "/posts/categories/:Mystery">Mystery</Link></li>
        <li><Link to = "/posts/categories/:Paranomal">Paranomal</Link></li>
        <li><Link to = "/posts/categories/:Science Fiction">ScienceFiction</Link></li>
        <li><Link to = "/posts/categories/:Thriller">Thriller</Link></li>
        <li><Link to = "/posts/categories/:Fantasy">Fantasy</Link></li>
        <li><Link to = "/posts/categories/:Humor">Humor</Link></li>
        <li><Link to = "/posts/categories/:Romance">Romance</Link></li>
        <li><Link to = "/posts/categories/:HistoricalFiction">Historical Fiction</Link></li>
      </ul>
      <div className='footer_copyright'>
        <small>All Rights are Reserved &copy; Copyright, NovelNest</small>
      </div>
    </footer>
  )
}

export default Footer

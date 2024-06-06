import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.css';
import Layout from './components/Layout.jsx';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home.jsx';
import PostDetail from './pages/PostDetail.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Authors from './pages/Authors.jsx';
import CreateStory from './pages/CreateStory.jsx';
import CategoryStory from './pages/CategoryStory.jsx';
import AuthorStory from './pages/AuthorStory.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EditStory from './pages/EditStory.jsx';
import DeleteStory from './pages/DeleteStory.jsx';
import Logout from './pages/Logout.jsx';
import UserProvider from './context/userContext.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <UserProvider>
        <Layout />
      </UserProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'posts/:id', element: <PostDetail /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: 'profile/:id', element: <UserProfile /> },
      { path: 'authors', element: <Authors /> },
      { path: 'create', element: <CreateStory /> },
      { path: 'posts/categories/:category', element: <CategoryStory /> },
      { path: 'posts/users/:id', element: <AuthorStory /> },
      { path: 'myposts/:id', element: <Dashboard /> },
      { path: 'posts/:id/edit', element: <EditStory /> },
      { path: 'posts/:id/delete', element: <DeleteStory /> },
      { path: 'logout', element: <Logout /> },
    ],
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById('root')
);


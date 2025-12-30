import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';
import ReorderIcon from '@mui/icons-material/Reorder';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DashboardIcon from '@mui/icons-material/Dashboard';

function NavBar({ isAuthenticated, user, onLogout }) {
  const [openLinks, setOpenLinks] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        <Link to="/" className="logo-container">
          <MenuBookIcon style={{ fontSize: 40, color: '#bb86fc', marginRight: '10px' }} />
          <span className="logo-text">BookStore</span>
        </Link>
        <div className="hiddenLinks">
          <Link to="/">Home</Link>
          <Link to="/menu">Books</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/books">Manage Books</Link>
            </>
          )}
          {!isAuthenticated ? (
            <Link to="/login">Login</Link>
          ) : (
            <button onClick={handleLogout} className="logout-link">Logout</button>
          )}
        </div>
      </div>
      <div className="rightSide">
        <Link to="/">Home</Link>
        <Link to="/menu">Books</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        
        {isAuthenticated ? (
          <>
            {user && user.role === 'admin' && (
              <>
                <Link to="/dashboard" className="dashboard-link">
                  <DashboardIcon style={{ marginRight: '5px', fontSize: '20px' }} />
                  Dashboard
                </Link>
                <Link to="/books">Manage Books</Link>
              </>
            )}
            <div className="user-info">
              <span className="username">Welcome, {user?.username}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
        
        <button onClick={toggleNavbar} className="menu-toggle">
          <ReorderIcon />
        </button>
      </div>
    </div>
  );
}

export default NavBar;
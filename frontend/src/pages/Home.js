import React from 'react'
import { Link } from "react-router-dom";
import BannerImage from "../assets/home-banner.jpg";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home" style={{ backgroundImage: `url(${BannerImage})` }}>
      <div className="headerContainer">
        <h1> Online Bookstore </h1>
        <p> Discover Your Next Favorite Read</p>
        <div className="home-buttons">
          <Link to="/menu">
            <button> Browse Books </button>
          </Link>
          <Link to="/login" className="admin-btn">
            <button> Admin Dashboard </button>
          </Link>
        </div>
        <div className="home-features">
          <div className="feature">
            <span className="feature-icon">📚</span>
            <span className="feature-text">Wide Selection</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🚚</span>
            <span className="feature-text">Fast Delivery</span>
          </div>
          <div className="feature">
            <span className="feature-icon">⭐</span>
            <span className="feature-text">Best Prices</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
import React from "react";
import AboutBanner from "../assets/about-banner.jpg";
import "../styles/About.css";
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

function About() {
  const stats = [
    { number: "500+", label: "Books Available", icon: "📚" },
    { number: "50+", label: "Authors", icon: "✍️" },
    { number: "15+", label: "Categories", icon: "🏷️" },
    { number: "24/7", label: "Online Access", icon: "🌐" }
  ];

  const features = [
    { 
      icon: <LocalLibraryIcon />, 
      title: "Curated Collection", 
      desc: "Hand-picked books from bestsellers to hidden gems" 
    },
    { 
      icon: <Diversity3Icon />, 
      title: "Community Driven", 
      desc: "Join our book clubs and reading communities" 
    },
    { 
      icon: <AutoStoriesIcon />, 
      title: "Easy Reading", 
      desc: "User-friendly platform for seamless browsing" 
    },
    { 
      icon: <SupportAgentIcon />, 
      title: "Customer Support", 
      desc: "24/7 assistance for all your book needs" 
    }
  ];

  return (
    <div className="about">
      <div className="about-banner" style={{ backgroundImage: `url(${AboutBanner})` }}>
        <div className="banner-overlay">
          <h1>About Our Bookstore</h1>
          <p>Where stories come to life</p>
        </div>
      </div>
      
      <div className="about-container">
        <section className="story-section">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              Founded in 2025, Online Bookstore began as a small passion project 
              and has grown into a premier destination for book lovers worldwide. 
              We believe in the power of stories to transform lives.
            </p>
            <p>
              Our mission is simple: to connect readers with books that inspire, 
              educate, and entertain. From timeless classics to contemporary 
              bestsellers, we curate our collection with care and passion.
            </p>
          </div>
          <div className="story-image">
            <div className="image-placeholder">📖</div>
          </div>
        </section>

        <section className="stats-section">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </section>

        <section className="features-section">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="team-section">
          <h2>Meet Our Team</h2>
          <p className="team-desc">
            Passionate book lovers dedicated to bringing you the best reading experience.
          </p>
          <div className="team-grid">
            {["Founder & CEO", "Head Curator", "Customer Support", "Community Manager"].map((role, index) => (
              <div className="team-card" key={index}>
                <div className="team-avatar">{["👨‍💼", "👩‍🎨", "👨‍💻", "👩‍💼"][index]}</div>
                <h4>Team Member</h4>
                <p>{role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
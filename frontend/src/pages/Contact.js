import React, { useState } from "react";
import ContactBanner from "../assets/contact-banner.jpg";
import "../styles/Contact.css";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

function Contact() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    subject: "", 
    message: "" 
  });
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    { icon: <EmailIcon />, title: "Email", info: "support@bookstore.com", detail: "We reply within 24 hours" },
    { icon: <PhoneIcon />, title: "Phone", info: "+1 (555) 123-4567", detail: "Mon-Fri, 9am-6pm EST" },
    { icon: <LocationOnIcon />, title: "Location", info: "123 Book Street", detail: "Reading City, BK 10001" },
    { icon: <AccessTimeIcon />, title: "Hours", info: "24/7 Online", detail: "Store: 10am-8pm Daily" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="contact-page">
      <div className="contact-banner" style={{ backgroundImage: `url(${ContactBanner})` }}>
        <div className="banner-content">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-info-section">
          <h2>Get in Touch</h2>
          <p className="section-description">
            Have questions about our books? Need assistance with an order? 
            Our team is here to help you with all your book-related needs.
          </p>
          
          <div className="info-cards">
            {contactInfo.map((item, index) => (
              <div className="info-card" key={index}>
                <div className="info-icon">{item.icon}</div>
                <div className="info-content">
                  <h3>{item.title}</h3>
                  <p className="info-main">{item.info}</p>
                  <p className="info-detail">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-form-section">
          <div className="form-header">
            <h2>Send us a Message</h2>
            <p>Fill out the form below and we'll get back to you soon</p>
          </div>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                rows="6"
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">
              <SendIcon /> Send Message
            </button>
            
            {submitted && (
              <div className="success-message">
                Thank you! Your message has been sent successfully.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
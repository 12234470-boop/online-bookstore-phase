import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ComboBox from '../components/ComboBox';

const Add = () => {
  const [book, setBook] = useState({
    title: "",
    authorId: "",
    categoryId: "",
    isbn: "",
    price: "",
    description: "",
    stockQuantity: "",
    publishedDate: "",
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFile = (e) => { 
    setFile(e.target.files[0]);
  }

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setBook(prev => ({ ...prev, categoryId: value }));
  };

  const handleAuthorChange = (value) => {
    setSelectedAuthor(value);
    setBook(prev => ({ ...prev, authorId: value }));
  };

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    
    if (!book.title || !selectedCategory || !book.price) {
      setError("Title, Category, and Price are required");
      return;
    }

    const formdata = new FormData();
    
    formdata.append('title', book.title);
    formdata.append('authorId', book.authorId);
    formdata.append('categoryId', selectedCategory);
    formdata.append('isbn', book.isbn);
    formdata.append('price', book.price);
    formdata.append('description', book.description);
    formdata.append('stockQuantity', book.stockQuantity);
    formdata.append('publishedDate', book.publishedDate);
    if (file) {
      formdata.append('image', file);
    }

    const token = localStorage.getItem('token');

    try {
     const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
await axios.post(`${API_URL}/api/books`, formdata, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate("/books");
    } catch (err) {
      console.log(err);
      setError("Failed to add book. Make sure you're logged in as admin.");
    }
  };

  return (
    <div className="form-container"> 
      <div className="form">
        <h1>Add New Book</h1>

        <input
          type="text"
          placeholder="Book Title"
          name="title"
          onChange={handleChange}
          required
        />
        
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left', color: '#ccc' }}>Author</label>
          <ComboBox 
            type="author"
            onSelectChange={handleAuthorChange}
          />
        </div>

        <div style={{ width: '100%', maxWidth: '300px' }}>
          <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left', color: '#ccc' }}>Category</label>
          <ComboBox 
            onSelectChange={handleCategoryChange}
          />
        </div>

        <input
          type="text"
          placeholder="ISBN"
          name="isbn"
          onChange={handleChange}
        />
        
        <input
          type="number"
          placeholder="Price ($)"
          name="price"
          step="0.01"
          onChange={handleChange}
          required
        />
        
        <input
          type="number"
          placeholder="Stock Quantity"
          name="stockQuantity"
          onChange={handleChange}
        />
        
        <input
          type="date"
          placeholder="Published Date"
          name="publishedDate"
          onChange={handleChange}
        />
        
        <textarea
          placeholder="Book Description"
          name="description"
          onChange={handleChange}
          rows="4"
        />
        
        <input
          type="file"
          placeholder="Book Cover Image"
          name="image"
          onChange={handleFile}
          accept="image/*"
        />
        
        <button onClick={handleClick}>Add Book</button>
        
        {error && (
          <div style={{ color: 'red', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <Link to="/books" style={{ textAlign: 'center', display: 'block', marginTop: '20px' }}>
          Back to Books List
        </Link>
      </div>
    </div>
  );
};

export default Add;
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ComboBox from '../components/ComboBox';

const Update = () => {
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isbn, setIsbn] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [currentImage, setCurrentImage] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [error, setError] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.get(`${API_URL}/api/books/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      const book = res.data;
      setTitle(book.Title || '');
      setAuthorId(book.AuthorID || '');
      setSelectedAuthor(book.AuthorID || '');
      setCategoryId(book.CategoryID || '');
      setSelectedCategory(book.CategoryID || '');
      setIsbn(book.ISBN || '');
      setPrice(book.Price || '');
      setDescription(book.Description || '');
      setStockQuantity(book.StockQuantity || '');
      setPublishedDate(book.PublishedDate ? book.PublishedDate.split('T')[0] : '');
      setCurrentImage(book.CoverImage || '');
    })
    .catch(err => {
      console.log(err);
      setError("Failed to load book. Make sure you're logged in as admin.");
    });
  }, [id]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCategoryId(value);
  };

  const handleAuthorChange = (value) => {
    setSelectedAuthor(value);
    setAuthorId(value);
  };

  const handleFile = (e) => { 
    setFile(e.target.files[0]);
  }

  const handleClick = async (e) => {
    e.preventDefault();
    
    if (!title || !selectedCategory || !price) {
      setError("Title, Category, and Price are required");
      return;
    }

    const formdata = new FormData();
    
    formdata.append('title', title);
    formdata.append('authorId', authorId);
    formdata.append('categoryId', selectedCategory);
    formdata.append('isbn', isbn);
    formdata.append('price', price);
    formdata.append('description', description);
    formdata.append('stockQuantity', stockQuantity);
    formdata.append('publishedDate', publishedDate);
    if (file) {
      formdata.append('image', file);
    }

    const token = localStorage.getItem('token');

    try {
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
await axios.put(`${API_URL}/api/books/${id}`, formdata, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate("/books");
    } catch (err) {
      console.log(err);
      setError("Failed to update book. Make sure you're logged in as admin.");
    }
  };

  return (
    <div className="form-container"> 
      <div className="form">
        <h1>Update Book</h1>
        
        <input
          type="text"
          placeholder="Book Title"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left', color: '#ccc' }}>Author</label>
          <ComboBox 
            type="author"
            onSelectChange={handleAuthorChange}
            initialValue={selectedAuthor}
          />
        </div>

        <div style={{ width: '100%', maxWidth: '300px' }}>
          <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left', color: '#ccc' }}>Category</label>
          <ComboBox 
            onSelectChange={handleCategoryChange}
            initialValue={selectedCategory}
          />
        </div>

        <input
          type="text"
          placeholder="ISBN"
          name="isbn"
          value={isbn}
          onChange={e => setIsbn(e.target.value)}
        />
        
        <input
          type="number"
          placeholder="Price ($)"
          name="price"
          value={price}
          step="0.01"
          onChange={e => setPrice(e.target.value)}
          required
        />
        
        <input
          type="number"
          placeholder="Stock Quantity"
          name="stockQuantity"
          value={stockQuantity}
          onChange={e => setStockQuantity(e.target.value)}
        />
        
        <input
          type="date"
          placeholder="Published Date"
          name="publishedDate"
          value={publishedDate}
          onChange={e => setPublishedDate(e.target.value)}
        />
        
        <textarea
          placeholder="Book Description"
          name="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows="4"
        />
        
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left', color: '#ccc' }}>
            Current Cover Image:
          </label>
          {currentImage ? (
            <img 
              src={`data:image/png;base64,${currentImage}`} 
              alt="Current cover" 
              style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px' }}
            />
          ) : (
            <p style={{ color: '#888' }}>No image uploaded</p>
          )}
        </div>
        
        <input
          type="file"
          placeholder="New Cover Image (optional)"
          name="image"
          onChange={handleFile}
          accept="image/*"
        />
        
        <button onClick={handleClick}>Update Book</button>
        
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

export default Update;
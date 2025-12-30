import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/Style.css';

const Books = () => {
  const [books, setBooks] = useState([]);
 
  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const res = await axios.get(`${API_URL}/api/books`);
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBooks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }
    
    const token = localStorage.getItem('token');
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
await axios.delete(`${API_URL}/api/books/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBooks(books.filter(book => book.BookID !== id));
    } catch (err) {
      console.log(err);
      alert("Failed to delete book. Make sure you're logged in as admin.");
    }
  };

  return (
    <div className="app">
      <div>
        <h1 align='center'>Book Management</h1>
        <button className="addHome">
          <Link to="/add" style={{ color: "inherit", textDecoration: "none" }}>
            Add New Book +
          </Link>
        </button>
        
        <div className="books">
          <table border='2' width='80%'>
            <thead> 
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price ($)</th>
                <th>Stock</th>
                <th>Cover Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.BookID}>
                  <td>{book.Title}</td>
                  <td>{book.AuthorName || 'Unknown'}</td>
                  <td>{book.CategoryName || 'Uncategorized'}</td>
                  <td>${book.Price}</td>
                  <td>{book.StockQuantity}</td>
                  <td>
                    {book.CoverImage ? (
                      <img 
                        src={`data:image/png;base64,${book.CoverImage}`} 
                        alt={book.Title} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>
                    <button className="delete" onClick={() => handleDelete(book.BookID)}>
                      Delete
                    </button>
                    <button className="update">
                      <Link 
                        to={`/update/${book.BookID}`} 
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        Update
                      </Link>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {books.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>No books found. Add your first book!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
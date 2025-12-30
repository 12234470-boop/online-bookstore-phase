import React, { useState, useEffect } from "react";
import axios from "axios";
import BookItem from "../components/BookItem";
import "../styles/Menu.css";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

function Menu() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/books"),
          axios.get("http://localhost:5000/api/books/categories")
        ]);
        
        setBooks(booksRes.data);
        setFilteredBooks(booksRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load books.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  // In Menu.js, add this useEffect to check the data:
useEffect(() => {
  if (books.length > 0) {
    console.log("First book data:", books[0]);
    console.log("CoverImage exists?", !!books[0].CoverImage);
    console.log("CoverImage type:", typeof books[0].CoverImage);
    console.log("CoverImage length:", books[0].CoverImage?.length);
  }
}, [books]);

  // Apply filters
  useEffect(() => {
    let result = books;
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(book => 
        book.Title.toLowerCase().includes(term) ||
        (book.AuthorName && book.AuthorName.toLowerCase().includes(term))
      );
    }
    
    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(book => book.CategoryID == selectedCategory);
    }
    
    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "title-asc") return a.Title.localeCompare(b.Title);
      if (sortBy === "title-desc") return b.Title.localeCompare(a.Title);
      if (sortBy === "price-low") return (a.Price || 0) - (b.Price || 0);
      if (sortBy === "price-high") return (b.Price || 0) - (a.Price || 0);
      return (b.BookID || 0) - (a.BookID || 0); // newest first
    });
    
    setFilteredBooks(result);
  }, [searchTerm, selectedCategory, sortBy, books]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("newest");
  };

  return (
    <div className="menu">
      <h1 className="menuTitle">Our Book Collection</h1>
      
      {/* Search Bar */}
      <div className="search-filter-container">
        <div className="search-box">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <CloseIcon />
            </button>
          )}
        </div>
        
        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <FilterListIcon /> {showFilters ? "Hide" : "Show"} Filters
        </button>
      </div>
      
      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Category:</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.CategoryID} value={cat.CategoryID}>{cat.CategoryName}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>
          
          <button className="clear-filters" onClick={clearFilters}>Clear Filters</button>
          <div className="results-count">Showing {filteredBooks.length} books</div>
        </div>
      )}
      
      
      {/* Results Count */}
      <div className="results-summary">
        <p className="book-count">{filteredBooks.length} books found</p>
      </div>
      
      {/* Loading/Error States */}
      {loading && <div className="loading-message">Loading books...</div>}
      {error && <div className="error-message">{error}</div>}
      
      {/* Books Grid */}
      {!loading && !error && (
        <>
          {filteredBooks.length > 0 ? (
            <div className="menuList">
              {filteredBooks.map((book) => (
                <BookItem
                  key={book.BookID}
                  image={book.CoverImage ? `data:image/png;base64,${book.CoverImage}` : ''}
                  title={book.Title}
                  author={book.AuthorName || 'Unknown'}
                  price={book.Price ? `$${book.Price}` : '$0.00'}
                  category={book.CategoryName || 'Uncategorized'}
                  description={book.Description}
                  stock={book.StockQuantity}
                />
              ))}
            </div>
          ) : (
            <div className="no-books-message">
              <p>No books found.</p>
              <button className="reset-search" onClick={clearFilters}>Reset Filters</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Menu;
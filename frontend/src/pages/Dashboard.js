import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";
import BookIcon from '@mui/icons-material/Book';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCategories: 0,
    totalAuthors: 0,
    lowStock: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [statsRes, booksRes] = await Promise.all([
        axios.get("http://localhost:5000/api/dashboard/stats", {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/books", {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data);
      // Get 5 most recent books
      const recent = booksRes.data.slice(0, 5);
      setRecentBooks(recent);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: "Total Books", 
      value: stats.totalBooks, 
      icon: <BookIcon />, 
      color: "#6200ea",
      link: "/books"
    },
    { 
      title: "Categories", 
      value: stats.totalCategories, 
      icon: <CategoryIcon />, 
      color: "#00bcd4",
      link: "/books"
    },
    { 
      title: "Authors", 
      value: stats.totalAuthors, 
      icon: <PersonIcon />, 
      color: "#4caf50",
      link: "/books"
    },
    { 
      title: "Low Stock", 
      value: stats.lowStock, 
      icon: <WarningIcon />, 
      color: "#ff9800",
      link: "/books"
    }
  ];

  const quickActions = [
    { title: "Add New Book", icon: <AddCircleIcon />, link: "/add", color: "#6200ea" },
    { title: "Manage Books", icon: <BookIcon />, link: "/books", color: "#2196f3" },
    { title: "View Categories", icon: <CategoryIcon />, link: "/books", color: "#4caf50" },
    { title: "See All Authors", icon: <RecentActorsIcon />, link: "/books", color: "#ff9800" }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to your bookstore management panel</p>
      </div>

      {loading ? (
        <div className="loading-dashboard">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            {statCards.map((stat, index) => (
              <Link to={stat.link} key={index} className="stat-card-link">
                <div className="stat-card" style={{ borderLeftColor: stat.color }}>
                  <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-content">
                    <h3>{stat.title}</h3>
                    <div className="stat-value">{stat.value}</div>
                  </div>
                  <div className="stat-trend">
                    <TrendingUpIcon />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              {quickActions.map((action, index) => (
                <Link to={action.link} key={index} className="action-card">
                  <div className="action-icon" style={{ color: action.color }}>
                    {action.icon}
                  </div>
                  <h3>{action.title}</h3>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Books */}
          <div className="dashboard-section">
            <h2>Recently Added Books</h2>
            {recentBooks.length > 0 ? (
              <div className="recent-books">
                <table>
                  <thead>
                    <tr>
                      <th>Cover</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBooks.map(book => (
                      <tr key={book.BookID}>
                        <td>
                          {book.CoverImage ? (
                            <img 
                              src={`data:image/png;base64,${book.CoverImage}`} 
                              alt={book.Title}
                              className="book-cover"
                            />
                          ) : (
                            <div className="no-cover">📚</div>
                          )}
                        </td>
                        <td>{book.Title}</td>
                        <td>{book.AuthorName || 'Unknown'}</td>
                        <td>${book.Price || '0.00'}</td>
                        <td>
                          <span className={`stock-badge ${book.StockQuantity < 10 ? 'low' : 'good'}`}>
                            {book.StockQuantity}
                          </span>
                        </td>
                        <td>
                          <Link to={`/update/${book.BookID}`} className="edit-btn">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recentBooks.length === 5 && (
                  <div className="view-all">
                    <Link to="/books">View All Books →</Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-data">
                <p>No books added yet. Start by adding your first book!</p>
                <Link to="/add" className="add-first-btn">
                  <AddCircleIcon /> Add First Book
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
import './App.css';
import NavBar from "./components/NavBar";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Home from './pages/Home';
import Books from './pages/Books';
import Add from './pages/Add';
import Update from './pages/Update';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './styles/Style.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    if (user && user.role !== 'admin') {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <div className="App">
      <Router>
        <NavBar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
        <div style={{ flex: 1, paddingBottom: '100px' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" exact element={<Home />} />
            <Route path="/menu" exact element={<Menu />} />
            <Route path="/about" exact element={<About />} />
            <Route path="/contact" exact element={<Contact />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            
            {/* Protected Routes - Need authentication */}
            <Route path="/books" element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - Need admin role */}
            <Route path="/dashboard" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } />
            
            <Route path="/add" element={
              <AdminRoute>
                <Add />
              </AdminRoute>
            } />
            
            <Route path="/update/:id" element={
              <AdminRoute>
                <Update />
              </AdminRoute>
            } />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
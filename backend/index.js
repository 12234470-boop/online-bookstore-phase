import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());

app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'images/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "_" + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// MySQL connection - changed database to bookstore_db
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "bookstore_db",
  port: process.env.MYSQL_PORT || 3306
});
// JWT Secret Key
const JWT_SECRET = 'bookstore-secret-key-change-in-production';

// Hardcoded admin credentials (for simplicity)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// ========== AUTHENTICATION MIDDLEWARE ==========
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Admin access required' });
  }
};

// ========== AUTHENTICATION ENDPOINTS ==========

// Admin Login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign(
      { 
        username: username, 
        role: 'admin',
        userId: 1 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    return res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        username: username,
        role: 'admin'
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }
});

// Verify Token
app.get("/api/auth/verify", authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

// ========== CATEGORIES ENDPOINTS (replaces majors) ==========

// Get all categories
app.get('/api/books/categories', (req, res) => {
  const q = "SELECT * FROM categories";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// ========== BOOKS ENDPOINTS (replaces students) ==========

// Get all books (public - no auth required)
app.get("/api/books", (req, res) => {
  const q = `
    SELECT b.*, c.CategoryName, a.AuthorName 
    FROM books b 
    LEFT JOIN categories c ON b.CategoryID = c.CategoryID
    LEFT JOIN authors a ON b.AuthorID = a.AuthorID
    ORDER BY b.BookID DESC
  `;
  
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    
    // Convert images to base64 if they exist
    for (const book of data) {
      if (book.CoverImage) {
        try {
          const imagePath = `./images/${book.CoverImage}`;
          if (fs.existsSync(imagePath)) {
            book.CoverImage = fs.readFileSync(imagePath).toString('base64');
          }
        } catch (error) {
          console.log(`Error reading image for book ${book.BookID}:`, error);
        }
      }
    }
    
    return res.json(data);
  });
});

// Get single book (public - no auth required)
app.get('/api/books/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const q = `
      SELECT b.*, c.CategoryName, a.AuthorName 
      FROM books b 
      LEFT JOIN categories c ON b.CategoryID = c.CategoryID
      LEFT JOIN authors a ON b.AuthorID = a.AuthorID
      WHERE b.BookID = ?
    `;
    
    db.query(q, [id], (err, rows) => {
      if (err) {
        console.error('Error fetching book:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (rows.length > 0) {
        const book = rows[0];
        if (book.CoverImage) {
          try {
            const imagePath = `./images/${book.CoverImage}`;
            if (fs.existsSync(imagePath)) {
              book.CoverImage = fs.readFileSync(imagePath).toString('base64');
            }
          } catch (error) {
            console.log(`Error reading image:`, error);
          }
        }
        res.json(book);
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new book (admin only)
app.post("/api/books", authenticateToken, isAdmin, upload.single('image'), (req, res) => {
  const {
    title,
    authorId,
    categoryId,
    isbn,
    price,
    description,
    stockQuantity,
    publishedDate
  } = req.body;
  
  const image = req.file ? req.file.filename : null;
  
  const q = `
    INSERT INTO books(
      Title, AuthorID, CategoryID, ISBN, Price, 
      Description, CoverImage, StockQuantity, PublishedDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    title,
    authorId || null,
    categoryId || null,
    isbn || null,
    price || 0.00,
    description || '',
    image,
    stockQuantity || 0,
    publishedDate || null
  ];
  
  db.query(q, values, (err, data) => {
    if (err) {
      console.error('Error creating book:', err);
      return res.status(500).json({ error: 'Failed to create book' });
    }
    return res.json({
      success: true,
      message: 'Book created successfully',
      bookId: data.insertId
    });
  });
});

// Update book (admin only)
app.put("/api/books/:id", authenticateToken, isAdmin, upload.single('image'), (req, res) => {
  const id = req.params.id;
  const {
    title,
    authorId,
    categoryId,
    isbn,
    price,
    description,
    stockQuantity,
    publishedDate
  } = req.body;
  
  // First, check if book exists and get current image
  const checkQ = "SELECT CoverImage FROM books WHERE BookID = ?";
  db.query(checkQ, [id], (checkErr, checkResult) => {
    if (checkErr || checkResult.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    const currentImage = checkResult[0].CoverImage;
    let newImage = currentImage;
    
    // If new image uploaded, use it
    if (req.file) {
      newImage = req.file.filename;
      // Delete old image if exists
      if (currentImage) {
        const oldPath = `./images/${currentImage}`;
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting old image:', unlinkErr);
          });
        }
      }
    }
    
    const q = `
      UPDATE books SET 
        Title = ?, 
        AuthorID = ?, 
        CategoryID = ?, 
        ISBN = ?, 
        Price = ?, 
        Description = ?, 
        CoverImage = ?, 
        StockQuantity = ?, 
        PublishedDate = ?
      WHERE BookID = ?
    `;
    
    const values = [
      title,
      authorId || null,
      categoryId || null,
      isbn || null,
      price || 0.00,
      description || '',
      newImage,
      stockQuantity || 0,
      publishedDate || null,
      id
    ];
    
    db.query(q, values, (err, data) => {
      if (err) {
        console.error('Error updating book:', err);
        return res.status(500).json({ error: 'Failed to update book' });
      }
      return res.json({
        success: true,
        message: 'Book updated successfully'
      });
    });
  });
});

// Delete book (admin only)
app.delete("/api/books/:id", authenticateToken, isAdmin, (req, res) => {
  const id = req.params.id;
  
  // First, get the image filename to delete it
  const getImageQ = "SELECT CoverImage FROM books WHERE BookID = ?";
  db.query(getImageQ, [id], (getErr, getResult) => {
    if (getErr) {
      return res.status(500).json({ error: 'Error finding book' });
    }
    
    if (getResult.length > 0 && getResult[0].CoverImage) {
      const filePath = `./images/${getResult[0].CoverImage}`;
      // Delete the image file
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr && unlinkErr.code !== 'ENOENT') {
          console.error('Error deleting image file:', unlinkErr);
        }
      });
    }
    
    // Then delete the book from database
    const deleteQ = "DELETE FROM books WHERE BookID = ?";
    db.query(deleteQ, [id], (deleteErr, data) => {
      if (deleteErr) {
        return res.status(500).json({ error: 'Failed to delete book' });
      }
      return res.json({
        success: true,
        message: 'Book deleted successfully'
      });
    });
  });
});

// ========== AUTHORS ENDPOINTS ==========

// Get all authors
app.get('/api/authors', (req, res) => {
  const q = "SELECT * FROM authors ORDER BY AuthorName";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});
// Add this to your backend index.js (after authors endpoint)
app.get("/api/dashboard/stats", authenticateToken, isAdmin, (req, res) => {
  const statsQueries = {
    totalBooks: "SELECT COUNT(*) as count FROM books",
    totalCategories: "SELECT COUNT(*) as count FROM categories",
    totalAuthors: "SELECT COUNT(*) as count FROM authors",
    lowStock: "SELECT COUNT(*) as count FROM books WHERE StockQuantity < 10"
  };
  
  const results = {};
  let completed = 0;
  const totalQueries = Object.keys(statsQueries).length;
  
  Object.keys(statsQueries).forEach((key) => {
    db.query(statsQueries[key], (err, data) => {
      if (err) {
        results[key] = 0;
      } else {
        results[key] = data[0].count;
      }
      
      completed++;
      if (completed === totalQueries) {
        res.json(results);
      }
    });
  });
});
// ========== DASHBOARD STATS (admin only) ==========

app.get("/api/dashboard/stats", authenticateToken, isAdmin, (req, res) => {
  const statsQueries = {
    totalBooks: "SELECT COUNT(*) as count FROM books",
    totalCategories: "SELECT COUNT(*) as count FROM categories",
    totalAuthors: "SELECT COUNT(*) as count FROM authors",
    lowStock: "SELECT COUNT(*) as count FROM books WHERE StockQuantity < 10"
  };
  
  const results = {};
  let completed = 0;
  const totalQueries = Object.keys(statsQueries).length;
  
  Object.keys(statsQueries).forEach((key, index) => {
    db.query(statsQueries[key], (err, data) => {
      if (err) {
        results[key] = 0;
      } else {
        results[key] = data[0].count;
      }
      
      completed++;
      if (completed === totalQueries) {
        res.json(results);
      }
    });
  });
});

app.listen(5000, () => {
  console.log("Bookstore backend server running on port 5000");
});
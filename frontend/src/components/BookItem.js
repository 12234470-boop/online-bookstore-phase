import React from "react";

function BookItem({ image, title, author, price, category, description, stock, rating }) {
  // Check if image is base64 or needs data URL prefix
  const getImageSrc = () => {
    if (!image) return '';
    
    // If already a data URL or regular URL
    if (image.startsWith('data:') || image.startsWith('http')) {
      return image;
    }
    
    // If it's base64 without prefix, add it
    if (image.length > 100 && !image.includes(' ')) {
      return `data:image/jpeg;base64,${image}`;
    }
    
    return '';
  };

  const imageSrc = getImageSrc();

  return (
    <div className="menuItem">
      <div 
        className="book-image"
        style={{ 
          backgroundImage: imageSrc ? `url(${imageSrc})` : 'none',
          backgroundSize: 'cover',
          backgroundColor: imageSrc ? 'transparent' : '#2d2d2d'
        }} 
      >
        {!imageSrc && <div className="no-image-placeholder">📚 No Cover</div>}
        {stock < 10 && stock > 0 && (
          <span className="book-badge">Low Stock: {stock}</span>
        )}
        {stock === 0 && (
          <span className="book-badge" style={{backgroundColor: '#c62828'}}>Out of Stock</span>
        )}
      </div>
      
      <div className="book-content">
        <h1>{title}</h1>
        
        <div className="book-author">by {author}</div>
        
        {description && (
          <div className="book-description">{description}</div>
        )}
        
        <div className="book-footer">
          <div className="book-price">{price}</div>
          <div className="book-category">{category}</div>
        </div>
        
        {rating && (
          <div className="book-rating">
            {"★".repeat(Math.floor(rating))}
            {"☆".repeat(5 - Math.floor(rating))}
            <span style={{marginLeft: '5px', color: '#888'}}>({rating})</span>
          </div>
        )}
        
        {stock !== undefined && (
          <div className="book-stock">
            {stock > 10 ? `📦 ${stock} in stock` : `⚠️ Only ${stock} left`}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookItem;
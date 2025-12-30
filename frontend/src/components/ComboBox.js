import React, { useState, useEffect } from 'react';

function ComboBox({ onSelectChange, type = "category", initialValue = "" }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Determine API endpoint based on type
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const apiEndpoint = type === "category" 
  ? `${API_URL}/api/books/categories`
  : type === "author"
  ? `${API_URL}/api/authors`
  : `${API_URL}/api/books/categories`;

    useEffect(() => {
        fetch(apiEndpoint) 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {   
                setItems(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            });
    }, [apiEndpoint]);

    const handleChange = (event) => {
        onSelectChange(event.target.value);
    };

    // Determine label based on type
    const placeholder = type === "category" 
        ? "Select a Category"
        : type === "author"
        ? "Select an Author"
        : "Select a Category";

    const valueField = type === "category" 
        ? "CategoryID"
        : type === "author"
        ? "AuthorID"
        : "CategoryID";

    const labelField = type === "category" 
        ? "CategoryName"
        : type === "author"
        ? "AuthorName"
        : "CategoryName";

    return(
        <select 
            onChange={handleChange} 
            className="form-select"
            value={initialValue}
            disabled={loading}
        >
            <option value="">{placeholder}</option>
            
            {loading && <option value="" disabled>Loading...</option>}
            
            {error && <option value="" disabled>Error loading {type}s</option>}
            
            {!loading && !error && items.map(item => (
                <option key={item[valueField]} value={item[valueField]}>
                    {item[labelField]}
                </option>
            ))}
        </select>
    );
}

export default ComboBox;
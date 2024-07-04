const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// Route to fetch the list of books using async/await with axios
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: `Error fetching books: ${error.message}` });
    }
});

// Get book details based on ISBN using async/await with axios
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/books/${isbn}`);
        if (response.data) {
            return res.status(200).json(response.data);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching book details: ${error.message}` });
    }
});

// Get book details based on author using async/await with axios
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const response = await axios.get('http://localhost:5000/books');
        const booksByAuthor = response.data.filter(book => book.author.toLowerCase() === author);
        if (booksByAuthor.length > 0) {
            return res.status(200).json(booksByAuthor);
        } else {
            return res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching books: ${error.message}` });
    }
});


// Get book details based on title using async/await with axios
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const response = await axios.get('http://localhost:5000/books');
        const booksByTitle = response.data.filter(book => book.title.toLowerCase() === title);
        if (booksByTitle.length > 0) {
            return res.status(200).json(booksByTitle);
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching books: ${error.message}` });
    }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;

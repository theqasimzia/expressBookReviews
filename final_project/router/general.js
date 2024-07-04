const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

<<<<<<< HEAD
// Route to fetch the list of books using async/await with axios
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: `Error fetching books: ${error.message}` });
=======
// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users[username] = { username, password };
    return res.status(201).json({ message: "User registered successfully" });
});



// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.status(200).json({ book: book });
    } else {
        res.status(404).json({ message: "Book not found" });
>>>>>>> 13f18b29e356b8239b19bbc2a47a194ba6de56f0
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

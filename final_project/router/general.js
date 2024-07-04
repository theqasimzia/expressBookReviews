const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    return res.status(300).json({ message: "Yet to be implemented" });
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
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const booksByAuthor = [];

    for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === author) {
            booksByAuthor.push(books[isbn]);
        }
    }

    if (booksByAuthor.length > 0) {
        res.status(200).json({ books: booksByAuthor });
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const booksByTitle = [];

    for (let isbn in books) {
        if (books[isbn].title.toLowerCase() === title) {
            booksByTitle.push(books[isbn]);
        }
    }

    if (booksByTitle.length > 0) {
        res.status(200).json({ books: booksByTitle });
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        res.status(200).json({ reviews: book.reviews });
    } else {
        res.status(404).json({ message: "Book or reviews not found" });
    }
});

module.exports.general = public_users;

const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

// Storage for registered users
let users = {};

// Function to check if a username exists in 'users' object
const isValid = (username) => {
    return users.hasOwnProperty(username);
}

// Function to authenticate a user based on username and password
const authenticatedUser = (username, password) => {
    return users[username] && users[username].password === password;
}

// Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
});

// Login for registered users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username) || !authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create a JWT token for session
    const accessToken = jwt.sign({ username: username }, "access");

    // Store token in session
    req.session.authorization = { accessToken };

    return res.status(200).json({ message: "User logged in successfully" });
});

// Add or modify a book review
regd_users.put("/reviews/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;

    if (!isbn || !review) {
        return res.status(400).json({ message: "ISBN and review are required" });
    }

    // Check if user is authenticated (e.g., ensure session exists and has username)
    if (!req.session || !req.session.authorization || !req.session.authorization.accessToken) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    // Verify and decode JWT token to get username
    jwt.verify(req.session.authorization.accessToken, "access", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Failed to authenticate token" });
        }

        const username = decoded.username;

        const book = books[isbn];

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Ensure 'reviews' is initialized as an array
        book.reviews = book.reviews || [];

        // Check if user has already reviewed this book
        const existingReviewIndex = book.reviews.findIndex(r => r.username === username);

        if (existingReviewIndex !== -1) {
            // Replace existing review
            book.reviews[existingReviewIndex].review = review;
        } else {
            // Add new review
            book.reviews.push({ username: username, review: review });
        }

        return res.status(200).json({
            message: "Review added successfully",
            book: book
        });
    });
});

// Delete a book review
regd_users.delete("/reviews/:isbn", (req, res) => {
    const { isbn } = req.params;

    // Check if user is authenticated (e.g., ensure session exists and has username)
    if (!req.session || !req.session.authorization || !req.session.authorization.accessToken) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    // Verify and decode JWT token to get username
    jwt.verify(req.session.authorization.accessToken, "access", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Failed to authenticate token" });
        }

        const username = decoded.username;

        const book = books[isbn];

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Ensure 'reviews' is initialized as an array
        book.reviews = book.reviews || [];

        // Filter out reviews not authored by the current user
        book.reviews = book.reviews.filter(r => r.username !== username);

        return res.status(200).json({
            message: "Review deleted successfully",
            book: book
        });
    });
});

// Endpoint to view all registered users
regd_users.get("/users", (req, res) => {
    return res.status(200).json(users);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

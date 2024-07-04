const express = require('express');
const axios = require('axios');
const session = require('express-session');
const books = require('./router/booksdb.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Middleware setup
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Route to serve books data
app.get('/books', (req, res) => {
    res.status(200).json(Object.values(books));
});

// Authentication middleware setup
app.use("/customer/auth/*", function auth(req, res, next) {
    // Write your authentication mechanism here
    next();
});

// Routes setup
const PORT = 5000;
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Server start
app.listen(PORT, () => console.log("Server is running on port", PORT));

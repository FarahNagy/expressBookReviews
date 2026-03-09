const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password)
    return res.status(403).json({ message: "username or password missing" });
  else {
    if (!isValid(username))
      return res.status(403).json({ message: "username exists" });
    else {
      users.push({ 'username': username, 'password': password })
      res.send("user with username " + username + " is created!");
    }
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here

  return res.send(JSON.stringify(books));
});


// Using Promise callbacks
function getBooks() {
  axios.get('http://localhost:5000/')
    .then((res) => {
      console.log("Books available :", res.data);
    })
    .catch((error) => {
      console.error("Error fetching books:", error.response?.data.message);
    });
}

// Call the function
getBooks();
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book);
  }
  else {
    return res.status(403).json({ message: 'book does not exist.' })
  }
});



// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let result = [];
  for (let isbn in books) {
    if (books[isbn].author === req.params.author) {
      result.push(books[isbn]);
    }
  }

  if (result.length > 0) {
    res.send(JSON.stringify(result));
  }
  else {
    return res.status(403).json({ message: "no matches." });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let check = false;
  for (let isbn in books) {
    if (books[isbn].title === req.params.title) {
      check = true;
      res.send(books[isbn]);

    }
  }
  if (!check) {
    return res.status(403).json({ message: "title does not exist" });
  }

  // return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book.reviews));
  }
  else {
    return res.status(403).json({ message: 'book does not exist.' })
  }
});

module.exports.general = public_users;

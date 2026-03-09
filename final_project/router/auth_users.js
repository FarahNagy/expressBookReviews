const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  for (let id in users) {
    console.log("printing user ", id)
    console.log("users count!: ", users.length)
    if (users[id].username === username)
      return false;
  }
  return true;

}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  for (i in users) {
    if (users[i].username === username && users[i].password === password) {
      return true;
    }
  }
  return false;

}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken, username
      }
      return res.status(200).send(`${username} successfully logged in`);
    }
  }

  return res.status(300).json({ message: "Cannot log in." });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.query.review;
  let book = books[isbn];
  const username = req.session.authorization['username'];
  book.reviews[username] = review;
  res.send("book review " + review + " added/modified");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  const username = req.session.authorization['username'];
    if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  const reviews = books[isbn].reviews;
  if (reviews[username]) {
    delete reviews[username];
    return res.send("Review posted by " + username + " deleted successfully.");
  } else {
    return res.status(404).json({ message: "No review found for this user" });
  }
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

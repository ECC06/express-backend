require("dotenv").config(); // Must be at the very top

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

// Replace with your actual string from Atlas:
const mongoURI = process.env.MONGO_URI;

// MongoDB Connection
mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Book Schema & Model
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    description: String,
});

const Book = mongoose.model("Book", bookSchema);

// Get all books
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get book(s) by author parameter
app.get("/books/author/:author", async (req, res) => {
    try {
        const books = await Book.find({ author: req.params.author });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new book
app.post("/books", async (req, res) => {
    try {
        const newBook = new Book({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
        });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}\n`);
});

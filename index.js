require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

const mongoURI = process.env.MONGO_URI;

mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.log("MongoDB connection error:", err));

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    description: String,
});

const Book = mongoose.model("Book", bookSchema);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const User = mongoose.model("User", userSchema);

app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/books/author/:author", async (req, res) => {
    try {
        const books = await Book.find({ author: req.params.author });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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

app.post(
    "/register",
    [
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLength({ min: 3, max: 20 })
            .withMessage("Username must be between 3 and 20 characters"),
        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const existingUser = await User.findOne({
                username: req.body.username,
            });

            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: "Username already exists" });
            }

            const passwordHash = await bcrypt.hash(req.body.password, 10);
            const user = new User({
                username: req.body.username,
                password: passwordHash,
            });

            await user.save();
            res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
);

app.post(
    "/login",
    [
        body("username").trim().notEmpty().withMessage("Username is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findOne({ username: req.body.username });

            if (!user) {
                return res
                    .status(400)
                    .json({ message: "Invalid username or password" });
            }

            const isMatch = await bcrypt.compare(
                req.body.password,
                user.password,
            );

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ message: "Invalid username or password" });
            }

            res.json({ message: "Login successful" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
);

app.listen(port, () => {
    console.log(`Server listening on port ${port}\n`);
});

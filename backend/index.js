require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const app = express();
const port = process.env.PORT;

app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Schemas & Models
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    description: String,
});
const Book = mongoose.model("Book", bookSchema);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Helper for express-validator results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    next();
};

// Book Routes
app.get("/books", async (req, res) => {
    try {
        res.json(await Book.find());
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/books/author/:author", async (req, res) => {
    try {
        res.json(await Book.find({ author: req.params.author }));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/books", async (req, res) => {
    try {
        const savedBook = await Book.create(req.body);
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Auth Routes
app.post(
    "/register",
    [
        body("username")
            .trim()
            .isLength({ min: 3, max: 20 })
            .withMessage("Username must be 3-20 characters"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
        validate,
    ],
    async (req, res) => {
        try {
            const { username, password } = req.body;
            if (await User.findOne({ username })) {
                return res
                    .status(400)
                    .json({ message: "Username already exists" });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            await User.create({ username, password: passwordHash });

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
        validate,
    ],
    async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });

            if (!user || !(await bcrypt.compare(password, user.password))) {
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

app.listen(port, () => console.log(`Server listening on port ${port}`));

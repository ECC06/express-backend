require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Shoe Store Schema & Model
const shoeSchema = new mongoose.Schema({
    brand: String,
    sizeEU: String,
    price: String,
});

const Shoe = mongoose.model("Shoe", shoeSchema);

// GET all shoe entries
app.get("/shoes", async (req, res) => {
    try {
        const shoes = await Shoe.find();
        res.json(shoes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET shoe entry by menShoes param
app.get("/shoes/brand/:brand", async (req, res) => {
    try {
        const shoes = await Shoe.find({ menShoes: req.params.brand });
        res.json(shoes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new shoe entry
app.post("/shoes", async (req, res) => {
    try {
        const newShoe = new Shoe({
            brand: req.body.brand,
            sizeEU: req.body.sizeEU,
            price: req.body.price,
        });
        const savedShoe = await newShoe.save();
        res.status(201).json(savedShoe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

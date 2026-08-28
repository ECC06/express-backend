const express = require("express");
const app = express();

const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

let books = [];

app.get("/books", (req, res) => {
    res.json(books);
});

app.post("/books", (req, res) => {
    const newBook = {
        id: Date.now().toString(),
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
    const id = req.params.id;
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            id: id,
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
        };
        res.json(books[index]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

app.delete("/books/:id", (req, res) => {
    const id = req.params.id;
    books = books.filter((book) => book.id !== id);
    res.json({ message: "Book deleted" });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}\n`);
});

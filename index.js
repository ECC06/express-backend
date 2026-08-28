const express = require("express");
const app = express();

const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

let shoes = [];

app.get("/shoes", (req, res) => {
    res.json(shoes);
});

app.post("/shoes", (req, res) => {
    const newShoe = {
        id: Date.now().toString(),
        menShoes: req.body.menShoes,
        ladiesShoes: req.body.ladiesShoes,
        kidsShoes: req.body.kidsShoes,
    };
    shoes.push(newShoe);
    res.status(201).json(newShoe);
});

app.put("/shoes/:id", (req, res) => {
    const id = req.params.id;
    const index = shoes.findIndex((shoe) => shoe.id === id);

    if (index !== -1) {
        shoes[index] = {
            id: id,
            menShoes: req.body.menShoes,
            ladiesShoes: req.body.ladiesShoes,
            kidsShoes: req.body.kidsShoes,
        };
        res.json(shoes[index]);
    } else {
        res.status(404).json({ message: "Shoe store entry not found" });
    }
});

app.delete("/shoes/:id", (req, res) => {
    const id = req.params.id;
    shoes = shoes.filter((shoe) => shoe.id !== id);
    res.json({ message: "Shoe store entry deleted" });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}\n`);
});

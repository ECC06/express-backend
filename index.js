const express = require("express");
const { body, validationResult } = require("express-validator");

const app = express();
app.use(express.json());

const accounts = [];

app.get("/accounts", (req, res) => {
    res.json(accounts);
});

app.post(
    "/accounts",
    [
        body("branch").notEmpty(),
        body("location").notEmpty(),
        body("address").notEmpty(),
        body("accountNumber")
            .isNumeric()
            .isLength({ min: 10, max: 10 })
            .custom((value) => {
                const exists = accounts.find(
                    (acc) => acc.accountNumber === value,
                );
                if (exists) {
                    throw new Error("Account number already exists");
                }
                return true;
            }),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newAccount = {
            branch: req.body.branch,
            location: req.body.location,
            address: req.body.address,
            accountNumber: req.body.accountNumber,
        };

        accounts.push(newAccount);
        console.log(accounts);
        res.status(201).json({
            message: "Account created successfully",
            account: newAccount,
        });
    },
);

app.listen(3000, () => {
    console.log("listening on port 3000");
});

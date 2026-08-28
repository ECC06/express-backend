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
        body("name").notEmpty(),
        body("accountNumber")
            .notEmpty()
            .custom((value) => {
                const exists = accounts.find(
                    (acc) => acc.accountNumber === value,
                );
                if (exists) {
                    throw new Error("Account number already exists");
                }
                return true;
            }),
        body("phoneNumber")
            .notEmpty()
            .custom((value) => {
                const exists = accounts.find(
                    (acc) => acc.phoneNumber === value,
                );
                if (exists) {
                    throw new Error("Phone number already exists");
                }
                return true;
            })
            .custom((value) => {
                const ghanaRegex = /^(?:\+233|0)\d{9}$/;
                const nigeriaRegex = /^(?:\+234|0)\d{10}$/;

                if (!ghanaRegex.test(value) && !nigeriaRegex.test(value)) {
                    throw new Error(
                        "Phone number must be a valid Ghana or Nigeria number",
                    );
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
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            accountNumber: req.body.accountNumber,
        };

        accounts.push(newAccount);

        res.status(201).json({
            message: "Account created successfully",
            account: newAccount,
        });
    },
);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

const express = require('express');
const app = express();

app.use(express.json());

/* =======================
   Middleware (Role Check)
======================= */
function checkRole(allowedRoles) {
    return (req, res, next) => {
        const role = req.headers.role;

        if (!role) {
            return res.status(401).json({ message: "Role header missing" });
        }

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    };
}

/* =======================
   In-Memory Data Storage
======================= */
let users = [];
let idCounter = 1;

let records = [];
let recordId = 1;

/* =======================
   Test Route
======================= */
app.get('/', (req, res) => {
    res.send('Server is running');
});

/* =======================
   USER APIs
======================= */

// Create User (Admin only)
app.post('/users', checkRole(['admin']), (req, res) => {
    const { name, role } = req.body;

    if (!name || !role) {
        return res.status(400).json({ message: "Name and role required" });
    }

    const validRoles = ['admin', 'analyst', 'viewer'];

    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    const newUser = {
        id: idCounter++,
        name,
        role,
        status: "active"
    };

    users.push(newUser);

    res.status(201).json(newUser);
});

// Get Users (Admin only)
app.get('/users', checkRole(['admin']), (req, res) => {
    res.json(users);
});

/* =======================
   RECORD APIs
======================= */

// Create Record (Admin only)
app.post('/records', checkRole(['admin']), (req, res) => {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category || !date) {
        return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (type !== "income" && type !== "expense") {
        return res.status(400).json({ message: "Type must be income or expense" });
    }

    if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({ message: "Amount must be a positive number" });
    }

    const newRecord = {
        id: recordId++,
        amount,
        type,
        category,
        date,
        notes: notes || ""
    };

    records.push(newRecord);

    res.status(201).json(newRecord);
});

// Get Records (All roles)
app.get('/records', checkRole(['admin', 'analyst', 'viewer']), (req, res) => {
    res.json(records);
});

// Update Record (Admin only)
app.put('/records/:id', checkRole(['admin']), (req, res) => {
    const id = parseInt(req.params.id);
    const record = records.find(r => r.id === id);

    if (!record) {
        return res.status(404).json({ message: "Record not found" });
    }

    const { amount, type, category, date, notes } = req.body;

    if (amount !== undefined) record.amount = amount;
    if (type) record.type = type;
    if (category) record.category = category;
    if (date) record.date = date;
    if (notes !== undefined) record.notes = notes;

    res.json(record);
});

// Delete Record (Admin only)
app.delete('/records/:id', checkRole(['admin']), (req, res) => {
    const id = parseInt(req.params.id);
    const index = records.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Record not found" });
    }

    records.splice(index, 1);

    res.json({ message: "Record deleted" });
});

/* =======================
   SUMMARY API
======================= */

app.get('/summary', checkRole(['admin', 'analyst']), (req, res) => {
    let totalIncome = 0;
    let totalExpense = 0;
    let categoryTotals = {};

    records.forEach(record => {
        if (record.type === "income") {
            totalIncome += record.amount;
        } else if (record.type === "expense") {
            totalExpense += record.amount;
        }

        if (!categoryTotals[record.category]) {
            categoryTotals[record.category] = 0;
        }
        categoryTotals[record.category] += record.amount;
    });

    const netBalance = totalIncome - totalExpense;

    res.json({
        totalIncome,
        totalExpense,
        netBalance,
        categoryTotals
    });
});

/* =======================
   404 Handler
======================= */
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

/* =======================
   Start Server
======================= */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
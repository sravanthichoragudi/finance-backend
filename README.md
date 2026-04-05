# 💰 Finance Backend API

A lightweight and extensible backend service for managing financial transactions with role-based access control. Designed for clarity, simplicity, and real-world backend practices using Node.js and Express.

---

## 🚀 Overview

This project provides a RESTful API for handling:

* User management with roles
* Financial transaction tracking
* Summary analytics for income and expenses

The system follows a **role-based access model** to ensure that only authorized users can perform sensitive operations.

> ⚠️ This project uses **in-memory storage**, making it ideal for demos, testing, and learning purposes. Data resets when the server restarts.

---

## 🧩 Key Features

### 🔐 Access Control

* Three roles: `admin`, `analyst`, `viewer`
* Middleware-based authorization
* Clear separation of permissions per endpoint

### 💼 Core Functionality

* Create, read, update, delete financial records
* Categorized transactions
* Real-time summary (income, expenses, balance)

### ⚙️ Engineering Focus

* Clean and readable structure
* Explicit validation rules
* Consistent error handling
* Minimal dependencies

---

## 🛠 Tech Stack

* Node.js
* Express.js
* JavaScript (ES6+)

---

## 📁 Project Structure

```
finance-backend/
├── index.js          # App entry point (routes + logic)
├── package.json      # Dependencies & scripts
├── README.md         # Documentation
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/sravanthichoragudi/finance-backend.git
cd finance-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Server

```bash
node index.js
```

Server starts at:

```
http://localhost:3000
```

---

## 📡 API Usage

### Headers (Required for most endpoints)

```
role: admin | analyst | viewer
Content-Type: application/json
```

---

## 👥 Roles & Permissions

| Role    | Capabilities                       |
| ------- | ---------------------------------- |
| Admin   | Full access (CRUD users & records) |
| Analyst | Read records + view summary        |
| Viewer  | Read-only access                   |

---

## 💰 Financial Records

### Create Record (Admin only)

```http
POST /records
```

```json
{
  "amount": 1000,
  "type": "expense",
  "category": "food",
  "date": "2026-04-03",
  "notes": "Lunch"
}
```

### Get Records

```http
GET /records
```

### Update Record

```http
PUT /records/:id
```

### Delete Record

```http
DELETE /records/:id
```

---

## 📊 Summary Endpoint

```http
GET /summary
```

Returns:

```json
{
  "totalIncome": 5000,
  "totalExpense": 2000,
  "netBalance": 3000,
  "categoryTotals": {
    "salary": 5000,
    "food": 2000
  }
}
```

---

## ⚠️ Validation Rules

* `amount` → must be a positive number
* `type` → only `income` or `expense`
* `date` → required (YYYY-MM-DD)
* `role` → must be valid

---

## ❗ Error Handling Strategy

The API returns consistent JSON errors:

```json
{
  "message": "Error description"
}
```

### Common Cases

| Scenario            | Response |
| ------------------- | -------- |
| Missing role header | 401      |
| Invalid role        | 400      |
| Unauthorized action | 403      |
| Resource not found  | 404      |

---

## 🔍 Edge Cases Considered

* Invalid transaction types rejected early
* Negative or zero amounts blocked
* Partial updates supported safely
* Role spoofing prevented via strict checks
* Empty datasets handled without crashes
* Summary calculation works with mixed or no data

---

## 🧪 Testing Tips

You can test quickly using:

* Postman
* Thunder Client (VS Code)

Example:

```bash
GET /records
Header: role = viewer
```

---

## 🚧 Limitations

* No database (data resets on restart)
* No authentication (role passed via headers)
* No pagination or filtering yet
* No concurrency safeguards

---

## 🔮 Possible Improvements

* JWT authentication
* Database integration (MongoDB / PostgreSQL)
* Pagination & filtering
* Logging system
* Unit & integration tests
* Docker support

---

## 👨‍💻 Author

**Choragudi Lakshmi Naga Sravanthi**

GitHub: https://github.com/sravanthichoragudi/finance-backend
Email: [sravanthichoragudi09@gmail.com](mailto:sravanthichoragudi09@gmail.com)

---

## 📌 Final Note

This project focuses on **clean backend fundamentals** rather than over-engineering. It’s structured to be easily extendable into a production-ready system with proper authentication and database integration.

---

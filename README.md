# UltimateSchool 🏫

> **भारत के विद्यालयों का डिजिटल प्लेटफॉर्म** — A complete, multi-tenant School ERP for Indian schools.

[![CI/CD](https://github.com/Abhaytomar09/ultimateschool/actions/workflows/ci.yml/badge.svg)](https://github.com/Abhaytomar09/ultimateschool/actions)

---

## 🌟 Features

- 🔐 **Role-Based Auth** — Admin, Teacher, Student, Parent (JWT)
- 📅 **Smart Timetable** — Auto-generate daily classes from a weekly schedule
- ✅ **Attendance Tracking** — Session-based with network failure handling (75% rule)
- 📝 **Assignments & Report Cards** — Full academic lifecycle
- 💰 **Fee Management** — Track fees in **₹ (Indian Rupees)** with PDF receipts
- 📊 **Performance Analytics** — Topic-level weakness detection and improvement strategy
- 🏆 **Ranking System** — Exams 60% + Assignments 25% + Attendance 15%
- 📢 **Broadcast Messaging** — Class and subject-based announcements
- 🤖 **AI Insights** — Detect weak topics and generate improvement suggestions

---

## 🇮🇳 Indian Localization

- Currency: **₹ (Indian Rupees)** — No $, €, or foreign symbols
- Date format: **DD-MM-YYYY**
- Terminology: **Class** (not Grade), **Section** (10A, 10B), **Roll Number**
- Academic Year: **2025–2026**

---

## 🗂 Project Structure

```
ultimateschool/
├── client/          # React + Vite frontend
│   └── src/
│       ├── context/    # Auth context
│       ├── pages/      # Login, Student, Teacher, Parent, Admin dashboards
│       ├── components/ # Sidebar, Topbar (AppShell)
│       └── utils/      # Indian formatting helpers
├── server/          # Node.js + Express backend
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── controllers/    # Business logic
│   └── middleware/     # JWT auth, role check
└── .github/
    └── workflows/      # CI/CD pipeline
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### Backend

```bash
cd server
cp .env.example .env       # Add your MongoDB URI and JWT secret
npm install
npm run dev                # Starts on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev                # Starts on http://127.0.0.1:5173
```

### Demo Mode

Open the frontend, select any role, enter any User ID, and use **`demo123`** as the password to preview all four dashboards.

---

## 🔑 Auto-Generated IDs

| Role    | Format  | Example  |
|---------|---------|----------|
| Student | `STxxxx`| `ST0001` |
| Teacher | `THxxxx`| `TH0001` |
| Father  | `PFxxxx`| `PF0001` |
| Mother  | `PMxxxx`| `PM0001` |
| Admin   | `ADxxxx`| `AD0001` |

IDs are stored in lowercase and displayed in **UPPERCASE**. Case-insensitive input is handled automatically.

---

## 🔐 GitHub Secrets Required

Add these in **Settings → Secrets → Actions**:

| Secret Name   | Value                        |
|---------------|------------------------------|
| `MONGODB_URI` | Your MongoDB Atlas URI       |
| `JWT_SECRET`  | A strong random string       |

---

## 📦 Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React + Vite            |
| Backend  | Node.js + Express.js    |
| Database | MongoDB (Mongoose)      |
| Auth     | JWT (JSON Web Tokens)   |
| CI/CD    | GitHub Actions          |
